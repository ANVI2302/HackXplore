from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.models import Project
import uuid
from datetime import datetime


def create_project(db: Session, user_id: str, title: str, description: str, skills_used: List[str], 
                   github_url: Optional[str] = None, demo_url: Optional[str] = None, 
                   image_url: Optional[str] = None, start_date: Optional[datetime] = None) -> Project:
    project = Project(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=title,
        description=description,
        skills_used=skills_used,
        github_url=github_url,
        demo_url=demo_url,
        image_url=image_url,
        start_date=start_date
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def get_user_projects(db: Session, user_id: str) -> List[Project]:
    return db.query(Project).filter(Project.user_id == user_id).all()


def get_project(db: Session, project_id: str) -> Optional[Project]:
    return db.query(Project).filter(Project.id == project_id).first()


def update_project(db: Session, project_id: str, **kwargs) -> Optional[Project]:
    project = db.query(Project).filter(Project.id == project_id).first()
    if project:
        for key, value in kwargs.items():
            if value is not None and hasattr(project, key):
                setattr(project, key, value)
        db.commit()
        db.refresh(project)
    return project


def delete_project(db: Session, project_id: str) -> bool:
    project = db.query(Project).filter(Project.id == project_id).first()
    if project:
        db.delete(project)
        db.commit()
        return True
    return False


def increment_endorsements(db: Session, project_id: str) -> Optional[Project]:
    project = db.query(Project).filter(Project.id == project_id).first()
    if project:
        project.endorsement_count += 1
        db.commit()
        db.refresh(project)
    return project
