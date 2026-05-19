from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class OrderItem(BaseModel):
    variant_id: UUID
    quantity: int
    unit_price: float
    product_name: Optional[str] = None


class AddressInput(BaseModel):
    street: str
    number: str
    complement: Optional[str] = None
    neighborhood: str
    city: str
    state: str
    zip_code: str


class OrderCreate(BaseModel):
    items: List[OrderItem]
    shipping_address: AddressInput
    shipping_method: str
    gift_mode: bool = False
    gift_message: Optional[str] = None
    coupon_code: Optional[str] = None


class OrderResponse(BaseModel):
    id: UUID
    user_id: UUID
    status: str
    total: float
    shipping_total: float
    gift_mode: bool
    created_at: datetime
