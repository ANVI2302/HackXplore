from datetime import timedelta
import uuid
import structlog
from fastapi import APIRouter
from pydantic import BaseModel

from app.core import security, config

router = APIRouter()
logger = structlog.get_logger()

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    username: str
    password: str

class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    skills: list = []


@router.post("/login/access-token", response_model=Token)
async def login_access_token(form_data: LoginRequest):
    """
    Mock login - accepts any email/password and returns a token.
    No database or credential validation.
    """
    # Generate a mock token with the email as subject
    access_token_expires = timedelta(minutes=config.settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    return {
        "access_token": security.create_access_token(
            subject=form_data.username, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/register", response_model=UserProfile)
async def register_user(
    user_in: dict
):
    """
    Mock registration - creates a user profile without saving to database.
    """
    # Generate a mock user ID
    new_user_id = str(uuid.uuid4())
    
    return UserProfile(
        id=new_user_id,
        email=user_in.get('email', ''),
        full_name=user_in.get('full_name', ''),
        skills=[]
    )
