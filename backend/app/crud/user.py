from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.models import User
from app.schemas.user import UserCreate
from app.core import security

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    # [PERFORMANCE] Index usage on email is critical (defined in model)
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()

async def create_user(db: AsyncSession, user_in: UserCreate, user_id: str) -> User:
    """
    Create a new user.
    """
    db_user = User(
        id=user_id,
        email=user_in.email,
        full_name=user_in.full_name,
        title=user_in.title,
        # [SECURITY] Never store plain text passwords
        hashed_password=await security.get_password_hash(user_in.password)
    )
    db.add(db_user)
    
    # [TRANSACTION] Commits handled by dependency, but we can flush to get IDs if generated DB side
    # Here IDs are UUIDs provided by caller or logic
    await db.commit()
    await db.refresh(db_user)
    return db_user

from app.models.models import User, UserSkill
from app.schemas.user import UserUpdate

async def update_user(db: AsyncSession, db_user: User, user_in: UserUpdate) -> User:
    update_data = user_in.model_dump(exclude_unset=True)
    
    # Update simple fields
    for field in ['full_name', 'title']:
        if field in update_data:
            setattr(db_user, field, update_data[field])

    # Update Skills
    if 'skills' in update_data and update_data['skills'] is not None:
        # Ensure collection is loaded
        await db.refresh(db_user, attribute_names=["skills"])
        # Clear existing keys explicitly if needed, but managing the list is enough with cascade
        # Simpler approach: Re-create list
        new_skills_list = []
        for skill_name in update_data['skills']:
             new_skills_list.append(UserSkill(skill_name=skill_name, proficiency=5, verified=False))
        db_user.skills = new_skills_list

    db.add(db_user)
    await db.commit()
    await db.refresh(db_user, attribute_names=["skills"])
    return db_user
