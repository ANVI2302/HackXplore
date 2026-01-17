from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class AchievementBase(BaseModel):
    title: str
    description: str
    badge_name: str
    icon_url: Optional[str] = None


class AchievementCreate(AchievementBase):
    pass


class AchievementResponse(AchievementBase):
    id: str
    user_id: str
    earned_at: datetime

    class Config:
        from_attributes = True


class AchievementList(BaseModel):
    achievements: List[AchievementResponse]
    total_count: int
