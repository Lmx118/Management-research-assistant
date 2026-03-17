import uuid

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.paper_library_entry import PaperLibraryEntry


class PaperLibraryRepository:
    def list(self, db: Session) -> list[PaperLibraryEntry]:
        statement = select(PaperLibraryEntry).order_by(PaperLibraryEntry.created_at.desc())
        return list(db.scalars(statement).all())

    def get(self, db: Session, entry_id: uuid.UUID) -> PaperLibraryEntry | None:
        return db.get(PaperLibraryEntry, entry_id)

    def get_by_doi(self, db: Session, doi: str) -> PaperLibraryEntry | None:
        statement = select(PaperLibraryEntry).where(PaperLibraryEntry.doi == doi)
        return db.scalar(statement)

    def save(self, db: Session, entry: PaperLibraryEntry) -> PaperLibraryEntry:
        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry

    def delete(self, db: Session, entry_id: uuid.UUID) -> bool:
        statement = delete(PaperLibraryEntry).where(PaperLibraryEntry.id == entry_id)
        result = db.execute(statement)
        db.commit()
        return bool(result.rowcount)
