from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, JSON, Float, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.core.db import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    full_name: Mapped[str] = mapped_column(String, nullable=True)
    title: Mapped[str] = mapped_column(String, nullable=True)
    bio: Mapped[str] = mapped_column(Text, nullable=True)
    avatar_url: Mapped[str] = mapped_column(String, nullable=True)
    
    # [OBSERVABILITY] Audit fields
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    # Relationships
    skills: Mapped[List["UserSkill"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    assessments: Mapped[List["Assessment"]] = relationship(back_populates="user")
    achievements: Mapped[List["Achievement"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    projects: Mapped[List["Project"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    mentorships_as_mentor: Mapped[List["Mentorship"]] = relationship("Mentorship", foreign_keys="Mentorship.mentor_id", back_populates="mentor")
    mentorships_as_mentee: Mapped[List["Mentorship"]] = relationship("Mentorship", foreign_keys="Mentorship.mentee_id", back_populates="mentee")
    connections: Mapped[List["UserConnection"]] = relationship("UserConnection", foreign_keys="UserConnection.user_id", back_populates="user")
    notifications: Mapped[List["Notification"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    quizzes: Mapped[List["Quiz"]] = relationship(back_populates="user", cascade="all, delete-orphan")

class UserSkill(Base):
    """
    Link table for Users and Skills with proficiency data.
    """
    __tablename__ = "user_skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    skill_name: Mapped[str] = mapped_column(String, index=True) # Normalized name
    proficiency: Mapped[int] = mapped_column(Integer) # 1-10 scale
    verified: Mapped[bool] = mapped_column(default=False)
    
    user: Mapped["User"] = relationship(back_populates="skills")

class Assessment(Base):
    """
    Stores results of skill assessments.
    """
    __tablename__ = "assessments"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String)
    score: Mapped[float] = mapped_column(Float, nullable=True) # Normalized 0-100
    status: Mapped[str] = mapped_column(String, default="started") # started, completed, abandoned
    
    # [FLEXIBILITY] JSON dump of full results
    raw_results: Mapped[dict] = mapped_column(JSON, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    user: Mapped["User"] = relationship(back_populates="assessments")


class Achievement(Base):
    """
    Represents user achievements and milestones.
    """
    __tablename__ = "achievements"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(Text)
    badge_name: Mapped[str] = mapped_column(String)  # e.g., "python_master", "first_project"
    icon_url: Mapped[str] = mapped_column(String, nullable=True)
    earned_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    user: Mapped["User"] = relationship(back_populates="achievements")


class CareerPath(Base):
    """
    Predefined career progression paths based on skills and roles.
    """
    __tablename__ = "career_paths"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(Text)
    target_role: Mapped[str] = mapped_column(String)
    industry: Mapped[str] = mapped_column(String)  # e.g., "CS", "Agriculture", "Smart Cities"
    required_skills: Mapped[dict] = mapped_column(JSON)  # {"skill_name": required_level}
    estimated_months: Mapped[int] = mapped_column(Integer)
    difficulty_level: Mapped[str] = mapped_column(String)  # Beginner, Intermediate, Advanced


class Project(Base):
    """
    User portfolio projects.
    """
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(Text)
    skills_used: Mapped[list] = mapped_column(JSON)  # List of skill names
    github_url: Mapped[str] = mapped_column(String, nullable=True)
    demo_url: Mapped[str] = mapped_column(String, nullable=True)
    image_url: Mapped[str] = mapped_column(String, nullable=True)
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    end_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    endorsement_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    user: Mapped["User"] = relationship(back_populates="projects")


class Course(Base):
    """
    Learning resources/courses available on the platform.
    """
    __tablename__ = "courses"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(Text)
    provider: Mapped[str] = mapped_column(String)  # e.g., "Coursera", "Udemy", "Internal"
    url: Mapped[str] = mapped_column(String)
    difficulty_level: Mapped[str] = mapped_column(String)
    duration_hours: Mapped[int] = mapped_column(Integer)
    skills_covered: Mapped[list] = mapped_column(JSON)  # List of skill names
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Mentorship(Base):
    """
    Mentorship connections between users.
    """
    __tablename__ = "mentorships"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    mentor_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    mentee_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    skill_focus: Mapped[str] = mapped_column(String)  # The primary skill being mentored
    status: Mapped[str] = mapped_column(String, default="pending")  # pending, active, completed
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    ended_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    mentor: Mapped["User"] = relationship("User", foreign_keys=[mentor_id], back_populates="mentorships_as_mentor")
    mentee: Mapped["User"] = relationship("User", foreign_keys=[mentee_id], back_populates="mentorships_as_mentee")


class UserConnection(Base):
    """
    Network connections between users.
    """
    __tablename__ = "user_connections"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    connected_user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    status: Mapped[str] = mapped_column(String, default="pending")  # pending, connected, blocked
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    user: Mapped["User"] = relationship(back_populates="connections", foreign_keys=[user_id])


class Notification(Base):
    """
    User notifications for activities and updates.
    """
    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    type: Mapped[str] = mapped_column(String)  # achievement, mentorship, course_recommendation, connection_request
    title: Mapped[str] = mapped_column(String)
    message: Mapped[str] = mapped_column(Text)
    related_id: Mapped[str] = mapped_column(String, nullable=True)  # ID of related entity
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    user: Mapped["User"] = relationship(back_populates="notifications")


class Quiz(Base):
    """
    Quiz sessions for skill assessment and practice.
    """
    __tablename__ = "quizzes"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    skill_name: Mapped[str] = mapped_column(String, index=True)
    difficulty_level: Mapped[str] = mapped_column(String)  # Beginner, Intermediate, Advanced
    title: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="not_started")  # not_started, in_progress, completed
    question_count: Mapped[int] = mapped_column(Integer)
    score: Mapped[float] = mapped_column(Float, nullable=True)  # 0-100
    correct_answers: Mapped[int] = mapped_column(Integer, default=0)
    time_taken_seconds: Mapped[int] = mapped_column(Integer, nullable=True)
    
    # [FLEXIBILITY] JSON dump of quiz content and results
    questions_data: Mapped[dict] = mapped_column(JSON, nullable=True)
    answers_submitted: Mapped[dict] = mapped_column(JSON, nullable=True)
    performance_data: Mapped[dict] = mapped_column(JSON, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    
    user: Mapped["User"] = relationship(back_populates="quizzes")


class SkillGapRecord(Base):
    """
    Records of identified skill gaps for users.
    """
    __tablename__ = "skill_gap_records"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    skill_name: Mapped[str] = mapped_column(String, index=True)
    current_level: Mapped[int] = mapped_column(Integer)  # 0-10
    required_level: Mapped[int] = mapped_column(Integer)  # 0-10
    source: Mapped[str] = mapped_column(String)  # quiz, assessment, self-evaluation
    source_id: Mapped[str] = mapped_column(String, nullable=True)  # Reference to quiz/assessment ID
    
    identified_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    status: Mapped[str] = mapped_column(String, default="open")  # open, in_progress, addressed
    
    user: Mapped["User"] = relationship()
