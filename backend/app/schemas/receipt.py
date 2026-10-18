from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class ReceiptUpdate(BaseModel):
    merchant: Optional[str] = None
    transaction_date: Optional[str] = None
    total_amount: Optional[float] = None
    tax_amount: Optional[float] = None
    currency: Optional[str] = "USD"
    category: Optional[str] = None
    is_verified: Optional[bool] = True
    notes: Optional[str] = None


class ReceiptResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    original_filename: str
    file_size_bytes: int
    merchant: Optional[str] = None
    transaction_date: Optional[str] = None
    total_amount: Optional[float] = None
    tax_amount: Optional[float] = None
    currency: str
    category: str
    confidence_score: float
    is_uncertain: bool
    is_verified: bool
    uncertain_fields: List[str] = []
    raw_extracted_text: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
