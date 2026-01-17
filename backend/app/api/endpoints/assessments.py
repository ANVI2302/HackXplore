from datetime import datetime
import random
import uuid
import structlog
from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.context import RequestContext
from app.api import deps
from app.core import db
from app.schemas.assessment import (
    AssessmentConfig, AssessmentCreate, AssessmentResponse, 
    Question, AnswerSubmission, AssessmentResult
)
from app.models.models import Assessment, User

router = APIRouter()
logger = structlog.get_logger()

# [MOCK] Content Repository
# In prod, this would be in a DB table "assessment_definitions"
AVAILABLE_ASSESSMENTS = [
    AssessmentConfig(
        id="asm_healthcare_basics",
        title="Healthcare Informatics Basics",
        description="Core concepts of EHR, interoperability (FHIR), and patient data privacy.",
        category="Healthcare",
        estimated_time_minutes=15,
        question_count=5
    ),
    AssessmentConfig(
        id="asm_urban_planning",
        title="Smart City Infrastructure",
        description="IoT sensors, traffic flow algorithms, and sustainable energy grids.",
        category="Urban Planning",
        estimated_time_minutes=20,
        question_count=5
    ),
     AssessmentConfig(
        id="asm_python_ds",
        title="Python for Data Science",
        description="Pandas, NumPy, and basic ML concepts.",
        category="Tech",
        estimated_time_minutes=10,
        question_count=5
    )
]

MOCK_QUESTIONS = {
    "asm_healthcare_basics": [
        Question(id="q1", text="What does FHIR stand for?", options=["Fast Health Interoperability Resources", "Federal Health Insurance Regulation", "Future Health Information Record"]),
        Question(id="q2", text="Which standard is used for imaging?", options=["DICOM", "HL7", "X12"]),
    ],
    # ... others implied
}

@router.get("/available", response_model=List[AssessmentConfig])
async def list_assessments(
    ctx: RequestContext = Depends(deps.get_request_context)
):
    """
    List all assessments available to the user.
    """
    return AVAILABLE_ASSESSMENTS

@router.post("/start", response_model=AssessmentResponse)
async def start_assessment(
    data: AssessmentCreate,
    db: AsyncSession = Depends(db.get_db),
    ctx: RequestContext = Depends(deps.get_request_context),
    # [AUTH] In prod, get user from token
    # current_user: User = Depends(deps.get_current_user)
):
    """
    Start a new assessment session.
    """
    # 1. Validate Config
    config = next((a for a in AVAILABLE_ASSESSMENTS if a.id == data.assessment_config_id), None)
    if not config:
        raise HTTPException(status_code=404, detail="Assessment type not found")
    
    # 2. Create Session in DB
    # [ID] Generate UUID
    session_id = str(uuid.uuid4())
    
    # [MOCK] using a hardcoded user_id for now since we don't have full Auth middleware active in this turn
    # In reality, use ctx.user_id or from token
    user_id = "u1" 
    
    new_assessment = Assessment(
        id=session_id,
        user_id=user_id,
        title=config.title,
        status="started",
        score=0.0
    )
    db.add(new_assessment)
    await db.commit()
    
    # 3. Return with Questions
    questions = MOCK_QUESTIONS.get(config.id, [])
    if not questions:
        # Fallback for mocked items without questions
        questions = [Question(id="q_gen", text="Placeholder question?", options=["Yes", "No"])]
        
    logger.info("assessment_started", id=session_id, title=config.title, **ctx.log_kwargs())
    
    return AssessmentResponse(
        id=session_id,
        title=config.title,
        status="started",
        created_at=new_assessment.created_at or datetime.utcnow(), # Handle commit refresh
        questions=questions
    )

@router.post("/{assessment_id}/submit", response_model=AssessmentResult)
async def submit_assessment(
    assessment_id: str,
    answers: List[AnswerSubmission],
    db: AsyncSession = Depends(db.get_db),
    ctx: RequestContext = Depends(deps.get_request_context)
):
    """
    Submit answers, calculate score, and generate Gap Analysis.
    """
    # 1. Fetch Assessment
    result = await db.execute(select(Assessment).where(Assessment.id == assessment_id))
    assessment = result.scalars().first()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment session not found")
        
    if assessment.status == "completed":
        raise HTTPException(status_code=400, detail="Assessment already completed")

    # 2. Calculate Score (Mock Logic)
    # [MAGIC] Random score for demo unless actually checking answers
    # In prod, fetch correct answers from DB and compare
    score = random.randint(40, 100)
    
    # 3. Generate Gap Analysis [ALGO]
    passed = score >= 70
    gap_analysis = ""
    recommendations = []
    
    if passed:
        gap_analysis = "Excellent command of core concepts. You are ready for advanced modules."
        recommendations = ["Advanced Certification", "Project: Build a real-world app"]
    else:
        gap_analysis = "Found gaps in foundational knowledge, specifically in interoperability standards."
        recommendations = [
            "Review Module 1: Introduction to FHIR",
            "Watch: 'Data Privacy in Healthcare' (15m)",
            "Practice: Mock dataset exercises"
        ]
        
    # 4. Save
    assessment.score = float(score)
    assessment.status = "completed"
    assessment.raw_results = {
        "answers_count": len(answers), 
        "gap_text": gap_analysis,
        "recommendations": recommendations
    }
    
    await db.commit()
    
    logger.info("assessment_completed", id=assessment_id, score=score, **ctx.log_kwargs())
    
    return AssessmentResult(
        assessment_id=assessment_id,
        score=float(score),
        passed=passed,
        gap_analysis=gap_analysis,
        recommended_actions=recommendations
    )
