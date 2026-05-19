from fastapi import APIRouter, Header
from app.models.order import OrderCreate
from app.database import supabase
from app.routers.users import get_user_id

router = APIRouter()


@router.get("/")
async def list_orders(authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    res = supabase.table("orders").select(
        "*, order_items(*, variants(name, products(name, images(*))))"
    ).eq("user_id", user_id).order("created_at", desc=True).execute()
    return res.data


@router.get("/{order_id}")
async def get_order(order_id: str, authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    res = supabase.table("orders").select(
        "*, order_items(*, variants(name, price, products(name, images(*))))"
    ).eq("id", order_id).eq("user_id", user_id).single().execute()
    return res.data
