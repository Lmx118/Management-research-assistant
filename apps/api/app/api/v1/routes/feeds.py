from typing import Literal

from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.feed import InformsLatestDigestRead
from app.services.informs_feed import InformsFeedService


router = APIRouter(prefix="/feeds", tags=["feeds"])

informs_feed_service = InformsFeedService()


@router.get(
    "/informs-latest",
    response_model=InformsLatestDigestRead,
    status_code=status.HTTP_200_OK,
)
def get_informs_latest_digest(
    response_language: Literal["en", "zh"] = Query(default="en"),
    limit: int = Query(default=6, ge=1, le=12),
    force_refresh: bool = Query(default=False),
) -> InformsLatestDigestRead:
    try:
        return informs_feed_service.get_latest_digest(
            response_language=response_language,
            limit=limit,
            force_refresh=force_refresh,
        )
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
