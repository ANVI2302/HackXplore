import uuid
import random
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
import structlog

from app.core import db
from app.api import deps
from app.crud import quiz as quiz_crud
from app.models.models import User, UserSkill
from app.schemas.quiz import (
    QuizCreate, QuizResponse, QuizQuestion, QuizAnswerSubmission,
    QuizResult, SkillGap, SkillGapAnalysis, QuizStats, QuizScore
)

router = APIRouter()
logger = structlog.get_logger()

# [MOCK] Question Bank - In production, this would be in database
QUESTION_BANK = {
    "Python": {
        "Beginner": [
            {
                "id": "q_py_b_1",
                "text": "What is the output of print(2 ** 3)?",
                "options": ["6", "8", "9", "5"],
                "correct": 1,
                "topic": "Basic Operations"
            },
            {
                "id": "q_py_b_2",
                "text": "Which of the following is a valid variable name in Python?",
                "options": ["2var", "var-name", "var_name", "var name"],
                "correct": 2,
                "topic": "Variables"
            },
            {
                "id": "q_py_b_3",
                "text": "What is the result of 'hello'.upper()?",
                "options": ["hello", "HELLO", "'HELLO'", "Error"],
                "correct": 1,
                "topic": "String Methods"
            },
            {
                "id": "q_py_b_4",
                "text": "What does len([1, 2, 3, 4]) return?",
                "options": ["3", "4", "5", "Error"],
                "correct": 1,
                "topic": "Lists"
            },
            {
                "id": "q_py_b_5",
                "text": "Which keyword is used to create a function in Python?",
                "options": ["function", "def", "define", "func"],
                "correct": 1,
                "topic": "Functions"
            },
            {
                "id": "q_py_b_6",
                "text": "What type is the value None in Python?",
                "options": ["NoneType", "Null", "Zero", "Empty"],
                "correct": 0,
                "topic": "Data Types"
            },
            {
                "id": "q_py_b_7",
                "text": "How do you create a dictionary in Python?",
                "options": ["{}", "[]", "()", "{}with keys"],
                "correct": 0,
                "topic": "Dictionaries"
            },
            {
                "id": "q_py_b_8",
                "text": "What is the output of list(range(3))?",
                "options": ["[1, 2, 3]", "[0, 1, 2]", "[0, 1, 2, 3]", "[3]"],
                "correct": 1,
                "topic": "Loops"
            },
        ],
        "Intermediate": [
            {
                "id": "q_py_i_1",
                "text": "What is the purpose of *args in a function?",
                "options": ["Fixed arguments", "Variable length argument list", "Keyword arguments", "Default arguments"],
                "correct": 1,
                "topic": "Function Arguments"
            },
            {
                "id": "q_py_i_2",
                "text": "What does a list comprehension do?",
                "options": ["Compresses lists", "Creates a list in a concise way", "Copies lists", "Sorts lists"],
                "correct": 1,
                "topic": "List Comprehensions"
            },
            {
                "id": "q_py_i_3",
                "text": "What is the output of [i for i in range(3)]?",
                "options": ["[1, 2, 3]", "[0, 1, 2]", "[0, 1, 2, 3]", "Error"],
                "correct": 1,
                "topic": "List Comprehensions"
            },
            {
                "id": "q_py_i_4",
                "text": "Which statement creates an iterator object in Python?",
                "options": ["iter()", "iterator()", "next()", "iterate()"],
                "correct": 0,
                "topic": "Iterators"
            },
            {
                "id": "q_py_i_5",
                "text": "What does the 'with' statement do?",
                "options": ["Creates scope", "Manages resources", "Imports modules", "Defines classes"],
                "correct": 1,
                "topic": "Context Managers"
            },
        ],
        "Advanced": [
            {
                "id": "q_py_a_1",
                "text": "What is a metaclass in Python?",
                "options": ["A subclass of a class", "A class whose instances are classes", "A superclass", "An abstract class"],
                "correct": 1,
                "topic": "Metaclasses"
            },
            {
                "id": "q_py_a_2",
                "text": "What is the GIL in Python?",
                "options": ["Global Interface Language", "Global Interpreter Lock", "Global Iteration Library", "Global Integer Limit"],
                "correct": 1,
                "topic": "Threading"
            },
            {
                "id": "q_py_a_3",
                "text": "How does Python's garbage collection work?",
                "options": ["Manual cleanup", "Reference counting", "Mark and sweep", "Both B and C"],
                "correct": 3,
                "topic": "Memory Management"
            },
        ],
    },
    "Data Science": {
        "Beginner": [
            {
                "id": "q_ds_b_1",
                "text": "What does 'DataFrame' refer to in Pandas?",
                "options": ["A picture frame", "A 2D labeled data structure", "A reference frame", "A data frame rate"],
                "correct": 1,
                "topic": "Pandas"
            },
            {
                "id": "q_ds_b_2",
                "text": "What is NumPy primarily used for?",
                "options": ["Numerical computing", "Web development", "GUI design", "Database management"],
                "correct": 0,
                "topic": "NumPy"
            },
        ],
        "Intermediate": [
            {
                "id": "q_ds_i_1",
                "text": "What is cross-validation used for?",
                "options": ["Data cleaning", "Model evaluation", "Feature scaling", "Data augmentation"],
                "correct": 1,
                "topic": "Model Evaluation"
            },
        ],
        "Advanced": [
            {
                "id": "q_ds_a_1",
                "text": "What is the difference between bias and variance?",
                "options": ["Bias is good, variance is bad", "They are the same", "Bias-variance tradeoff in model complexity", "Bias is for regression, variance is for classification"],
                "correct": 2,
                "topic": "Model Selection"
            },
        ],
    },
    "JavaScript": {
        "Beginner": [
            {
                "id": "q_js_b_1",
                "text": "What does 'DOM' stand for?",
                "options": ["Document Object Model", "Display Object Module", "Data Organization Method", "Digital Output Manager"],
                "correct": 0,
                "topic": "DOM"
            },
            {
                "id": "q_js_b_2",
                "text": "How do you declare a variable in modern JavaScript?",
                "options": ["var", "let", "const", "All of the above"],
                "correct": 3,
                "topic": "Variables"
            },
        ],
        "Intermediate": [
            {
                "id": "q_js_i_1",
                "text": "What are Promises in JavaScript?",
                "options": ["Variables that promise values", "Objects for asynchronous operations", "Guarantees about code execution", "Future values"],
                "correct": 1,
                "topic": "Async Programming"
            },
        ],
    },
    "Web Development": {
        "Beginner": [
            {
                "id": "q_web_b_1",
                "text": "What does HTML stand for?",
                "options": ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
                "correct": 0,
                "topic": "HTML Basics"
            },
        ],
    },
    "Machine Learning": {
        "Beginner": [
            {
                "id": "q_ml_b_1",
                "text": "What is supervised learning?",
                "options": ["Learning with a teacher", "Learning with labeled data", "Learning without data", "Learning in groups"],
                "correct": 1,
                "topic": "ML Basics"
            },
        ],
    }
}


def get_questions_for_skill(skill_name: str, difficulty: str, count: int) -> List[Dict]:
    """Get questions from question bank for a skill and difficulty."""
    if skill_name not in QUESTION_BANK:
        # If skill not in bank, return general questions
        return _generate_generic_questions(skill_name, difficulty, count)
    
    if difficulty not in QUESTION_BANK[skill_name]:
        return _generate_generic_questions(skill_name, difficulty, count)
    
    available = QUESTION_BANK[skill_name][difficulty]
    selected = random.sample(available, min(count, len(available)))
    
    return selected


def _generate_generic_questions(skill_name: str, difficulty: str, count: int) -> List[Dict]:
    """Generate generic questions for skills not in database."""
    difficulty_map = {
        "Beginner": "fundamental",
        "Intermediate": "practical",
        "Advanced": "expert"
    }
    
    topics_map = {
        "Beginner": ["Basics", "Introduction", "Fundamentals", "Getting Started"],
        "Intermediate": ["Practical Application", "Problem Solving", "Implementation", "Design Patterns"],
        "Advanced": ["Expert Level", "System Design", "Optimization", "Architecture"]
    }
    
    questions = []
    for i in range(count):
        questions.append({
            "id": f"q_generic_{uuid.uuid4().hex[:8]}",
            "text": f"In {skill_name} at {difficulty} level, what is the best practice for topic {i+1}?",
            "options": [
                f"Best practice for {skill_name} concept A",
                f"Best practice for {skill_name} concept B",
                f"Best practice for {skill_name} concept C",
                f"Best practice for {skill_name} concept D"
            ],
            "correct": random.randint(0, 3),
            "topic": topics_map.get(difficulty, ["General"])[0]
        })
    
    return questions


@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(
    config: QuizCreate,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Generate a new quiz based on skill and difficulty."""
    
    # Validate skill name
    if not config.skill_name:
        raise HTTPException(status_code=400, detail="Skill name is required")
    
    # Get questions
    questions_list = get_questions_for_skill(
        config.skill_name,
        config.difficulty_level,
        config.question_count
    )
    
    if not questions_list:
        raise HTTPException(status_code=404, detail="No questions available for this skill")
    
    # Create quiz in database
    questions_data = {
        "questions": [
            {
                "id": q["id"],
                "text": q["text"],
                "options": q["options"],
                "topic": q.get("topic", "General")
            }
            for q in questions_list
        ]
    }
    
    quiz = await quiz_crud.create_quiz(
        db,
        user_id=current_user.id,
        skill_name=config.skill_name,
        difficulty_level=config.difficulty_level,
        question_count=config.question_count,
        questions_data=questions_data
    )
    
    # Convert to response format
    questions = [
        QuizQuestion(
            id=q["id"],
            text=q["text"],
            options=q["options"],
            difficulty_level=config.difficulty_level,
            skill_tested=config.skill_name,
            topic=q.get("topic", "General")
        )
        for q in questions_list
    ]
    
    logger.info(
        "quiz_generated",
        quiz_id=quiz.id,
        skill=config.skill_name,
        difficulty=config.difficulty_level
    )
    
    return QuizResponse(
        id=quiz.id,
        skill_name=quiz.skill_name,
        difficulty_level=quiz.difficulty_level,
        title=quiz.title,
        status=quiz.status,
        question_count=quiz.question_count,
        created_at=quiz.created_at,
        questions=questions
    )


@router.post("/{quiz_id}/start", response_model=QuizResponse)
async def start_quiz(
    quiz_id: str,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Start a quiz session."""
    quiz = await quiz_crud.get_quiz(db, quiz_id)
    
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    if quiz.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to start this quiz")
    
    quiz = await quiz_crud.start_quiz(db, quiz_id)
    
    # Reconstruct questions for response
    questions = []
    if quiz.questions_data and "questions" in quiz.questions_data:
        for q in quiz.questions_data["questions"]:
            questions.append(QuizQuestion(
                id=q["id"],
                text=q["text"],
                options=q["options"],
                difficulty_level=quiz.difficulty_level,
                skill_tested=quiz.skill_name,
                topic=q.get("topic", "General")
            ))
    
    logger.info("quiz_started", quiz_id=quiz_id, user_id=current_user.id)
    
    return QuizResponse(
        id=quiz.id,
        skill_name=quiz.skill_name,
        difficulty_level=quiz.difficulty_level,
        title=quiz.title,
        status=quiz.status,
        question_count=quiz.question_count,
        created_at=quiz.created_at,
        started_at=quiz.started_at,
        questions=questions
    )


@router.post("/{quiz_id}/submit", response_model=QuizResult)
async def submit_quiz(
    quiz_id: str,
    answers: List[QuizAnswerSubmission],
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Submit quiz answers and get results."""
    quiz = await quiz_crud.get_quiz(db, quiz_id)
    
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    if quiz.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to submit this quiz")
    
    # Calculate score
    correct_count = 0
    answers_dict = {}
    
    if quiz.questions_data and "questions" in quiz.questions_data:
        questions = quiz.questions_data["questions"]
        
        for answer in answers:
            # Find the correct answer
            question = next((q for q in QUESTION_BANK.get(quiz.skill_name, {}).get(quiz.difficulty_level, [])
                           if q["id"] == answer.question_id), None)
            
            answers_dict[answer.question_id] = answer.selected_option_index
            
            if question and question["correct"] == answer.selected_option_index:
                correct_count += 1
    
    # Calculate time taken
    time_taken = 0
    if quiz.started_at:
        time_taken = int((datetime.utcnow() - quiz.started_at).total_seconds())
    
    # Determine performance level
    score_percentage = (correct_count / quiz.question_count * 100) if quiz.question_count > 0 else 0
    
    if score_percentage >= 80:
        performance = "Excellent"
        strength_areas = ["Most topics", "Key concepts", "Practical application"]
        weak_areas = []
    elif score_percentage >= 60:
        performance = "Good"
        strength_areas = ["Core concepts", "Basic understanding"]
        weak_areas = ["Advanced topics", "Edge cases"]
    elif score_percentage >= 40:
        performance = "Needs Improvement"
        strength_areas = ["Basic understanding"]
        weak_areas = ["Core concepts", "Practical application", "Advanced topics"]
    else:
        performance = "Review Required"
        strength_areas = []
        weak_areas = ["All major topics", "Fundamentals", "Core concepts"]
    
    # Record the quiz results
    performance_data = {
        "score_percentage": score_percentage,
        "performance_level": performance,
        "correct_answers": correct_count,
        "incorrect_answers": quiz.question_count - correct_count,
        "total_questions": quiz.question_count,
        "strength_areas": strength_areas,
        "weak_areas": weak_areas
    }
    
    quiz = await quiz_crud.submit_quiz(
        db,
        quiz_id,
        answers_dict,
        correct_count,
        time_taken,
        performance_data
    )
    
    # Record skill gap if score is below 70%
    if score_percentage < 70:
        current_skill = db.query(UserSkill).filter(
            UserSkill.user_id == current_user.id,
            UserSkill.skill_name == quiz.skill_name
        ).first()
        
        current_level = current_skill.proficiency if current_skill else 0
        required_level = min(10, max(current_level + 2, 5))
        
        await quiz_crud.record_skill_gap(
            db,
            current_user.id,
            quiz.skill_name,
            current_level,
            required_level,
            "quiz",
            quiz_id
        )
    
    logger.info(
        "quiz_submitted",
        quiz_id=quiz_id,
        score=score_percentage,
        correct=correct_count,
        total=quiz.question_count
    )
    
    # Recommended topics based on weak areas
    recommended_topics = weak_areas if weak_areas else ["Review fundamentals"]
    
    next_steps = []
    if score_percentage >= 80:
        next_steps = [
            "Try the next difficulty level",
            "Take another quiz on a different skill",
            "Work on a project using this skill"
        ]
    elif score_percentage >= 60:
        next_steps = [
            "Review weak areas",
            "Take practice quiz again",
            "Study recommended resources"
        ]
    else:
        next_steps = [
            "Review fundamentals carefully",
            "Take beginner level quiz first",
            "Seek mentorship on this skill"
        ]
    
    return QuizResult(
        quiz_id=quiz.id,
        skill_name=quiz.skill_name,
        difficulty_level=quiz.difficulty_level,
        score=score_percentage,
        passed=score_percentage >= 70,
        total_questions=quiz.question_count,
        correct_answers=correct_count,
        incorrect_answers=quiz.question_count - correct_count,
        time_taken_seconds=time_taken,
        performance_summary=performance,
        strength_areas=strength_areas,
        weak_areas=weak_areas,
        recommended_topics=recommended_topics,
        next_steps=next_steps
    )


@router.get("", response_model=List[QuizResponse])
async def list_user_quizzes(
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    skill: Optional[str] = None,
    status: Optional[str] = None
):
    """Get user's quizzes."""
    quizzes = await quiz_crud.get_user_quizzes(db, current_user.id, skip, limit, skill)
    
    response = []
    for quiz in quizzes:
        questions = []
        if quiz.status == "not_started" and quiz.questions_data:
            # Only return questions if quiz hasn't started
            if "questions" in quiz.questions_data:
                questions = [
                    QuizQuestion(
                        id=q["id"],
                        text=q["text"],
                        options=q["options"],
                        difficulty_level=quiz.difficulty_level,
                        skill_tested=quiz.skill_name,
                        topic=q.get("topic", "General")
                    )
                    for q in quiz.questions_data["questions"]
                ]
        
        response.append(QuizResponse(
            id=quiz.id,
            skill_name=quiz.skill_name,
            difficulty_level=quiz.difficulty_level,
            title=quiz.title,
            status=quiz.status,
            question_count=quiz.question_count,
            created_at=quiz.created_at,
            started_at=quiz.started_at,
            completed_at=quiz.completed_at,
            questions=questions if quiz.status == "not_started" else None
        ))
    
    return response


@router.get("/stats", response_model=QuizStats)
async def get_quiz_stats(
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get user's quiz statistics."""
    stats = await quiz_crud.get_quiz_statistics(db, current_user.id)
    
    return QuizStats(
        total_quizzes_taken=stats["total_quizzes_taken"],
        average_score=stats["average_score"],
        completion_rate=stats["completion_rate"],
        skills_practiced=stats["skills_practiced"],
        highest_score=stats["highest_score"],
        lowest_score=stats["lowest_score"],
        most_recent_quiz=stats["most_recent_quiz"]
    )


@router.get("/gaps", response_model=SkillGapAnalysis)
async def get_skill_gaps(
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get skill gaps identified from quiz performance."""
    gaps = await quiz_crud.identify_skill_gaps(db, current_user.id)
    
    # Convert to SkillGap objects
    skill_gaps = [
        SkillGap(
            skill_name=gap["skill_name"],
            current_level=gap["current_level"],
            required_level=gap["required_level"],
            gap_level=gap["gap_level"],
            proficiency=_level_to_proficiency(gap["current_level"])
        )
        for gap in gaps
    ]
    
    top_priority = [gap["skill_name"] for gap in gaps[:3]]
    
    return SkillGapAnalysis(
        user_id=current_user.id,
        total_skills_assessed=len(gaps),
        skill_gaps=skill_gaps,
        top_priority_skills=top_priority
    )


@router.get("/{quiz_id}", response_model=QuizResponse)
async def get_quiz_details(
    quiz_id: str,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get details of a specific quiz."""
    quiz = await quiz_crud.get_quiz(db, quiz_id)
    
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    if quiz.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this quiz")
    
    questions = []
    if quiz.questions_data and "questions" in quiz.questions_data:
        questions = [
            QuizQuestion(
                id=q["id"],
                text=q["text"],
                options=q["options"],
                difficulty_level=quiz.difficulty_level,
                skill_tested=quiz.skill_name,
                topic=q.get("topic", "General")
            )
            for q in quiz.questions_data["questions"]
        ]
    
    return QuizResponse(
        id=quiz.id,
        skill_name=quiz.skill_name,
        difficulty_level=quiz.difficulty_level,
        title=quiz.title,
        status=quiz.status,
        question_count=quiz.question_count,
        created_at=quiz.created_at,
        started_at=quiz.started_at,
        completed_at=quiz.completed_at,
        questions=questions if quiz.status == "not_started" else None
    )


def _level_to_proficiency(level: int) -> str:
    """Convert numeric level to proficiency string."""
    if level <= 3:
        return "Beginner"
    elif level <= 6:
        return "Intermediate"
    else:
        return "Advanced"
