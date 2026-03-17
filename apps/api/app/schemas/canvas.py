from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.enums import CanvasKind


class OMModelCanvasPayload(BaseModel):
    research_puzzle: str = Field(default="", max_length=4000)
    actors: str = Field(default="", max_length=4000)
    timing: str = Field(default="", max_length=4000)
    information_structure: str = Field(default="", max_length=4000)
    decisions: str = Field(default="", max_length=4000)
    payoffs: str = Field(default="", max_length=4000)
    institutional_context: str = Field(default="", max_length=4000)
    equilibrium_concept: str = Field(default="", max_length=2000)
    propositions: list[str] = Field(default_factory=list)
    empirical_implications: list[str] = Field(default_factory=list)
    validation_notes: str = Field(default="", max_length=4000)

    @field_validator("propositions", "empirical_implications")
    @classmethod
    def drop_blank_items(cls, value: list[str]) -> list[str]:
        return [item.strip() for item in value if item.strip()]


class ORProblemFramePayload(BaseModel):
    objective: str = Field(default="", max_length=4000)
    decision_variables: str = Field(default="", max_length=4000)
    constraints: str = Field(default="", max_length=4000)
    inputs_and_data: str = Field(default="", max_length=4000)
    solution_approach: str = Field(default="", max_length=4000)
    validation_plan: str = Field(default="", max_length=4000)


class ISStudyFramePayload(BaseModel):
    unit_of_analysis: str = Field(default="", max_length=4000)
    treatment_or_exposure: str = Field(default="", max_length=4000)
    outcome: str = Field(default="", max_length=4000)
    data_source: str = Field(default="", max_length=4000)
    identification_strategy: str = Field(default="", max_length=4000)
    threats_to_validity: str = Field(default="", max_length=4000)
    robustness_plan: str = Field(default="", max_length=4000)


class OMModelCanvasUpsert(BaseModel):
    payload: OMModelCanvasPayload


class ORProblemFrameUpsert(BaseModel):
    payload: ORProblemFramePayload


class ISStudyFrameUpsert(BaseModel):
    payload: ISStudyFramePayload


class OMModelCanvasRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    project_id: UUID
    canvas_kind: CanvasKind
    version: int
    payload: OMModelCanvasPayload
    updated_at: datetime


class ORProblemFrameRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    project_id: UUID
    canvas_kind: CanvasKind
    version: int
    payload: ORProblemFramePayload
    updated_at: datetime


class ISStudyFrameRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    project_id: UUID
    canvas_kind: CanvasKind
    version: int
    payload: ISStudyFramePayload
    updated_at: datetime

