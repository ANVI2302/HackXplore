from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class QuizQuestion(BaseModel):
    """A single question in a quiz."""
    id: str
    text: str
    options: List[str]
    difficulty_level: str  # Beginner, Intermediate, Advanced
    skill_tested: str  # Which skill this question assesses
    topic: str  # Subtopic within the skill


class QuizConfig(BaseModel):
    """Configuration for generating a quiz."""
    skill_name: str
    difficulty_level: str  # Beginner, Intermediate, Advanced
    question_count: int = Field(default=10, ge=5, le=50)
    duration_minutes: int = Field(default=30, ge=15, le=120)


class QuizCreate(BaseModel):
    """Request to create/start a quiz."""
    config_id: str
    skill_name: str
    difficulty_level: str
    question_count: int = 10


class QuizResponse(BaseModel):
    """Quiz session response."""
    id: str
    skill_name: str
    difficulty_level: str
    title: str
    status: str  # not_started, in_progress, completed
    question_count: int
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    questions: Optional[List[QuizQuestion]] = None


class QuizAnswerSubmission(BaseModel):
    """Submit answers for a quiz."""
    question_id: str
    selected_option_index: int


class QuizScore(BaseModel):
    """Score details for a quiz."""
    quiz_id: str
    score: float  # Percentage 0-100
    total_questions: int
    correct_answers: int
    skill_name: str
    difficulty_level: str
    passed: bool
    time_taken_seconds: int
    

class QuizResult(BaseModel):
    """Complete quiz result with analysis."""
    quiz_id: str
    skill_name: str
    difficulty_level: str
    score: float  # 0-100
    passed: bool
    total_questions: int
    correct_answers: int
    incorrect_answers: int
    time_taken_seconds: int
    performance_summary: str  # e.g., "Excellent", "Good", "Needs Improvement"
    strength_areas: List[str]  # Topics/areas where user performed well
    weak_areas: List[str]  # Topics/areas that need improvement
    recommended_topics: List[str]  # Specific topics to review
    next_steps: List[str]  # Recommended actions


class SkillGap(BaseModel):
    """Identifies a skill gap for a user."""
    skill_name: str
    current_level: int  # 0-10
    required_level: int  # 0-10
    gap_level: int  # How much improvement needed
    proficiency: Optional[str] = None  # Beginner, Intermediate, Advanced


class SkillGapAnalysis(BaseModel):
    """Analysis of user's skill gaps."""
    user_id: str
    total_skills_assessed: int
    skill_gaps: List[SkillGap]
    top_priority_skills: List[str]  # Top 3 skills to focus on


class QuizStats(BaseModel):
    """User's quiz statistics."""
    total_quizzes_taken: int
    average_score: float
    completion_rate: float  # Percentage of started quizzes completed
    skills_practiced: List[str]
    highest_score: Optional[float] = None
    lowest_score: Optional[float] = None
    most_recent_quiz: Optional[datetime] = None
