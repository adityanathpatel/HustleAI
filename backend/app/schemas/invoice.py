from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime


class InvoiceItemSchema(BaseModel):
    id: Optional[int] = None
    description: str = Field(..., min_length=1)
    quantity: float = Field(..., gt=0)
    unit_price: float = Field(..., ge=0)
    line_total: Optional[float] = 0.0


class InvoiceBase(BaseModel):
    invoice_number: str
    issue_date: str
    due_date: str
    
    # Seller
    seller_name: str
    seller_email: Optional[str] = None
    seller_phone: Optional[str] = None
    seller_address: Optional[str] = None
    seller_tax_id: Optional[str] = None
    
    # Customer
    customer_name: str
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_address: Optional[str] = None
    
    # Financial params
    currency: Optional[str] = "USD"
    tax_rate_percent: Optional[float] = Field(0.0, ge=0.0, le=100.0)
    discount_amount: Optional[float] = Field(0.0, ge=0.0)
    
    payment_instructions: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = "draft"
    
    items: List[InvoiceItemSchema] = []


class InvoiceCreate(InvoiceBase):
    pass


class InvoiceUpdate(InvoiceBase):
    pass


class InvoiceCalculationRequest(BaseModel):
    items: List[InvoiceItemSchema]
    tax_rate_percent: float = 0.0
    discount_amount: float = 0.0


class InvoiceCalculationResponse(BaseModel):
    items: List[InvoiceItemSchema]
    subtotal: float
    tax_rate_percent: float
    tax_amount: float
    discount_amount: float
    total_amount: float


class InvoiceResponse(InvoiceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: Optional[int] = None
    subtotal: float
    tax_amount: float
    total_amount: float
    created_at: datetime
    updated_at: Optional[datetime] = None

