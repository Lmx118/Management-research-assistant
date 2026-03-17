from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.enums import ArtifactType, Paradigm


class ParadigmFit(BaseModel):
    paradigm: Paradigm
    rationale: str = Field(max_length=1000)


class ResearchQuestionCandidate(BaseModel):
    question: str = Field(max_length=1000)
    why_this_matters: str = Field(max_length=2000)
    best_fit_paradigm: ParadigmFit
    potential_contribution: str = Field(max_length=1500)
    risks_or_weaknesses: list[str] = Field(default_factory=list)
    suggested_next_step: str = Field(max_length=1000)

    @field_validator("risks_or_weaknesses")
    @classmethod
    def strip_items(cls, value: list[str]) -> list[str]:
        return [item.strip() for item in value if item.strip()]


class ResearchQuestionGenerationRequest(BaseModel):
    idea: str = Field(min_length=10, max_length=3000)
    additional_context: str | None = Field(default=None, max_length=4000)
    constraints: str | None = Field(default=None, max_length=2000)
    response_language: Literal["en", "zh"] = "en"


class ResearchQuestionGenerationPayload(BaseModel):
    input_interpretation: str = Field(max_length=2000)
    candidate_research_questions: list[ResearchQuestionCandidate] = Field(min_length=1, max_length=3)


class QuestionGenerationArtifactRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    artifact_type: ArtifactType
    payload: ResearchQuestionGenerationPayload
    created_at: datetime


class DesignIssue(BaseModel):
    severity: Literal["low", "medium", "high"]
    issue: str = Field(max_length=500)
    rationale: str = Field(max_length=2000)
    affected_module: str = Field(max_length=200)
    next_action: str = Field(max_length=1000)


class DesignReviewPayload(BaseModel):
    overall_assessment: str = Field(max_length=2000)
    issues: list[DesignIssue] = Field(default_factory=list)


class DesignReviewArtifactRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    artifact_type: ArtifactType
    payload: DesignReviewPayload
    created_at: datetime


class DesignReviewRequest(BaseModel):
    response_language: Literal["en", "zh"] = "en"
