from fastapi import APIRouter, Depends, status
from app.core.context import RequestContext
from app.api.deps import get_request_context

router = APIRouter()

@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check(
    ctx: RequestContext = Depends(get_request_context)
):
    """
    Liveness probe.
    Does not check dependencies (that's /ready).
    Should always return 200 unless the app is completely broken.
    """
    return {
        "status": "ok", 
        "version": "0.1.0",
        "cid": ctx.cid
    }

@router.get("/ready", status_code=status.HTTP_200_OK)
async def readiness_check(
    ctx: RequestContext = Depends(get_request_context)
):
    """
    Readiness probe.
    Checks connections to DB, Cache, etc.
    Returns 503 if critical deps are down.
    """
    # [PATTERN] fail-fast but degrade gracefully if non-critical
    # Mocking a dependency check
    # if not db.is_connected():
    #     raise UpstreamError("database", "Connection refused")
    
    return {
        "status": "ready",
        "checks": {
            "database": "ok", # Mock
            "cache": "ok"     # Mock
        },
        "cid": ctx.cid
    }
