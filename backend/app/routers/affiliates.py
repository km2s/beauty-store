from fastapi import APIRouter, HTTPException, Header
from app.database import supabase
from app.routers.users import get_user_id

router = APIRouter()

COMMISSION_RATE = 0.08  # 8%


@router.post("/apply")
async def apply(authorization: str = Header(...)):
    user_id = get_user_id(authorization)

    existing = supabase.table("affiliates").select("id").eq("user_id", user_id).execute()
    if existing.data:
        return existing.data[0]

    res = supabase.table("affiliates").insert({
        "user_id": user_id,
        "status": "pending",
        "commission_rate": COMMISSION_RATE,
    }).execute()
    return res.data[0]


@router.get("/me")
async def get_affiliate(authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    res = supabase.table("affiliates").select("*").eq("user_id", user_id).execute()
    if not res.data:
        return None
    affiliate = res.data[0]

    conversions = supabase.table("affiliate_conversions").select(
        "*, orders(total, created_at, status)"
    ).eq("affiliate_id", affiliate["id"]).order("created_at", desc=True).execute()

    total_earned = sum(c["commission"] for c in conversions.data)
    pending = sum(c["commission"] for c in conversions.data if not c["paid"])

    return {
        **affiliate,
        "conversions": conversions.data,
        "total_earned": total_earned,
        "pending_payout": pending,
        "conversion_count": len(conversions.data),
    }


@router.get("/track/{code}")
async def track_click(code: str):
    res = supabase.table("affiliates").select("id").eq("code", code).eq("status", "approved").execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Código não encontrado")
    return {"affiliate_id": res.data[0]["id"], "code": code}
