from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class CartItemAdd(BaseModel):
    variant_id: UUID
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemResponse(BaseModel):
    id: UUID
    variant_id: UUID
    quantity: int
    unit_price: float
    product_name: str
    variant_name: str
    image_url: Optional[str]
