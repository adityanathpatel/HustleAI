from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserRegister(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    business_name: Optional[str] = None
    plan: Optional[str] = "free"


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserResponse"


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    business_name: Optional[str] = None
    plan: str
    created_at: datetime

    class Config:
        from_attributes = True
