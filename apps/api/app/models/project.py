import uuid

from sqlalchemy import Enum as SAEnum, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin
from app.models.enums import Paradigm


class Project(TimestampMixin, Base):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    paradigm: Mapped[Paradigm] = mapped_column(SAEnum(Paradigm, name="paradigm"), nullable=False)
    domain: Mapped[str] = mapped_column(String(120), nullable=False)
    problem_statement: Mapped[str] = mapped_column(Text, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    canvases = relationship("Canvas", back_populates="project", cascade="all, delete-orphan")
    artifacts = relationship("Artifact", back_populates="project", cascade="all, delete-orphan")

