from typing import Any, Dict, Optional
from fastapi import Request, status
from fastapi.responses import JSONResponse
import structlog
# from app.core.context import get_request_context  # Removed unused/broken import

logger = structlog.get_logger()

class AppError(Exception):
    """
    Base class for application errors.
    
    Args:
        message: User-facing error message (actionable).
        code: Internal error code for client logic.
        status_code: HTTP status code.
        details: Optional dictionary with more specific error info.
    """
    def __init__(
        self, 
        message: str, 
        code: str = "INTERNAL_ERROR", 
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)

class ResourceNotFoundError(AppError):
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            message=f"{resource} with id '{identifier}' not found.",
            code="RESOURCE_NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND,
            details={"resource": resource, "id": identifier}
        )

class DomainError(AppError):
    """Business logic violation (e.g. insufficient funds, invalid state transition)."""
    def __init__(self, message: str, code: str = "DOMAIN_ERROR"):
        super().__init__(
            message=message,
            code=code,
            status_code=status.HTTP_400_BAD_REQUEST
        )

class UpstreamError(AppError):
    """Dependency failure (DB, API) - Degrading gracefully."""
    def __init__(self, service_name: str, reason: str):
        # [MAGIC] Don't expose internal stack traces to user, but give them a category
        super().__init__(
            message="Service temporarily unavailable. Please try again later.",
            code="UPSTREAM_FAILURE",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            details={"service": service_name}
        )

async def app_exception_handler(request: Request, exc: AppError) -> JSONResponse:
    """
    Handle AppError instances.
    Logs full context for devs, returns clean JSON for users.
    """
    # Safe fallback if context middleware didn't run (e.g. very early error)
    cid = request.headers.get("X-Request-ID", "unknown")
    
    # [LOGGING] Log the full internal details
    logger.error(
        "app_error",
        error_code=exc.code,
        status_code=exc.status_code,
        message=str(exc),
        details=exc.details,
        cid=cid,
        path=request.url.path
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
                "cid": cid # [CID] Return CID to user so they can report it to support
            }
        }
    )

async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all for handling specific unhandled exceptions (500s)."""
    cid = request.headers.get("X-Request-ID", "unknown")
    
    # [LOGGING] Log the traceback here (omitted for brevity, structlog handles it)
    logger.exception("unhandled_error", cid=cid, path=request.url.path)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred. Our team has been notified.",
                "cid": cid
            }
        }
    )
