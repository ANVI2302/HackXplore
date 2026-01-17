from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class CourseBase(BaseModel):
    title: str
    description: str
    provider: str  # Coursera, Udemy, Internal, etc.
    url: str
    difficulty_level: str
    duration_hours: int
    skills_covered: List[str]
    rating: Optional[float] = None


class CourseCreate(CourseBase):
    pass


class CourseResponse(CourseBase):
    id: str
    rating: float
    created_at: datetime

    class Config:
        from_attributes = True


class CourseList(BaseModel):
    courses: List[CourseResponse]
    total_count: int


class RecommendedCourseResponse(BaseModel):
    course: CourseResponse
    relevance_score: float  # 0-100, how relevant to user's skill gaps
    match_reason: str  # Why this course is recommended
