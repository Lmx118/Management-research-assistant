from datetime import UTC, datetime
from uuid import uuid4

from app.models.enums import CanvasKind, Paradigm
from app.schemas.canvas import OMModelCanvasPayload, OMModelCanvasRead
from app.schemas.project import ProjectRead
from app.services.design_checker import collect_rule_based_issues


def test_collect_rule_based_issues_flags_missing_core_om_fields() -> None:
    project = ProjectRead(
        id=uuid4(),
        title="Dynamic pricing and disclosure",
        paradigm=Paradigm.OM,
        domain="Platform strategy",
        problem_statement="How disclosure timing shapes strategic pricing incentives in repeated competition.",
        notes=None,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    canvas = OMModelCanvasRead(
        project_id=project.id,
        canvas_kind=CanvasKind.OM_MODEL_CANVAS,
        version=1,
        payload=OMModelCanvasPayload(),
        updated_at=datetime.now(UTC),
    )

    issues = collect_rule_based_issues(project, {"om_model_canvas": canvas})

    assert any(issue.severity == "high" for issue in issues)
    assert any("propositions" in issue.issue.lower() for issue in issues)
