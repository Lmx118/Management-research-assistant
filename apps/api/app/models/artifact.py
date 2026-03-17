import uuid
from typing import Any

from sqlalchemy import Enum as SAEnum, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin
from app.models.enums import ArtifactType


class Artifact(TimestampMixin, Base):
    __tablename__ = "artifacts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
    )
    artifact_type: Mapped[ArtifactType] = mapped_column(
        SAEnum(ArtifactType, name="artifact_type"),
        nullable=False,
    )
    payload: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)

    project = relationship("Project", back_populates="artifacts")

