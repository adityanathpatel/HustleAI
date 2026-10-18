import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "HustleAI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///./hustleai.db"
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "hustleai_super_secret_production_key_2026_xyz987")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # AI Engine Defaults
    # Modes: "local" (default, runs via local Ollama/Open-weight endpoint) or "remote" (explicit opt-in)
    DEFAULT_AI_MODE: str = "local"
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    DEFAULT_LOCAL_MODEL: str = os.getenv("DEFAULT_LOCAL_MODEL", "llama3.2:3b")
    
    # Remote OpenAI-compatible fallback (only used if user explicitly toggles Remote Mode)
    REMOTE_BASE_URL: str = os.getenv("REMOTE_BASE_URL", "https://api.openai.com/v1")
    REMOTE_API_KEY: Optional[str] = os.getenv("REMOTE_API_KEY", None)
    DEFAULT_REMOTE_MODEL: str = os.getenv("DEFAULT_REMOTE_MODEL", "gpt-4o-mini")
    
    # Uploads
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: list[str] = [".jpg", ".jpeg", ".png", ".pdf", ".webp"]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
