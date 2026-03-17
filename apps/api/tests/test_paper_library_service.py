from datetime import datetime, timezone
from uuid import uuid4

from app.models.paper_library_entry import PaperLibraryEntry
from app.schemas.paper_library import PaperLibraryEntryCreate
from app.services.paper_library import PaperLibraryService


def test_to_read_model_maps_published_at_iso() -> None:
    entry = PaperLibraryEntry(
        id=uuid4(),
        doi="10.1287/mnsc.2026.0001",
        title="Platform disclosure timing and rival response",
        journal="Management Science",
        source_url="https://doi.org/10.1287/mnsc.2026.0001",
        ai_summary="A concise summary.",
        authors=["Jane Doe"],
        published_at_iso="2026-03-14T00:00:00+00:00",
    )
    entry.created_at = datetime(2026, 3, 14, tzinfo=timezone.utc)
    entry.updated_at = datetime(2026, 3, 14, tzinfo=timezone.utc)

    result = PaperLibraryService._to_read_model(entry)

    assert result.doi == "10.1287/mnsc.2026.0001"
    assert result.published_at == datetime(2026, 3, 14, tzinfo=timezone.utc)


def test_create_schema_accepts_feed_payload_shape() -> None:
    payload = PaperLibraryEntryCreate(
        doi="10.1287/mnsc.2026.0001",
        title="Platform disclosure timing and rival response",
        journal="Management Science",
        source_url="https://doi.org/10.1287/mnsc.2026.0001",
        ai_summary="A concise summary of the article.",
        authors=["Jane Doe", "John Smith"],
        published_at=datetime(2026, 3, 14, tzinfo=timezone.utc),
    )

    assert payload.doi.startswith("10.1287")
