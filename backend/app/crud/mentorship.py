from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.models import Mentorship, User
import uuid
from datetime import datetime


def create_mentorship(db: Session, mentor_id: str, mentee_id: str, skill_focus: str) -> Mentorship:
    mentorship = Mentorship(
        id=str(uuid.uuid4()),
        mentor_id=mentor_id,
        mentee_id=mentee_id,
        skill_focus=skill_focus,
        status="pending"
    )
    db.add(mentorship)
    db.commit()
    db.refresh(mentorship)
    return mentorship


def get_mentorship(db: Session, mentorship_id: str) -> Optional[Mentorship]:
    return db.query(Mentorship).filter(Mentorship.id == mentorship_id).first()


def get_mentorships_for_user(db: Session, user_id: str, as_mentee: bool = True) -> List[Mentorship]:
    if as_mentee:
        return db.query(Mentorship).filter(Mentorship.mentee_id == user_id).all()
    else:
        return db.query(Mentorship).filter(Mentorship.mentor_id == user_id).all()


def get_available_mentors(db: Session, skill_focus: str) -> List[User]:
    # Returns users with the skill_focus who have capacity for new mentees
    return db.query(User).join(User.skills).filter(
        User.skills.any()  # Has skills
    ).all()


def update_mentorship_status(db: Session, mentorship_id: str, status: str) -> Optional[Mentorship]:
    mentorship = db.query(Mentorship).filter(Mentorship.id == mentorship_id).first()
    if mentorship:
        mentorship.status = status
        if status == "active" and mentorship.started_at is None:
            mentorship.started_at = datetime.utcnow()
        elif status == "completed":
            mentorship.ended_at = datetime.utcnow()
        db.commit()
        db.refresh(mentorship)
    return mentorship


def delete_mentorship(db: Session, mentorship_id: str) -> bool:
    mentorship = db.query(Mentorship).filter(Mentorship.id == mentorship_id).first()
    if mentorship:
        db.delete(mentorship)
        db.commit()
        return True
    return False
