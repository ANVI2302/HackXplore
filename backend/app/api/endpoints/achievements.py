from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import structlog

from app.core import db
from app.api import deps
from app.crud import achievement as achievement_crud
from app.models.models import User
from app.schemas.achievement import AchievementResponse, AchievementCreate, AchievementList

router = APIRouter()
logger = structlog.get_logger()


@router.get("/me", response_model=AchievementList)
async def get_my_achievements(
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get all achievements for current user."""
    achievements = achievement_crud.get_user_achievements(db, current_user.id)
    return AchievementList(
        achievements=[AchievementResponse.from_orm(a) for a in achievements],
        total_count=len(achievements)
    )


@router.post("", response_model=AchievementResponse, status_code=201)
async def create_achievement(
    achievement_in: AchievementCreate,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Create a new achievement (admin only in production)."""
    achievement = achievement_crud.create_achievement(
        db,
        user_id=current_user.id,
        title=achievement_in.title,
        description=achievement_in.description,
        badge_name=achievement_in.badge_name,
        icon_url=achievement_in.icon_url
    )
    logger.info("achievement.created", user_id=current_user.id, achievement_id=achievement.id)
    return AchievementResponse.from_orm(achievement)


@router.get("/{achievement_id}", response_model=AchievementResponse)
async def get_achievement(
    achievement_id: str,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get specific achievement."""
    achievement = achievement_crud.get_achievement(db, achievement_id)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    if achievement.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return AchievementResponse.from_orm(achievement)


@router.delete("/{achievement_id}", status_code=204)
async def delete_achievement(
    achievement_id: str,
    db: Session = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Delete an achievement."""
    achievement = achievement_crud.get_achievement(db, achievement_id)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    if achievement.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    achievement_crud.delete_achievement(db, achievement_id)
    logger.info("achievement.deleted", achievement_id=achievement_id)
