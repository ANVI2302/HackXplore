from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import structlog

from app.core import db
from app.api import deps
from app.crud import user as user_crud
from app.models.models import User
from app.schemas.user import UserProfile, UserUpdate, Skill

router = APIRouter()
logger = structlog.get_logger()

def map_user_to_schema(user: User) -> UserProfile:
    skills_mapped = []
    if user.skills:
        for s in user.skills:
             skills_mapped.append(
                 Skill(id=str(s.id), name=s.skill_name, level=s.proficiency, category="General")
             )
    
    return UserProfile(
        id=user.id,
        email=user.email,
        full_name=user.full_name or "",
        title=user.title,
        skills=skills_mapped
    )

@router.get("/me", response_model=UserProfile)
async def read_users_me(
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Get current user profile.
    """
    # Ensure skills are loaded
    await db.refresh(current_user, attribute_names=["skills"])
    return map_user_to_schema(current_user)

@router.patch("/me", response_model=UserProfile)
async def update_user_me(
    *,
    db: AsyncSession = Depends(db.get_db),
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Update current user profile.
    """
    updated_user = await user_crud.update_user(db, current_user, user_in)
    return map_user_to_schema(updated_user)

@router.get("/{user_id}", response_model=UserProfile)
async def get_user_profile(
    user_id: str,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user) # Require auth
):
    # This might fail if looking up other users?
    # For now, simplistic.
    if user_id == "me" or user_id == current_user.id:
        await db.refresh(current_user, attribute_names=["skills"])
        return map_user_to_schema(current_user)
    
    # Preventing access to others for now
    raise HTTPException(status_code=403, detail="Access denied")
