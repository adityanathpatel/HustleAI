import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from app.database import Base


class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=True)
    
    # Defaults
    default_currency = Column(String(10), default="USD")
    default_language = Column(String(20), default="en")
    business_name = Column(String(255), nullable=True)
    theme_preference = Column(String(20), default="system")  # "light", "dark", "system"
    
    # AI Engine & Privacy Mode Settings
    active_ai_mode = Column(String(20), default="local")  # "local" or "remote"
    local_endpoint = Column(String(255), default="http://localhost:11434")
    local_model = Column(String(100), default="llama3.2:3b")
    
    remote_endpoint = Column(String(255), default="https://api.openai.com/v1")
    remote_model = Column(String(100), default="gpt-4o-mini")
    has_remote_key = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
