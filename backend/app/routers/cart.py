from fastapi import APIRouter, HTTPException, Header
from app.models.cart import CartItemAdd, CartItemUpdate
from app.database import supabase
from app.routers.users import get_user_id

router = APIRouter()


@router.get("/")
async def get_cart(authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    res = supabase.table("cart_items").select(
        "*, variants(price, name, products(name, images(*)))"
    ).eq("user_id", user_id).execute()
    return res.data


@router.post("/")
async def add_to_cart(data: CartItemAdd, authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    existing = supabase.table("cart_items").select("*").eq(
        "user_id", user_id
    ).eq("variant_id", str(data.variant_id)).execute()

    if existing.data:
        new_qty = existing.data[0]["quantity"] + data.quantity
        res = supabase.table("cart_items").update(
            {"quantity": new_qty}
        ).eq("id", existing.data[0]["id"]).execute()
    else:
        res = supabase.table("cart_items").insert({
            "user_id": user_id,
            "variant_id": str(data.variant_id),
            "quantity": data.quantity,
        }).execute()
    return res.data


@router.patch("/{item_id}")
async def update_cart_item(item_id: str, data: CartItemUpdate, authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    if data.quantity <= 0:
        supabase.table("cart_items").delete().eq("id", item_id).eq("user_id", user_id).execute()
        return {"message": "Item removido"}
    res = supabase.table("cart_items").update(
        {"quantity": data.quantity}
    ).eq("id", item_id).eq("user_id", user_id).execute()
    return res.data


@router.delete("/{item_id}")
async def remove_from_cart(item_id: str, authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    supabase.table("cart_items").delete().eq("id", item_id).eq("user_id", user_id).execute()
    return {"message": "Item removido"}
