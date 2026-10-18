import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Boolean
from app.database import Base


class GenerationHistory(Base):
    __tablename__ = "generation_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    tool_name = Column(String(50), nullable=False)  # "listing", "marketing", "email"
    prompt_summary = Column(Text, nullable=False)
    generated_content = Column(Text, nullable=False)
    model_name = Column(String(100), nullable=False)
    inference_mode = Column(String(20), default="local")  # "local", "remote"
    is_local = Column(Boolean, default=True)
    latency_ms = Column(Float, default=0.0)
    status = Column(String(20), default="success")  # "success", "error"
    error_message = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
