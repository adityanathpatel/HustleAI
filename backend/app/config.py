import os
import logging
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List

logger = logging.getLogger("hustleai.config")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        extra="ignore"
    )

    APP_NAME: str = "HustleAI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///./hustleai.db"
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "hustleai_dev_secret_change_in_production_key_2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # AI Engine Defaults
    # Modes: "local" (default, runs via local Ollama/Open-weight endpoint) or "remote" (explicit opt-in)
    DEFAULT_AI_MODE: str = "local"
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    DEFAULT_LOCAL_MODEL: str = os.getenv("DEFAULT_LOCAL_MODEL", "llama3.2:3b")
    
    # Remote OpenAI-compatible endpoint (strictly opt-in; never silently invoked in local mode)
    REMOTE_BASE_URL: str = os.getenv("REMOTE_BASE_URL", "https://api.openai.com/v1")
    REMOTE_API_KEY: Optional[str] = os.getenv("REMOTE_API_KEY", None)
    DEFAULT_REMOTE_MODEL: str = os.getenv("DEFAULT_REMOTE_MODEL", "gpt-4o-mini")
    
    # Uploads
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".pdf", ".webp"]


settings = Settings()
