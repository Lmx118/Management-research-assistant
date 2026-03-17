import uuid
from typing import Any

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.llm.service import build_llm_provider
from app.models.enums import ArtifactType, Paradigm
from app.repositories.artifacts import ArtifactRepository
from app.schemas.artifact import DesignIssue, DesignReviewArtifactRead, DesignReviewPayload, DesignReviewRequest
from app.schemas.project import ProjectRead
from app.services.canvases import CanvasService
from app.workflows.prompts import build_design_checker_user_prompt, design_checker_system_prompt


def collect_rule_based_issues(project: ProjectRead, canvas_snapshot: dict[str, Any]) -> list[DesignIssue]:
    issues: list[DesignIssue] = []

    if len(project.problem_statement.strip()) < 40:
        issues.append(
            DesignIssue(
                severity="medium",
                issue="Problem statement is still too thin.",
                rationale="A short problem statement usually hides unresolved scope and contribution choices.",
                affected_module="project framing",
                next_action="Expand the problem statement to explain the phenomenon, strategic tension, and intended contribution.",
            )
        )

    paradigm_canvas_key = {
        Paradigm.OM: "om_model_canvas",
        Paradigm.OR: "or_problem_frame",
        Paradigm.IS: "is_study_frame",
    }[project.paradigm]
    paradigm_canvas = canvas_snapshot.get(paradigm_canvas_key)

    if paradigm_canvas is None:
        issues.append(
            DesignIssue(
                severity="high",
                issue="Primary paradigm canvas has not been completed.",
                rationale="The design checker needs the main framing artifact to assess internal coherence.",
                affected_module=paradigm_canvas_key,
                next_action="Complete the primary paradigm canvas before relying on the review.",
            )
        )
        return issues

    payload = paradigm_canvas.payload

    if project.paradigm == Paradigm.OM:
        if not payload.actors or not payload.timing or not payload.equilibrium_concept:
            issues.append(
                DesignIssue(
                    severity="high",
                    issue="OM Model Canvas is missing core strategic assumptions.",
                    rationale="Actors, timing, and equilibrium concept are minimum inputs for disciplined analytical framing.",
                    affected_module="om_model_canvas",
                    next_action="Specify the actors, game sequence, and equilibrium concept before drafting propositions.",
                )
            )
        if len(payload.propositions) == 0:
            issues.append(
                DesignIssue(
                    severity="medium",
                    issue="No propositions have been articulated yet.",
                    rationale="Without propositions the canvas cannot connect model structure to contribution claims.",
                    affected_module="om_model_canvas",
                    next_action="Draft one or two directional propositions tied to the core mechanism.",
                )
            )

    if project.paradigm == Paradigm.OR and not payload.objective:
        issues.append(
            DesignIssue(
                severity="medium",
                issue="OR frame is missing an explicit objective.",
                rationale="Optimization framing breaks down when the objective is implied rather than stated.",
                affected_module="or_problem_frame",
                next_action="State the exact optimization objective and what trade-off it captures.",
            )
        )

    if project.paradigm == Paradigm.IS and not payload.identification_strategy:
        issues.append(
            DesignIssue(
                severity="high",
                issue="IS frame is missing an identification strategy.",
                rationale="Empirical research design cannot be evaluated without a credible causal or econometric identification approach.",
                affected_module="is_study_frame",
                next_action="Specify the identification strategy and the main validity threat it addresses.",
            )
        )

    return issues


class DesignCheckerService:
    def __init__(self) -> None:
        self.artifact_repository = ArtifactRepository()
        self.canvas_service = CanvasService()
        self.settings = get_settings()

    def review(self, db: Session, *, project: ProjectRead, request: DesignReviewRequest) -> DesignReviewArtifactRead:
        if self.settings.llm_provider == "stub":
            raise ValueError(
                "Design Checker is running in stub mode. "
                "Set LLM_PROVIDER=openai_compatible, configure your model API credentials, and restart the API."
            )

        provider = build_llm_provider(self.settings)
        canvas_snapshot = self.canvas_service.build_canvas_snapshot(db, project.id)
        rule_issues = collect_rule_based_issues(project, canvas_snapshot)
        review_context = {
            "project": project.model_dump(mode="json"),
            "response_language": request.response_language,
            "rule_based_issues": [issue.model_dump(mode="json") for issue in rule_issues],
            "canvases": {
                key: value.model_dump(mode="json") if value else None
                for key, value in canvas_snapshot.items()
            },
        }
        llm_review = provider.generate_object(
            system_prompt=design_checker_system_prompt(),
            user_prompt=build_design_checker_user_prompt(review_context),
            response_model=DesignReviewPayload,
        )

        combined_payload = DesignReviewPayload(
            overall_assessment=llm_review.overall_assessment,
            issues=self._merge_issues(rule_issues, llm_review.issues),
        )
        artifact = self.artifact_repository.create(
            db,
            project_id=project.id,
            artifact_type=ArtifactType.DESIGN_REVIEW,
            payload=combined_payload.model_dump(),
        )
        return DesignReviewArtifactRead.model_validate(artifact)

    def latest(self, db: Session, project_id: uuid.UUID) -> DesignReviewArtifactRead | None:
        artifact = self.artifact_repository.latest_by_type(
            db,
            project_id=project_id,
            artifact_type=ArtifactType.DESIGN_REVIEW,
        )
        return DesignReviewArtifactRead.model_validate(artifact) if artifact else None

    @staticmethod
    def _merge_issues(rule_issues: list[DesignIssue], llm_issues: list[DesignIssue]) -> list[DesignIssue]:
        merged: list[DesignIssue] = []
        seen: set[tuple[str, str]] = set()

        for issue in [*rule_issues, *llm_issues]:
            key = (issue.issue, issue.affected_module)
            if key in seen:
                continue
            seen.add(key)
            merged.append(issue)

        return merged[:6]
