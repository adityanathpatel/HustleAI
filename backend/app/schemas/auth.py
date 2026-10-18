from pydantic import BaseModel, ConfigDict
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
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: Optional[str] = None
    business_name: Optional[str] = None
    plan: str
    created_at: datetime
