from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class ProjectBase(BaseModel):
    title: str
    description: str
    skills_used: List[str]
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    image_url: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    skills_used: Optional[List[str]] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    image_url: Optional[str] = None
    end_date: Optional[datetime] = None


class ProjectResponse(ProjectBase):
    id: str
    user_id: str
    endorsement_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectList(BaseModel):
    projects: List[ProjectResponse]
    total_count: int
