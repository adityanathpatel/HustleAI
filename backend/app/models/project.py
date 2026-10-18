import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from app.database import Base


class SavedProject(Base):
    __tablename__ = "saved_projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    tool_type = Column(String(50), nullable=False)  # "listing", "marketing", "email", "invoice", "receipt"
    content = Column(Text, nullable=False)  # JSON string or text output
    metadata_json = Column(Text, nullable=True)  # Additional contextual parameters (platform, language, tone, etc.)
    tags = Column(String(255), nullable=True)
    is_favorite = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
