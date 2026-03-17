from fastapi import APIRouter

from app.core.config import get_settings


router = APIRouter(tags=["health"])


@router.get("/health")
def healthcheck() -> dict[str, str]:
    settings = get_settings()
    return {
        "status": "ok",
        "llm_provider": settings.llm_provider,
        "llm_model": settings.openai_compatible_model if settings.llm_provider == "openai_compatible" else "stub",
    }
