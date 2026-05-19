from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from app.models.product import ProductCreate, ProductUpdate
from app.database import supabase

router = APIRouter()


@router.get("/")
async def list_products(
    collection_id: Optional[str] = None,
    skin_type: Optional[str] = None,
    concern: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    limit: int = Query(20, le=100),
    offset: int = 0,
):
    query = supabase.table("products").select(
        "*, variants(*), images(*), collections(name, slug)"
    )
    if collection_id:
        query = query.eq("collection_id", collection_id)
    if skin_type:
        query = query.contains("skin_types", [skin_type])
    if concern:
        query = query.contains("concerns", [concern])
    query = query.range(offset, offset + limit - 1)
    res = query.execute()
    return res.data


@router.get("/{slug}")
async def get_product(slug: str):
    res = supabase.table("products").select(
        "*, variants(*), images(*), ingredients(*), collections(name, slug)"
    ).eq("slug", slug).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return res.data


@router.post("/")
async def create_product(data: ProductCreate):
    res = supabase.table("products").insert(data.model_dump()).execute()
    return res.data[0]


@router.patch("/{product_id}")
async def update_product(product_id: str, data: ProductUpdate):
    updates = data.model_dump(exclude_none=True)
    res = supabase.table("products").update(updates).eq("id", product_id).execute()
    return res.data[0]


@router.get("/{product_id}/routine")
async def get_routine(product_id: str):
    res = supabase.table("routines").select(
        "*, routine_products(*, products(*, variants(*), images(*)))"
    ).eq("product_id", product_id).execute()
    return res.data
