import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.canvas import Canvas
from app.models.enums import CanvasKind


class CanvasRepository:
    def get_by_kind(self, db: Session, project_id: uuid.UUID, canvas_kind: CanvasKind) -> Canvas | None:
        statement = select(Canvas).where(
            Canvas.project_id == project_id,
            Canvas.canvas_kind == canvas_kind,
        )
        return db.scalar(statement)

    def upsert(
        self,
        db: Session,
        *,
        project_id: uuid.UUID,
        canvas_kind: CanvasKind,
        payload: dict,
    ) -> Canvas:
        canvas = self.get_by_kind(db, project_id, canvas_kind)

        if canvas is None:
            canvas = Canvas(project_id=project_id, canvas_kind=canvas_kind, payload=payload)
            db.add(canvas)
        else:
            canvas.payload = payload
            canvas.version += 1

        db.commit()
        db.refresh(canvas)
        return canvas

