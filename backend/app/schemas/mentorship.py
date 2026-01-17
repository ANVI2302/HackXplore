from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class MentorshipBase(BaseModel):
    mentor_id: str
    mentee_id: str
    skill_focus: str


class MentorshipCreate(BaseModel):
    mentor_id: str
    skill_focus: str


class MentorshipUpdate(BaseModel):
    status: Optional[str] = None  # pending, active, completed


class MentorResponse(BaseModel):
    id: str
    full_name: str
    title: Optional[str] = None
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True


class MentorshipResponse(BaseModel):
    id: str
    mentor: MentorResponse
    skill_focus: str
    status: str
    started_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class MentorshipList(BaseModel):
    mentorships: list[MentorshipResponse]
    total_count: int


class MentorAvailableResponse(BaseModel):
    id: str
    full_name: str
    title: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    expertise_skills: list[str]
    current_mentees_count: int

    class Config:
        from_attributes = True
