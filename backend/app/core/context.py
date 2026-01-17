import time
import uuid
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict
import structlog

# [OBSERVABILITY] Structured logging setup ensures logs are machine-readable for Splunk/Datadog
logger = structlog.get_logger()

class RequestContext(BaseModel):
    """
    Immutable request context carrying deadline, correlation ID, and user info.
    Passed through every layer to enforce timeouts and traceability.
    """
    request_id: str
    start_time: float
    timeout_ms: int
    user_id: Optional[str] = None
    # Flexible strict config
    model_config = ConfigDict(frozen=True)

    @property
    def cid(self) -> str:
        """Correlation ID for cross-service tracing."""
        return self.request_id

    @property
    def remaining_ms(self) -> int:
        """Calculate remaining time budget for the request."""
        elapsed = (time.time() - self.start_time) * 1000
        remaining = self.timeout_ms - elapsed
        return max(0, int(remaining))

    def budget(self, operation_allocation_ms: int) -> float:
        """
        Allocate a time budget for a specific operation (e.g., DB call, external API).
        
        Usage:
            timeout=ctx.budget(50)  # Ask for 50ms, but get min(50, remaining)
            
        Returns:
            Float seconds for standard library timeouts (e.g. requests, asyncio.wait_for)
        """
        # [TIMEOUT] Aggressive cutting of downstream calls to preserve overall SLO
        limit = min(operation_allocation_ms, self.remaining_ms)
        # [EDGE:TIMEOUT] safeguard against passing 0 or negative to libraries that block indefinitely on None/0
        return max(limit / 1000.0, 0.001)  # Minimum 1ms

    def log_kwargs(self) -> Dict[str, Any]:
        """Standard context to inject into all logs within this scope."""
        return {
            "cid": self.cid,
            "user_id": self.user_id or "anon",
            "remaining_ms": self.remaining_ms
        }

def create_context(
    timeout_ms: int = 500,  # [DEFAULTS] As per prompt: p99 < 500ms
    user_id: Optional[str] = None,
    cid: Optional[str] = None
) -> RequestContext:
    """Factory to initialize context at the API boundary."""
    return RequestContext(
        request_id=cid or str(uuid.uuid4()),
        start_time=time.time(),
        timeout_ms=timeout_ms,
        user_id=user_id
    )
