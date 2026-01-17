from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

# [PERFORMANCE] SQLAlchemy Async Engine
# echo=True only in local/dev for debugging queries
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=(settings.ENVIRONMENT == "local"),
    future=True
)

# [CONCURRENCY] Session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False # [PERFORMANCE] Manual flushing gives better control
)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency to get DB session.
    Ensures session is closed even if exceptions occur.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            # [SAFETY] Explicit commit? No, handled by caller or context manager.
            # We yield the session for the transaction scope.
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
