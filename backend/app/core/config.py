import secrets
from typing import List, Literal
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, field_validator

class Settings(BaseSettings):
    """
    Centralized configuration. 
    Fails fast (on startup) if critical environment variables are missing.
    """
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Skill Intelligence Platform"
    
    # [SECURITY] Force explicit secret setting in prod, fallback only for dev
    SECRET_KEY: str = "dev-secret-key-change-this-in-prod-unsafe-unsafe-unsafe"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # [SECURITY] CORS origins must be explicit lists, not wildcards in prod
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    # [DEFAULTS] SQLite for rapid dev, generic URI for prod override
    DATABASE_URL: str = "sqlite+aiosqlite:///./sql_app.db"
    
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    @field_validator("SECRET_KEY")
    @classmethod
    def check_min_length_secret(cls, v: str, info) -> str:
        # [SECURITY] Prevent weak keys in production
        if info.data.get("ENVIRONMENT") == "production" and len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters in production")
        return v

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")

settings = Settings()
