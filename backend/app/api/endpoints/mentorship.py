from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import structlog

from app.core import db
from app.api import deps
from app.crud import mentorship as mentorship_crud
from app.models.models import User
from app.schemas.mentorship import (
    MentorshipCreate, MentorshipResponse, MentorshipList, 
    MentorshipUpdate, MentorAvailableResponse
)

router = APIRouter()
logger = structlog.get_logger()


@router.get("/mentees", response_model=MentorshipList)
async def get_my_mentees(
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get all mentees for current mentor."""
    mentorships = mentorship_crud.get_mentorships_for_user(db, current_user.id, as_mentee=False)
    return MentorshipList(
        mentorships=[MentorshipResponse.from_orm(m) for m in mentorships],
        total_count=len(mentorships)
    )


@router.get("/mentors", response_model=MentorshipList)
async def get_my_mentors(
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get all mentors for current mentee."""
    mentorships = mentorship_crud.get_mentorships_for_user(db, current_user.id, as_mentee=True)
    return MentorshipList(
        mentorships=[MentorshipResponse.from_orm(m) for m in mentorships],
        total_count=len(mentorships)
    )


@router.get("/available-mentors", response_model=List[MentorAvailableResponse])
async def get_available_mentors(
    skill_focus: str = Query(...),
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Find available mentors for a specific skill."""
    mentors = mentorship_crud.get_available_mentors(db, skill_focus)
    mentor_responses = []
    
    for mentor in mentors:
        if mentor.id != current_user.id:
            expertise = [s.skill_name for s in mentor.skills]
            mentee_count = len(mentorship_crud.get_mentorships_for_user(db, mentor.id, as_mentee=False))
            
            mentor_responses.append(MentorAvailableResponse(
                id=mentor.id,
                full_name=mentor.full_name,
                title=mentor.title,
                bio=mentor.bio,
                avatar_url=mentor.avatar_url,
                expertise_skills=expertise,
                current_mentees_count=mentee_count
            ))
    
    return mentor_responses


@router.post("", response_model=MentorshipResponse, status_code=201)
async def create_mentorship(
    mentorship_in: MentorshipCreate,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Request mentorship from a mentor."""
    mentor = db.query(User).filter(User.id == mentorship_in.mentor_id).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    mentorship = mentorship_crud.create_mentorship(
        db,
        mentor_id=mentorship_in.mentor_id,
        mentee_id=current_user.id,
        skill_focus=mentorship_in.skill_focus
    )
    
    logger.info("mentorship.created", mentee_id=current_user.id, mentor_id=mentorship_in.mentor_id)
    return MentorshipResponse.from_orm(mentorship)


@router.get("/{mentorship_id}", response_model=MentorshipResponse)
async def get_mentorship(
    mentorship_id: str,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get mentorship details."""
    mentorship = mentorship_crud.get_mentorship(db, mentorship_id)
    if not mentorship:
        raise HTTPException(status_code=404, detail="Mentorship not found")
    
    if mentorship.mentor_id != current_user.id and mentorship.mentee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return MentorshipResponse.from_orm(mentorship)


@router.patch("/{mentorship_id}", response_model=MentorshipResponse)
async def update_mentorship(
    mentorship_id: str,
    mentorship_in: MentorshipUpdate,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Update mentorship status."""
    mentorship = mentorship_crud.get_mentorship(db, mentorship_id)
    if not mentorship:
        raise HTTPException(status_code=404, detail="Mentorship not found")
    
    if mentorship.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only mentor can update status")
    
    updated = mentorship_crud.update_mentorship_status(db, mentorship_id, mentorship_in.status)
    logger.info("mentorship.updated", mentorship_id=mentorship_id, status=mentorship_in.status)
    return MentorshipResponse.from_orm(updated)


@router.delete("/{mentorship_id}", status_code=204)
async def cancel_mentorship(
    mentorship_id: str,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Cancel a mentorship."""
    mentorship = mentorship_crud.get_mentorship(db, mentorship_id)
    if not mentorship:
        raise HTTPException(status_code=404, detail="Mentorship not found")
    
    if mentorship.mentor_id != current_user.id and mentorship.mentee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    mentorship_crud.delete_mentorship(db, mentorship_id)
    logger.info("mentorship.cancelled", mentorship_id=mentorship_id)
