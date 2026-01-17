from typing import AsyncGenerator
from fastapi import Request, Depends, HTTPException, status
from app.core.context import RequestContext, create_context

async def get_request_context(request: Request) -> RequestContext:
    """
    Dependency to inject RequestContext into route handlers.
    Extracts headers for distributed tracing integration.
    """
    # [CID] Propagate incoming correlation ID or generate new one
    cid = request.headers.get("X-Request-ID")
    
    # [AUTH] simplified for now - in prod extract sub from JWT here
    # user_id = request.state.user.id if hasattr(request.state, "user") else None
    user_id = "test-user" # Placeholder until Auth middleware is matched

    # [TIMEOUT] Default 500ms budget, can be overridden by specific high-latency routes if configured
    ctx = create_context(timeout_ms=500, user_id=user_id, cid=cid)
    
    return ctx

from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from app.core import config, security, db
from app.models.models import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{config.settings.API_V1_STR}/auth/login/access-token"
)

async def get_current_user(
    db: AsyncSession = Depends(db.get_db),
    token: str = Depends(reusable_oauth2)
) -> User:
    try:
        payload = jwt.decode(
            token, config.settings.SECRET_KEY, algorithms=["HS256"]
        )
        token_data = payload.get("sub")
        if token_data is None:
             raise HTTPException(status_code=403, detail="Could not validate credentials")
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    
    result = await db.execute(select(User).where(User.id == token_data))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
