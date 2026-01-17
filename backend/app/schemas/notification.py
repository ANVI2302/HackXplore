from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NotificationBase(BaseModel):
    type: str  # achievement, mentorship, course_recommendation, connection_request
    title: str
    message: str
    related_id: Optional[str] = None


class NotificationCreate(NotificationBase):
    user_id: str


class NotificationResponse(NotificationBase):
    id: str
    user_id: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationList(BaseModel):
    notifications: list[NotificationResponse]
    total_count: int
    unread_count: int


class NotificationMarkRead(BaseModel):
    notification_ids: list[str]
