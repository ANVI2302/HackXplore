from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.models import Course
import uuid


def create_course(db: Session, title: str, description: str, provider: str, url: str, 
                  difficulty_level: str, duration_hours: int, skills_covered: List[str], 
                  rating: float = 0.0) -> Course:
    course = Course(
        id=str(uuid.uuid4()),
        title=title,
        description=description,
        provider=provider,
        url=url,
        difficulty_level=difficulty_level,
        duration_hours=duration_hours,
        skills_covered=skills_covered,
        rating=rating
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


def get_course(db: Session, course_id: str) -> Optional[Course]:
    return db.query(Course).filter(Course.id == course_id).first()


def get_courses_by_skill(db: Session, skill_name: str) -> List[Course]:
    return db.query(Course).filter(Course.skills_covered.contains([skill_name])).all()


def get_all_courses(db: Session, skip: int = 0, limit: int = 10) -> List[Course]:
    return db.query(Course).offset(skip).limit(limit).all()


def get_courses_by_difficulty(db: Session, difficulty_level: str) -> List[Course]:
    return db.query(Course).filter(Course.difficulty_level == difficulty_level).all()


def update_course_rating(db: Session, course_id: str, new_rating: float) -> Optional[Course]:
    course = db.query(Course).filter(Course.id == course_id).first()
    if course:
        course.rating = new_rating
        db.commit()
        db.refresh(course)
    return course
