from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.models import Achievement
import uuid


def create_achievement(db: Session, user_id: str, title: str, description: str, badge_name: str, icon_url: Optional[str] = None) -> Achievement:
    achievement = Achievement(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=title,
        description=description,
        badge_name=badge_name,
        icon_url=icon_url
    )
    db.add(achievement)
    db.commit()
    db.refresh(achievement)
    return achievement


def get_user_achievements(db: Session, user_id: str) -> List[Achievement]:
    return db.query(Achievement).filter(Achievement.user_id == user_id).all()


def get_achievement(db: Session, achievement_id: str) -> Optional[Achievement]:
    return db.query(Achievement).filter(Achievement.id == achievement_id).first()


def delete_achievement(db: Session, achievement_id: str) -> bool:
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if achievement:
        db.delete(achievement)
        db.commit()
        return True
    return False
