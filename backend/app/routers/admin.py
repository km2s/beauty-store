from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.database import supabase, supabase_admin
from app.routers.users import get_user_id
from app.config import settings

router = APIRouter()


def require_admin(authorization: str) -> str:
    user_id = get_user_id(authorization)
    user = supabase_admin.auth.admin.get_user_by_id(user_id)
    email = user.user.email.lower() if user.user else ""
    if email not in settings.get_admin_emails():
        raise HTTPException(status_code=403, detail="Acesso restrito a administradores")
    return user_id


# ── Stats ─────────────────────────────────────────────────────────────────────

@router.get("/stats")
async def get_stats(authorization: str = Header(...)):
    require_admin(authorization)

    products = supabase.table("products").select("id", count="exact").execute()
    orders = supabase.table("orders").select("id, total, status").execute()
    users = supabase.table("profiles").select("id", count="exact").execute()

    total_revenue = sum(o["total"] for o in orders.data if o["status"] in ("paid", "delivered", "shipped"))
    pending_orders = sum(1 for o in orders.data if o["status"] == "pending")

    return {
        "total_products": products.count,
        "total_orders": len(orders.data),
        "total_users": users.count,
        "total_revenue": total_revenue,
        "pending_orders": pending_orders,
    }


# ── Products CRUD ─────────────────────────────────────────────────────────────

@router.get("/products")
async def admin_list_products(authorization: str = Header(...)):
    require_admin(authorization)
    res = supabase.table("products").select(
        "*, variants(*), images(*), collections(name, slug)"
    ).order("created_at", desc=True).execute()
    return res.data


class ProductAdminCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    collection_id: Optional[str] = None
    skin_types: Optional[list[str]] = None
    concerns: Optional[list[str]] = None
    estimated_duration_days: Optional[int] = None
    is_limited: bool = False
    price: float
    compare_at_price: Optional[float] = None
    stock: int = 0
    image_url: Optional[str] = None


@router.post("/products")
async def admin_create_product(data: ProductAdminCreate, authorization: str = Header(...)):
    require_admin(authorization)

    prod = supabase.table("products").insert({
        "name": data.name, "slug": data.slug, "description": data.description,
        "collection_id": data.collection_id, "skin_types": data.skin_types,
        "concerns": data.concerns, "estimated_duration_days": data.estimated_duration_days,
        "is_limited": data.is_limited, "is_active": True,
    }).execute()
    product_id = prod.data[0]["id"]

    supabase.table("variants").insert({
        "product_id": product_id, "name": "Padrão",
        "sku": f"AUTO-{product_id[:8].upper()}",
        "price": data.price, "compare_at_price": data.compare_at_price,
        "stock": data.stock,
    }).execute()

    if data.image_url:
        supabase.table("images").insert({
            "product_id": product_id, "url": data.image_url, "position": 0,
        }).execute()

    return prod.data[0]


class ProductAdminUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    collection_id: Optional[str] = None
    skin_types: Optional[list[str]] = None
    concerns: Optional[list[str]] = None
    is_limited: Optional[bool] = None
    is_active: Optional[bool] = None


@router.patch("/products/{product_id}")
async def admin_update_product(product_id: str, data: ProductAdminUpdate, authorization: str = Header(...)):
    require_admin(authorization)
    updates = data.model_dump(exclude_none=True)
    res = supabase.table("products").update(updates).eq("id", product_id).execute()
    return res.data[0]


@router.delete("/products/{product_id}")
async def admin_delete_product(product_id: str, authorization: str = Header(...)):
    require_admin(authorization)
    supabase.table("products").update({"is_active": False}).eq("id", product_id).execute()
    return {"ok": True}


# ── Orders ────────────────────────────────────────────────────────────────────

@router.get("/orders")
async def admin_list_orders(authorization: str = Header(...)):
    require_admin(authorization)
    res = supabase.table("orders").select(
        "*, profiles(email, full_name), order_items(quantity, unit_price, variants(name, products(name)))"
    ).order("created_at", desc=True).limit(200).execute()
    return res.data


class OrderStatusUpdate(BaseModel):
    status: str
    tracking_code: Optional[str] = None


@router.patch("/orders/{order_id}")
async def admin_update_order(order_id: str, data: OrderStatusUpdate, authorization: str = Header(...)):
    require_admin(authorization)
    updates: dict = {"status": data.status}
    if data.tracking_code:
        updates["tracking_code"] = data.tracking_code
    res = supabase.table("orders").update(updates).eq("id", order_id).execute()

    if data.status == "shipped" and data.tracking_code:
        try:
            order = res.data[0]
            profile = supabase.table("profiles").select("email").eq("id", order["user_id"]).single().execute()
            from app.services.email import send_order_shipped
            send_order_shipped(profile.data["email"], order_id, data.tracking_code)
        except Exception as e:
            print(f"[admin] email falhou: {e}")

    return res.data[0]


# ── Users ─────────────────────────────────────────────────────────────────────

@router.get("/users")
async def admin_list_users(authorization: str = Header(...)):
    require_admin(authorization)
    res = supabase.table("profiles").select(
        "id, email, full_name, points_balance, created_at"
    ).order("created_at", desc=True).limit(200).execute()
    return res.data
