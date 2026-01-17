"""
Async logic script to initialize the database tables.
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.models.models import Base
from app.core.config import settings

async def init_db():
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        # [DESTRUCTIVE] For dev: Drop all and recreate to ensure clean state
        # In prod, use Alembic migrations instead
        # await conn.run_sync(Base.metadata.drop_all) 
        await conn.run_sync(Base.metadata.create_all)
    
    print("Database Initialized Successfully.")

if __name__ == "__main__":
    asyncio.run(init_db())
