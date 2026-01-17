from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class CareerPathBase(BaseModel):
    title: str
    description: str
    target_role: str
    industry: str  # CS, Agriculture, Smart Cities
    required_skills: dict  # {"skill_name": required_level}
    estimated_months: int
    difficulty_level: str  # Beginner, Intermediate, Advanced


class CareerPathResponse(CareerPathBase):
    id: str

    class Config:
        from_attributes = True


class CareerPathList(BaseModel):
    paths: List[CareerPathResponse]
    total_count: int


class CareerProgressResponse(BaseModel):
    path_id: str
    path_title: str
    progress_percentage: float
    current_skills: List[str]
    missing_skills: List[str]
    estimated_completion_months: int
