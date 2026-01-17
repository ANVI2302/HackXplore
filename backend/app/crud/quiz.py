from datetime import datetime
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.models import Quiz, UserSkill, SkillGapRecord
import uuid


async def create_quiz(
    db: AsyncSession,
    user_id: str,
    skill_name: str,
    difficulty_level: str,
    question_count: int,
    questions_data: dict,
) -> Quiz:
    """Create a new quiz session."""
    quiz_id = f"quiz_{uuid.uuid4().hex[:12]}"
    
    quiz = Quiz(
        id=quiz_id,
        user_id=user_id,
        skill_name=skill_name,
        difficulty_level=difficulty_level,
        title=f"{skill_name} {difficulty_level} Quiz",
        status="not_started",
        question_count=question_count,
        questions_data=questions_data,
    )
    
    db.add(quiz)
    await db.commit()
    await db.refresh(quiz)
    return quiz


async def get_quiz(db: AsyncSession, quiz_id: str) -> Optional[Quiz]:
    """Get a quiz by ID."""
    result = await db.execute(select(Quiz).where(Quiz.id == quiz_id))
    return result.scalars().first()


async def start_quiz(db: AsyncSession, quiz_id: str) -> Optional[Quiz]:
    """Start a quiz session."""
    quiz = await get_quiz(db, quiz_id)
    if quiz:
        quiz.status = "in_progress"
        quiz.started_at = datetime.utcnow()
        await db.commit()
        await db.refresh(quiz)
    return quiz


async def submit_quiz(
    db: AsyncSession,
    quiz_id: str,
    answers: dict,
    correct_count: int,
    time_taken_seconds: int,
    performance_data: dict
) -> Optional[Quiz]:
    """Submit quiz answers and record results."""
    quiz = await get_quiz(db, quiz_id)
    if quiz:
        quiz.status = "completed"
        quiz.answers_submitted = answers
        quiz.correct_answers = correct_count
        quiz.score = (correct_count / quiz.question_count * 100) if quiz.question_count > 0 else 0
        quiz.time_taken_seconds = time_taken_seconds
        quiz.performance_data = performance_data
        quiz.completed_at = datetime.utcnow()
        
        await db.commit()
        await db.refresh(quiz)
    return quiz


async def get_user_quizzes(
    db: AsyncSession,
    user_id: str,
    skip: int = 0,
    limit: int = 10,
    skill_name: Optional[str] = None
) -> List[Quiz]:
    """Get all quizzes for a user."""
    query = select(Quiz).where(Quiz.user_id == user_id)
    
    if skill_name:
        query = query.where(Quiz.skill_name == skill_name)
    
    query = query.order_by(desc(Quiz.created_at)).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


async def get_quiz_statistics(db: AsyncSession, user_id: str) -> dict:
    """Get quiz statistics for a user."""
    result = await db.execute(
        select(Quiz).where(
            Quiz.user_id == user_id,
            Quiz.status == "completed"
        )
    )
    quizzes = result.scalars().all()
    
    if not quizzes:
        return {
            "total_quizzes_taken": 0,
            "average_score": 0,
            "completion_rate": 0,
            "skills_practiced": [],
            "highest_score": None,
            "lowest_score": None,
            "most_recent_quiz": None
        }
    
    scores = [q.score for q in quizzes if q.score is not None]
    skills = list(set([q.skill_name for q in quizzes]))
    
    return {
        "total_quizzes_taken": len(quizzes),
        "average_score": sum(scores) / len(scores) if scores else 0,
        "completion_rate": 100,
        "skills_practiced": skills,
        "highest_score": max(scores) if scores else None,
        "lowest_score": min(scores) if scores else None,
        "most_recent_quiz": max([q.created_at for q in quizzes]) if quizzes else None
    }


async def identify_skill_gaps(db: AsyncSession, user_id: str) -> List[dict]:
    """Identify skill gaps based on quiz performance and user skills."""
    # Get user's current skills
    user_skills_result = await db.execute(select(UserSkill).where(UserSkill.user_id == user_id))
    user_skills = user_skills_result.scalars().all()
    user_skills_dict = {skill.skill_name: skill.proficiency for skill in user_skills}
    
    # Get quiz performance for each skill
    quiz_performance = {}
    quizzes_result = await db.execute(
        select(Quiz).where(
            Quiz.user_id == user_id,
            Quiz.status == "completed"
        )
    )
    quizzes = quizzes_result.scalars().all()
    
    for quiz in quizzes:
        if quiz.skill_name not in quiz_performance:
            quiz_performance[quiz.skill_name] = []
        quiz_performance[quiz.skill_name].append(quiz.score)
    
    # Identify gaps
    skill_gaps = []
    
    # For skills with poor quiz performance
    for skill_name, scores in quiz_performance.items():
        avg_score = sum(scores) / len(scores) if scores else 0
        current_level = user_skills_dict.get(skill_name, 0)
        
        # If average score is below 70%, there's a gap
        if avg_score < 70:
            required_level = min(10, max(current_level + 2, 5))
            
            gap = {
                "skill_name": skill_name,
                "current_level": current_level,
                "required_level": required_level,
                "gap_level": required_level - current_level,
                "avg_score": avg_score
            }
            skill_gaps.append(gap)
    
    # Sort by gap level (highest priority first)
    skill_gaps.sort(key=lambda x: x["gap_level"], reverse=True)
    
    return skill_gaps


async def record_skill_gap(
    db: AsyncSession,
    user_id: str,
    skill_name: str,
    current_level: int,
    required_level: int,
    source: str,
    source_id: Optional[str] = None
) -> SkillGapRecord:
    """Record a identified skill gap."""
    gap_id = f"gap_{uuid.uuid4().hex[:12]}"
    
    gap_record = SkillGapRecord(
        id=gap_id,
        user_id=user_id,
        skill_name=skill_name,
        current_level=current_level,
        required_level=required_level,
        source=source,
        source_id=source_id,
    )
    
    db.add(gap_record)
    await db.commit()
    await db.refresh(gap_record)
    return gap_record


async def get_user_skill_gaps(db: AsyncSession, user_id: str) -> List[SkillGapRecord]:
    """Get all identified skill gaps for a user."""
    result = await db.execute(
        select(SkillGapRecord)
        .where(
            SkillGapRecord.user_id == user_id,
            SkillGapRecord.status == "open"
        )
        .order_by(desc(SkillGapRecord.identified_at))
    )
    return result.scalars().all()
