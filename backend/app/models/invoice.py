import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # nullable for demo/guest usage
    invoice_number = Column(String(50), index=True, nullable=False)
    issue_date = Column(String(50), nullable=False)
    due_date = Column(String(50), nullable=False)
    
    # Seller Details
    seller_name = Column(String(255), nullable=False)
    seller_email = Column(String(255), nullable=True)
    seller_phone = Column(String(50), nullable=True)
    seller_address = Column(Text, nullable=True)
    seller_tax_id = Column(String(100), nullable=True)  # GST / VAT / Tax ID
    
    # Customer Details
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=True)
    customer_phone = Column(String(50), nullable=True)
    customer_address = Column(Text, nullable=True)
    
    # Financials (Computed strictly on backend)
    currency = Column(String(10), default="USD")
    subtotal = Column(Float, default=0.0)
    tax_rate_percent = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)
    
    payment_instructions = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String(50), default="draft")  # "draft", "sent", "paid"
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan")


class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    description = Column(String(255), nullable=False)
    quantity = Column(Float, default=1.0)
    unit_price = Column(Float, default=0.0)
    line_total = Column(Float, default=0.0)

    invoice = relationship("Invoice", back_populates="items")
