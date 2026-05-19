from fastapi import APIRouter, Header
from app.database import supabase
from app.routers.users import get_user_id

router = APIRouter()

POINTS_PER_REAL = 1
POINTS_PER_REVIEW = 50
POINTS_PER_REFERRAL = 100


@router.get("/balance")
async def get_balance(authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    res = supabase.table("profiles").select("points_balance").eq("id", user_id).single().execute()
    return {"balance": res.data["points_balance"]}


@router.get("/history")
async def get_history(authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    res = supabase.table("points_transactions").select("*").eq(
        "user_id", user_id
    ).order("created_at", desc=True).limit(50).execute()
    return res.data
