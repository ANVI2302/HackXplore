from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.models import Notification
import uuid


def create_notification(db: Session, user_id: str, notif_type: str, title: str, message: str, 
                       related_id: Optional[str] = None) -> Notification:
    notification = Notification(
        id=str(uuid.uuid4()),
        user_id=user_id,
        type=notif_type,
        title=title,
        message=message,
        related_id=related_id
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def get_user_notifications(db: Session, user_id: str, skip: int = 0, limit: int = 10) -> List[Notification]:
    return db.query(Notification).filter(
        Notification.user_id == user_id
    ).order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()


def get_unread_count(db: Session, user_id: str) -> int:
    return db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).count()


def mark_as_read(db: Session, notification_id: str) -> Optional[Notification]:
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if notification:
        notification.is_read = True
        db.commit()
        db.refresh(notification)
    return notification


def mark_multiple_as_read(db: Session, notification_ids: List[str]) -> int:
    count = db.query(Notification).filter(
        Notification.id.in_(notification_ids)
    ).update({"is_read": True})
    db.commit()
    return count


def delete_notification(db: Session, notification_id: str) -> bool:
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if notification:
        db.delete(notification)
        db.commit()
        return True
    return False
