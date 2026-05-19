from fastapi import APIRouter, HTTPException
from app.models.user import UserRegister, UserLogin
from app.database import supabase, supabase_admin

router = APIRouter()


@router.post("/register")
async def register(data: UserRegister):
    try:
        res = supabase_admin.auth.admin.create_user({
            "email": data.email,
            "password": data.password,
            "email_confirm": True,
        })
        if res.user:
            supabase.table("profiles").insert({
                "id": str(res.user.id),
                "email": data.email,
                "full_name": data.full_name,
                "points_balance": 0,
            }).execute()
        return {"message": "Conta criada com sucesso."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(data: UserLogin):
    try:
        res = supabase.auth.sign_in_with_password({"email": data.email, "password": data.password})
        return {
            "access_token": res.session.access_token,
            "refresh_token": res.session.refresh_token,
            "user": {"id": str(res.user.id), "email": res.user.email},
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")


@router.post("/logout")
async def logout():
    supabase.auth.sign_out()
    return {"message": "Logout realizado"}
