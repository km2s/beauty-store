from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    birth_date: Optional[str] = None
    skin_type: Optional[str] = None
    skin_concerns: Optional[list] = None


class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    phone: Optional[str]
    skin_type: Optional[str]
    points_balance: int = 0
    created_at: datetime
