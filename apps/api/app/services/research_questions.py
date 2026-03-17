import uuid
from typing import Any

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.llm.service import build_llm_provider
from app.models.enums import ArtifactType
from app.repositories.artifacts import ArtifactRepository
from app.schemas.artifact import (
    QuestionGenerationArtifactRead,
    ResearchQuestionGenerationPayload,
    ResearchQuestionGenerationRequest,
)
from app.schemas.project import ProjectRead
from app.services.canvases import CanvasService
from app.workflows.prompts import build_question_generator_user_prompt, question_generator_system_prompt


class ResearchQuestionService:
    def __init__(self) -> None:
        self.artifact_repository = ArtifactRepository()
        self.canvas_service = CanvasService()
        self.settings = get_settings()

    def generate(
        self,
        db: Session,
        *,
        project: ProjectRead,
        request: ResearchQuestionGenerationRequest,
    ) -> QuestionGenerationArtifactRead:
        if self.settings.llm_provider == "stub":
            raise ValueError(
                "Research Question Generator is running in stub mode. "
                "Set LLM_PROVIDER=openai_compatible, configure your model API credentials, and restart the API."
            )

        provider = build_llm_provider(self.settings)
        canvas_snapshot = self.canvas_service.build_canvas_snapshot(db, project.id)
        context = self._build_context(project, request, canvas_snapshot)
        payload = provider.generate_object(
            system_prompt=question_generator_system_prompt(),
            user_prompt=build_question_generator_user_prompt(context),
            response_model=ResearchQuestionGenerationPayload,
        )
        artifact = self.artifact_repository.create(
            db,
            project_id=project.id,
            artifact_type=ArtifactType.RESEARCH_QUESTION_GENERATION,
            payload=payload.model_dump(),
        )
        return QuestionGenerationArtifactRead.model_validate(artifact)

    def latest(self, db: Session, project_id: uuid.UUID) -> QuestionGenerationArtifactRead | None:
        artifact = self.artifact_repository.latest_by_type(
            db,
            project_id=project_id,
            artifact_type=ArtifactType.RESEARCH_QUESTION_GENERATION,
        )
        return QuestionGenerationArtifactRead.model_validate(artifact) if artifact else None

    @staticmethod
    def _build_context(
        project: ProjectRead,
        request: ResearchQuestionGenerationRequest,
        canvas_snapshot: dict[str, Any],
    ) -> dict[str, Any]:
        return {
            "project": project.model_dump(mode="json"),
            "idea": request.idea,
            "additional_context": request.additional_context,
            "constraints": request.constraints,
            "response_language": request.response_language,
            "canvases": {
                key: value.model_dump(mode="json") if value else None
                for key, value in canvas_snapshot.items()
            },
        }
