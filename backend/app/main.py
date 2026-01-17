from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import structlog
import time
from app.core import errors
from app.api.endpoints import system, users, auth, assessments, achievements, projects, courses, mentorship, notifications, quiz
from app.core.config import settings

# [OBSERVABILITY] Configure structlog (simplified setup)
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ],
    logger_factory=structlog.PrintLoggerFactory(),
)

logger = structlog.get_logger()

def create_application() -> FastAPI:
    application = FastAPI(
        title="Skill Intelligence Platform API",
        version="0.1.0",
        docs_url="/docs",
        openapi_url="/openapi.json"
    )

    # [SECURITY] CORS Middleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], # TODO: Restrict to frontend domain in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # [PERFORMANCE] Request timing middleware
    @application.middleware("http")
    async def add_request_timing(request, call_next):
        start = time.time()
        response = await call_next(request)
        duration = time.time() - start
        response.headers["X-Process-Time"] = str(duration)
        logger.info("request", method=request.method, path=request.url.path, duration_ms=f"{duration*1000:.2f}")
        return response

    # Exception Handlers
    application.add_exception_handler(errors.AppError, errors.app_exception_handler)
    application.add_exception_handler(Exception, errors.general_exception_handler)

    # Routers
    application.include_router(system.router, prefix="/system", tags=["system"])
    application.include_router(users.router, prefix="/users", tags=["users"])
    # [AUTH] Mount auth routes
    application.include_router(auth.router, prefix=settings.API_V1_STR + "/auth", tags=["auth"])
    # [DOMAIN] Assessments
    application.include_router(assessments.router, prefix=settings.API_V1_STR + "/assessments", tags=["assessments"])
    # [NEW FEATURES] Additional endpoints
    application.include_router(achievements.router, prefix=settings.API_V1_STR + "/achievements", tags=["achievements"])
    application.include_router(projects.router, prefix=settings.API_V1_STR + "/projects", tags=["projects"])
    application.include_router(courses.router, prefix=settings.API_V1_STR + "/courses", tags=["courses"])
    application.include_router(mentorship.router, prefix=settings.API_V1_STR + "/mentorships", tags=["mentorships"])
    application.include_router(notifications.router, prefix=settings.API_V1_STR + "/notifications", tags=["notifications"])
    application.include_router(quiz.router, prefix=settings.API_V1_STR + "/quizzes", tags=["quizzes"])
    
    return application

app = create_application()

if __name__ == "__main__":
    import uvicorn
    # [DEFAULTS] Run on port 8000
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
