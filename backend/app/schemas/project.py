from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProjectCreate(BaseModel):
    title: str
    tool_type: str  # "listing", "marketing", "email", "invoice", "receipt"
    content: str
    metadata_json: Optional[str] = None
    tags: Optional[str] = None
    is_favorite: Optional[bool] = False


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[str] = None
    is_favorite: Optional[bool] = None


class ProjectResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    title: str
    tool_type: str
    content: str
    metadata_json: Optional[str] = None
    tags: Optional[str] = None
    is_favorite: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class HistoryItemResponse(BaseModel):
    id: int
    tool_name: str
    prompt_summary: str
    generated_content: str
    model_name: str
    inference_mode: str
    is_local: bool
    latency_ms: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
