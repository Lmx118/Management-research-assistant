from datetime import datetime
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class PaperLibraryEntryCreate(BaseModel):
    doi: str = Field(min_length=3, max_length=200)
    title: str = Field(min_length=3, max_length=1000)
    journal: str = Field(min_length=2, max_length=500)
    source_url: HttpUrl
    ai_summary: str = Field(min_length=10, max_length=2000)
    authors: list[str] = Field(default_factory=list)
    published_at: datetime


class PaperLibraryEntryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    doi: str
    title: str
    journal: str
    source_url: HttpUrl
    ai_summary: str
    authors: list[str]
    published_at: datetime
    created_at: datetime
    updated_at: datetime
