from fastapi import APIRouter, HTTPException, Header
from app.models.user import UserUpdate
from app.database import supabase

router = APIRouter()


def get_user_id(authorization: str) -> str:
    token = authorization.replace("Bearer ", "")
    res = supabase.auth.get_user(token)
    if not res.user:
        raise HTTPException(status_code=401, detail="Não autorizado")
    return str(res.user.id)


@router.get("/me")
async def get_profile(authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    res = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
    return res.data


@router.patch("/me")
async def update_profile(data: UserUpdate, authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    updates = data.model_dump(exclude_none=True)
    res = supabase.table("profiles").update(updates).eq("id", user_id).execute()
    return res.data
