import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.paper_library import PaperLibraryEntryCreate, PaperLibraryEntryRead
from app.services.paper_library import PaperLibraryService


router = APIRouter(prefix="/paper-library", tags=["paper-library"])

paper_library_service = PaperLibraryService()


@router.get("/entries", response_model=list[PaperLibraryEntryRead])
def list_paper_library_entries(db: Session = Depends(get_db)) -> list[PaperLibraryEntryRead]:
    return paper_library_service.list_entries(db)


@router.post("/entries", response_model=PaperLibraryEntryRead, status_code=status.HTTP_201_CREATED)
def save_paper_library_entry(
    payload: PaperLibraryEntryCreate,
    db: Session = Depends(get_db),
) -> PaperLibraryEntryRead:
    return paper_library_service.save_entry(db, payload)


@router.delete("/entries/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_paper_library_entry(entry_id: uuid.UUID, db: Session = Depends(get_db)) -> None:
    paper_library_service.delete_entry(db, entry_id)
