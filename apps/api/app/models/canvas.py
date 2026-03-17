import uuid
from typing import Any

from sqlalchemy import Enum as SAEnum, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin
from app.models.enums import CanvasKind


class Canvas(TimestampMixin, Base):
    __tablename__ = "canvases"
    __table_args__ = (UniqueConstraint("project_id", "canvas_kind", name="uq_project_canvas_kind"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
    )
    canvas_kind: Mapped[CanvasKind] = mapped_column(
        SAEnum(CanvasKind, name="canvas_kind"),
        nullable=False,
    )
    version: Mapped[int] = mapped_column(default=1, nullable=False)
    payload: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)

    project = relationship("Project", back_populates="canvases")

