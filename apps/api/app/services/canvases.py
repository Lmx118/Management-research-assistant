import uuid
from typing import Any

from sqlalchemy.orm import Session

from app.models.canvas import Canvas
from app.models.enums import CanvasKind
from app.repositories.canvases import CanvasRepository
from app.schemas.canvas import (
    ISStudyFramePayload,
    ISStudyFrameRead,
    OMModelCanvasPayload,
    OMModelCanvasRead,
    ORProblemFramePayload,
    ORProblemFrameRead,
)


class CanvasService:
    def __init__(self) -> None:
        self.repository = CanvasRepository()

    def get_om_model_canvas(self, db: Session, project_id: uuid.UUID) -> OMModelCanvasRead | None:
        canvas = self.repository.get_by_kind(db, project_id, CanvasKind.OM_MODEL_CANVAS)
        return self._to_om_read(canvas) if canvas else None

    def save_om_model_canvas(
        self,
        db: Session,
        project_id: uuid.UUID,
        payload: OMModelCanvasPayload,
    ) -> OMModelCanvasRead:
        canvas = self.repository.upsert(
            db,
            project_id=project_id,
            canvas_kind=CanvasKind.OM_MODEL_CANVAS,
            payload=payload.model_dump(),
        )
        return self._to_om_read(canvas)

    def get_or_problem_frame(self, db: Session, project_id: uuid.UUID) -> ORProblemFrameRead | None:
        canvas = self.repository.get_by_kind(db, project_id, CanvasKind.OR_PROBLEM_FRAME)
        return self._to_or_read(canvas) if canvas else None

    def save_or_problem_frame(
        self,
        db: Session,
        project_id: uuid.UUID,
        payload: ORProblemFramePayload,
    ) -> ORProblemFrameRead:
        canvas = self.repository.upsert(
            db,
            project_id=project_id,
            canvas_kind=CanvasKind.OR_PROBLEM_FRAME,
            payload=payload.model_dump(),
        )
        return self._to_or_read(canvas)

    def get_is_study_frame(self, db: Session, project_id: uuid.UUID) -> ISStudyFrameRead | None:
        canvas = self.repository.get_by_kind(db, project_id, CanvasKind.IS_STUDY_FRAME)
        return self._to_is_read(canvas) if canvas else None

    def save_is_study_frame(
        self,
        db: Session,
        project_id: uuid.UUID,
        payload: ISStudyFramePayload,
    ) -> ISStudyFrameRead:
        canvas = self.repository.upsert(
            db,
            project_id=project_id,
            canvas_kind=CanvasKind.IS_STUDY_FRAME,
            payload=payload.model_dump(),
        )
        return self._to_is_read(canvas)

    def build_canvas_snapshot(self, db: Session, project_id: uuid.UUID) -> dict[str, Any]:
        return {
            "om_model_canvas": self.get_om_model_canvas(db, project_id),
            "or_problem_frame": self.get_or_problem_frame(db, project_id),
            "is_study_frame": self.get_is_study_frame(db, project_id),
        }

    @staticmethod
    def _to_om_read(canvas: Canvas) -> OMModelCanvasRead:
        return OMModelCanvasRead.model_validate(canvas)

    @staticmethod
    def _to_or_read(canvas: Canvas) -> ORProblemFrameRead:
        return ORProblemFrameRead.model_validate(canvas)

    @staticmethod
    def _to_is_read(canvas: Canvas) -> ISStudyFrameRead:
        return ISStudyFrameRead.model_validate(canvas)
