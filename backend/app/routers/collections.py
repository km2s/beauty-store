from fastapi import APIRouter, HTTPException
from app.database import supabase

router = APIRouter()


@router.get("/")
async def list_collections():
    res = supabase.table("collections").select("*").order("position").execute()
    return res.data


@router.get("/{slug}")
async def get_collection(slug: str):
    res = supabase.table("collections").select("*").eq("slug", slug).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Coleção não encontrada")
    return res.data
