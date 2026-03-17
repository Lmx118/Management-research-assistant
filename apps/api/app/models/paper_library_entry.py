import uuid

from sqlalchemy import String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class PaperLibraryEntry(TimestampMixin, Base):
    __tablename__ = "paper_library_entries"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doi: Mapped[str] = mapped_column(String(200), nullable=False, unique=True, index=True)
    title: Mapped[str] = mapped_column(String(1000), nullable=False)
    journal: Mapped[str] = mapped_column(String(500), nullable=False)
    source_url: Mapped[str] = mapped_column(Text, nullable=False)
    ai_summary: Mapped[str] = mapped_column(Text, nullable=False)
    authors: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    published_at_iso: Mapped[str] = mapped_column(String(64), nullable=False)
