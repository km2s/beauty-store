from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class ProductVariant(BaseModel):
    id: Optional[UUID] = None
    product_id: Optional[UUID] = None
    name: str
    sku: str
    price: float
    compare_at_price: Optional[float] = None
    stock: int = 0
    attributes: Optional[dict] = None


class ProductImage(BaseModel):
    id: Optional[UUID] = None
    product_id: Optional[UUID] = None
    url: str
    alt: Optional[str] = None
    position: int = 0


class ProductCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    collection_id: Optional[UUID] = None
    skin_types: Optional[List[str]] = None
    concerns: Optional[List[str]] = None
    estimated_duration_days: Optional[int] = None
    is_limited: bool = False


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    skin_types: Optional[List[str]] = None
    concerns: Optional[List[str]] = None
    estimated_duration_days: Optional[int] = None
    is_limited: Optional[bool] = None


class ProductResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str]
    collection_id: Optional[UUID]
    skin_types: Optional[List[str]]
    concerns: Optional[List[str]]
    estimated_duration_days: Optional[int]
    is_limited: bool
    created_at: datetime
