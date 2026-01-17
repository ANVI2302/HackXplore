import secrets
import structlog
import asyncio
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings
from concurrent.futures import ThreadPoolExecutor

pwd_context = CryptContext(
    schemes=["bcrypt"], 
    deprecated="auto",
    bcrypt__rounds=4  # Dev mode: faster hashing. Use 12+ in production
)
logger = structlog.get_logger()

# Thread pool for CPU-intensive password operations
_executor = ThreadPoolExecutor(max_workers=4)

async def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Async password verification to avoid blocking event loop"""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(_executor, pwd_context.verify, plain_password, hashed_password)

async def get_password_hash(password: str) -> str:
    """Async password hashing to avoid blocking event loop"""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(_executor, pwd_context.hash, password)

def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    Internal logic: Defaults to global setting if no expiry provided.
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    
    # [SECURITY] Use HS256 algorithm with strong key
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    
    # [OBSERVABILITY] Optional audit log for token creation (careful with volume)
    # logger.debug("token_created", user_id=subject)
    
    return encoded_jwt
