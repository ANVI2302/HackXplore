from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Question(BaseModel):
    id: str
    text: str
    options: List[str]
    # In a real app, 'correct_answer' would NOT be sent to client usually, 
    # but maybe needed for simple client-side checks? No, keeps it secure.
    
class AssessmentConfig(BaseModel):
    """Configuration for a specific skill assessment."""
    id: str
    title: str
    description: str
    category: str # e.g. "Healthcare", "Tech", "Urban Planning"
    estimated_time_minutes: int
    question_count: int

class AssessmentCreate(BaseModel):
    assessment_config_id: str

class AssessmentResponse(BaseModel):
    id: str
    title: str
    status: str
    created_at: datetime
    questions: Optional[List[Question]] = None # Only present if status is 'started'

class AnswerSubmission(BaseModel):
    question_id: str
    selected_option_index: int

class AssessmentResult(BaseModel):
    assessment_id: str
    score: float
    passed: bool
    gap_analysis: str # [MAGIC] Text/HTML explanation of what is missing
    recommended_actions: List[str]
