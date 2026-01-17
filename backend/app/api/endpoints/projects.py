from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
import structlog

from app.core import db
from app.api import deps
from app.crud import project as project_crud
from app.models.models import User
from app.schemas.project import ProjectResponse, ProjectCreate, ProjectUpdate, ProjectList

router = APIRouter()
logger = structlog.get_logger()


@router.get("/me", response_model=ProjectList)
async def get_my_projects(
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get all projects for current user."""
    projects = project_crud.get_user_projects(db, current_user.id)
    return ProjectList(
        projects=[ProjectResponse.from_orm(p) for p in projects],
        total_count=len(projects)
    )


@router.post("", response_model=ProjectResponse, status_code=201)
async def create_project(
    project_in: ProjectCreate,
    db: version = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Create a new project in portfolio."""
    project = project_crud.create_project(
        db,
        user_id=current_user.id,
        title=project_in.title,
        description=project_in.description,
        skills_used=project_in.skills_used,
        github_url=project_in.github_url,
        demo_url=project_in.demo_url,
        image_url=project_in.image_url,
        start_date=project_in.start_date
    )
    logger.info("project.created", user_id=current_user.id, project_id=project.id)
    return ProjectResponse.from_orm(project)


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get a specific project."""
    project = project_crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectResponse.from_orm(project)


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_in: ProjectUpdate,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Update a project."""
    project = project_crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    update_data = project_in.dict(exclude_unset=True)
    updated_project = project_crud.update_project(db, project_id, **update_data)
    logger.info("project.updated", project_id=project_id)
    return ProjectResponse.from_orm(updated_project)


@router.delete("/{project_id}", status_code=204)
async def delete_project(
    project_id: str,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Delete a project."""
    project = project_crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    project_crud.delete_project(db, project_id)
    logger.info("project.deleted", project_id=project_id)


@router.post("/{project_id}/endorse", response_model=ProjectResponse)
async def endorse_project(
    project_id: str,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Endorse a project (increment endorsement count)."""
    project = project_crud.increment_endorsements(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    logger.info("project.endorsed", project_id=project_id, endorser_id=current_user.id)
    return ProjectResponse.from_orm(project)
