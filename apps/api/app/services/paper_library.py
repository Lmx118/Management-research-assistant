import uuid
import uuid
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.paper_library_entry import PaperLibraryEntry
from app.repositories.paper_library import PaperLibraryRepository
from app.schemas.paper_library import PaperLibraryEntryCreate, PaperLibraryEntryRead


class PaperLibraryService:
    def __init__(self) -> None:
        self.repository = PaperLibraryRepository()

    def list_entries(self, db: Session) -> list[PaperLibraryEntryRead]:
        return [self._to_read_model(entry) for entry in self.repository.list(db)]

    def save_entry(self, db: Session, payload: PaperLibraryEntryCreate) -> PaperLibraryEntryRead:
        existing = self.repository.get_by_doi(db, payload.doi)

        if existing is not None:
            existing.title = payload.title
            existing.journal = payload.journal
            existing.source_url = str(payload.source_url)
            existing.ai_summary = payload.ai_summary
            existing.authors = payload.authors
            existing.published_at_iso = payload.published_at.isoformat()
            saved = self.repository.save(db, existing)
            return self._to_read_model(saved)

        entry = PaperLibraryEntry(
            doi=payload.doi,
            title=payload.title,
            journal=payload.journal,
            source_url=str(payload.source_url),
            ai_summary=payload.ai_summary,
            authors=payload.authors,
            published_at_iso=payload.published_at.isoformat(),
        )
        saved = self.repository.save(db, entry)
        return self._to_read_model(saved)

    def delete_entry(self, db: Session, entry_id: uuid.UUID) -> None:
        deleted = self.repository.delete(db, entry_id)

        if not deleted:
            raise HTTPException(status_code=404, detail="Saved paper not found.")

    @staticmethod
    def _to_read_model(entry: PaperLibraryEntry) -> PaperLibraryEntryRead:
        return PaperLibraryEntryRead(
            id=entry.id,
            doi=entry.doi,
            title=entry.title,
            journal=entry.journal,
            source_url=entry.source_url,
            ai_summary=entry.ai_summary,
            authors=entry.authors,
            published_at=datetime.fromisoformat(entry.published_at_iso),
            created_at=entry.created_at,
            updated_at=entry.updated_at,
        )
