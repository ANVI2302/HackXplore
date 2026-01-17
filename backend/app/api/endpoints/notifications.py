from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import structlog

from app.core import db
from app.api import deps
from app.crud import notification as notification_crud
from app.models.models import User
from app.schemas.notification import (
    NotificationResponse, NotificationList, NotificationMarkRead
)

router = APIRouter()
logger = structlog.get_logger()


@router.get("", response_model=NotificationList)
async def get_notifications(
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50)
):
    """Get all notifications for current user."""
    notifications = notification_crud.get_user_notifications(db, current_user.id, skip, limit)
    unread_count = notification_crud.get_unread_count(db, current_user.id)
    
    return NotificationList(
        notifications=[NotificationResponse.from_orm(n) for n in notifications],
        total_count=len(notifications),
        unread_count=unread_count
    )


@router.post("/mark-read", status_code=200)
async def mark_notifications_read(
    mark_in: NotificationMarkRead,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Mark notifications as read."""
    count = notification_crud.mark_multiple_as_read(db, mark_in.notification_ids)
    logger.info("notifications.marked_read", user_id=current_user.id, count=count)
    return {"marked_count": count}


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(
    notification_id: str,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Mark a single notification as read."""
    notification = notification_crud.get_user_notifications(db, current_user.id)
    
    # Find the notification
    target_notification = None
    for n in notification:
        if n.id == notification_id:
            target_notification = n
            break
    
    if not target_notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    updated = notification_crud.mark_as_read(db, notification_id)
    return NotificationResponse.from_orm(updated)


@router.delete("/{notification_id}", status_code=204)
async def delete_notification(
    notification_id: str,
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Delete a notification."""
    # Verify ownership
    notifications = notification_crud.get_user_notifications(db, current_user.id, 0, 1000)
    for n in notifications:
        if n.id == notification_id:
            notification_crud.delete_notification(db, notification_id)
            logger.info("notification.deleted", notification_id=notification_id)
            return
    
    raise HTTPException(status_code=404, detail="Notification not found")


@router.get("/unread-count", response_model=dict)
async def get_unread_count(
    db: AsyncSession = Depends(db.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get count of unread notifications."""
    count = notification_crud.get_unread_count(db, current_user.id)
    return {"unread_count": count}
