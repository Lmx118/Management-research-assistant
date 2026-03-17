from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import Paradigm


class ProjectCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    paradigm: Paradigm
    domain: str = Field(min_length=2, max_length=120)
    problem_statement: str = Field(min_length=10, max_length=4000)
    notes: str | None = Field(default=None, max_length=4000)


class ProjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    paradigm: Paradigm
    domain: str
    problem_statement: str
    notes: str | None
    created_at: datetime
    updated_at: datetime

