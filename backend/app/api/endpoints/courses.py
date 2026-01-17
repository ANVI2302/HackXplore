from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
import structlog

from app.core import db
from app.api import deps
from app.crud import course as course_crud, quiz as quiz_crud
from app.models.models import User, UserSkill, SkillGapRecord
from app.schemas.course import CourseResponse, CourseList, RecommendedCourseResponse

router = APIRouter()
logger = structlog.get_logger()


@router.get("", response_model=CourseList)
async def list_courses(
    db: AsyncSession = Depends(db.get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    difficulty: str = Query(None),
    current_user: User = Depends(deps.get_current_user)
):
    """Get list of available courses."""
    if difficulty:
        courses = course_crud.get_courses_by_difficulty(db, difficulty)
    else:
        courses = course_crud.get_all_courses(db, skip, limit)
    
    return CourseList(
        courses=[CourseResponse.from_orm(c) for c in courses],
        total_count=len(courses)
    )


@router.get("/recommendations", response_model=List[RecommendedCourseResponse])
async def get_recommended_courses(
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get AI-powered course recommendations based on skill gaps and user proficiency."""
    
    # Step 1: Get user's current skills
    user_skills = db.query(UserSkill).filter(UserSkill.user_id == current_user.id).all()
    user_skills_dict = {skill.skill_name: skill.proficiency for skill in user_skills}
    
    # Step 2: Identify skill gaps from quiz performance
    skill_gaps = quiz_crud.identify_skill_gaps(db, current_user.id)
    
    # Step 3: Get all available courses
    all_courses = course_crud.get_all_courses(db, 0, 100)
    
    recommendations = []
    
    # Priority 1: Courses for skills with identified gaps
    for gap in skill_gaps:
        matching_courses = [c for c in all_courses 
                          if gap["skill_name"] in c.skills_covered]
        
        for course in matching_courses:
            # Calculate relevance score
            matching_skills = len([s for s in course.skills_covered 
                                  if s == gap["skill_name"]])
            
            # Higher weight for courses addressing gaps
            gap_priority = 100 - (gap["gap_level"] * 5)  # Prioritize larger gaps
            difficulty_match = 100 if course.difficulty_level == "Beginner" else 80
            
            relevance = (
                (matching_skills / max(len(course.skills_covered), 1)) * 40 +  # 40% skill match
                (gap_priority / 100) * 40 +  # 40% gap priority
                (course.rating / 5) * 20  # 20% course rating
            )
            
            recommendations.append({
                "course": course,
                "relevance_score": min(relevance * 100 / 100, 100),
                "match_reason": f"Recommended to address gap in {gap['skill_name']} (Current: {gap['current_level']}/10, Required: {gap['required_level']}/10)"
            })
    
    # Priority 2: Courses for skills user lacks but should develop
    recommended_skills = [gap["skill_name"] for gap in skill_gaps[:5]]
    for skill in recommended_skills:
        if skill not in user_skills_dict or user_skills_dict[skill] < 3:
            matching_courses = [c for c in all_courses 
                              if skill in c.skills_covered and
                              not any(rec["course"].id == c.id for rec in recommendations)]
            
            for course in matching_courses[:2]:  # Limit to top 2 courses per skill
                relevance = (
                    (1 / max(len(course.skills_covered), 1)) * 50 +
                    (course.rating / 5) * 50
                )
                
                recommendations.append({
                    "course": course,
                    "relevance_score": min(relevance * 100 / 100, 90),
                    "match_reason": f"Learn {skill} - a skill you're developing"
                })
    
    # Priority 3: Intermediate/Advanced courses for skills user already knows
    if not skill_gaps:  # If no gaps, recommend advancing existing skills
        for skill, proficiency in user_skills_dict.items():
            if proficiency >= 5:  # Already has intermediate knowledge
                matching_courses = [c for c in all_courses 
                                  if skill in c.skills_covered and
                                  c.difficulty_level in ["Intermediate", "Advanced"] and
                                  not any(rec["course"].id == c.id for rec in recommendations)]
                
                for course in matching_courses[:1]:
                    relevance = (
                        (proficiency / 10) * 70 +
                        (course.rating / 5) * 30
                    )
                    recommendations.append({
                        "course": course,
                        "relevance_score": min(relevance * 100 / 100, 85),
                        "match_reason": f"Advance your {skill} skills to expert level"
                    })
    
    # Remove duplicates and sort by relevance
    seen_course_ids = set()
    unique_recommendations = []
    
    for rec in sorted(recommendations, key=lambda x: x["relevance_score"], reverse=True):
        if rec["course"].id not in seen_course_ids:
            unique_recommendations.append(RecommendedCourseResponse(
                course=CourseResponse.from_orm(rec["course"]),
                relevance_score=rec["relevance_score"],
                match_reason=rec["match_reason"]
            ))
            seen_course_ids.add(rec["course"].id)
    
    logger.info(
        "course_recommendations_generated",
        user_id=current_user.id,
        recommendation_count=len(unique_recommendations),
        skill_gaps_count=len(skill_gaps)
    )
    
    return unique_recommendations[:20]  # Return top 20 recommendations


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(
    course_id: str,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get a specific course."""
    course = course_crud.get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return CourseResponse.from_orm(course)


@router.get("/by-skill/{skill_name}", response_model=CourseList)
async def get_courses_by_skill(
    skill_name: str,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get courses for a specific skill."""
    courses = course_crud.get_courses_by_skill(db, skill_name)
    return CourseList(
        courses=[CourseResponse.from_orm(c) for c in courses],
        total_count=len(courses)
    )
