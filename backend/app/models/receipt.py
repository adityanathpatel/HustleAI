import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from app.database import Base


class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, default=0)
    
    # Extracted fields
    merchant = Column(String(255), nullable=True)
    transaction_date = Column(String(50), nullable=True)
    total_amount = Column(Float, nullable=True)
    tax_amount = Column(Float, nullable=True)
    currency = Column(String(10), default="USD")
    category = Column(String(100), default="General Expense")
    
    confidence_score = Column(Float, default=0.0)  # 0.0 to 1.0 (or percentage)
    is_uncertain = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    
    raw_extracted_text = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
