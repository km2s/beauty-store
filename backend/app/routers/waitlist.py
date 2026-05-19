from fastapi import APIRouter, Header
from pydantic import BaseModel, EmailStr
from app.database import supabase

router = APIRouter()


class WaitlistJoin(BaseModel):
    email: EmailStr
    product_id: str


@router.post("/join")
async def join_waitlist(data: WaitlistJoin):
    existing = supabase.table("waitlist").select("id").eq(
        "email", data.email
    ).eq("product_id", data.product_id).execute()

    if existing.data:
        return {"message": "Você já está na lista de espera"}

    supabase.table("waitlist").insert({
        "email": data.email,
        "product_id": data.product_id,
        "notified": False,
    }).execute()
    return {"message": "Entrou na lista de espera com sucesso"}


@router.get("/{product_id}/count")
async def waitlist_count(product_id: str):
    res = supabase.table("waitlist").select("id", count="exact").eq(
        "product_id", product_id
    ).eq("notified", False).execute()
    return {"count": res.count}
