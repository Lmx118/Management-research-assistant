import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.artifact import (
    DesignReviewRequest,
    DesignReviewArtifactRead,
    QuestionGenerationArtifactRead,
    ResearchQuestionGenerationRequest,
)
from app.schemas.canvas import (
    ISStudyFrameRead,
    ISStudyFrameUpsert,
    OMModelCanvasRead,
    OMModelCanvasUpsert,
    ORProblemFrameRead,
    ORProblemFrameUpsert,
)
from app.schemas.project import ProjectCreate, ProjectRead
from app.schemas.workspace import ProjectWorkspaceRead
from app.services.canvases import CanvasService
from app.services.design_checker import DesignCheckerService
from app.services.projects import ProjectService
from app.services.research_questions import ResearchQuestionService


router = APIRouter(prefix="/projects", tags=["projects"])

project_service = ProjectService()
canvas_service = CanvasService()
research_question_service = ResearchQuestionService()
design_checker_service = DesignCheckerService()


@router.get("", response_model=list[ProjectRead])
def list_projects(db: Session = Depends(get_db)) -> list[ProjectRead]:
    return [ProjectRead.model_validate(project) for project in project_service.list_projects(db)]


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)) -> ProjectRead:
    project = project_service.create_project(db, payload)
    return ProjectRead.model_validate(project)


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(project_id: uuid.UUID, db: Session = Depends(get_db)) -> ProjectRead:
    project = project_service.get_project(db, project_id)
    return ProjectRead.model_validate(project)


@router.get("/{project_id}/workspace", response_model=ProjectWorkspaceRead)
def get_workspace(project_id: uuid.UUID, db: Session = Depends(get_db)) -> ProjectWorkspaceRead:
    project = ProjectRead.model_validate(project_service.get_project(db, project_id))
    return ProjectWorkspaceRead(
        project=project,
        om_model_canvas=canvas_service.get_om_model_canvas(db, project_id),
        or_problem_frame=canvas_service.get_or_problem_frame(db, project_id),
        is_study_frame=canvas_service.get_is_study_frame(db, project_id),
        latest_question_generation=research_question_service.latest(db, project_id),
        latest_design_review=design_checker_service.latest(db, project_id),
    )


@router.get("/{project_id}/om/model-canvas", response_model=OMModelCanvasRead | None)
def get_om_model_canvas(project_id: uuid.UUID, db: Session = Depends(get_db)) -> OMModelCanvasRead | None:
    project = project_service.get_project(db, project_id)
    if project.paradigm.value != "OM":
        raise HTTPException(status_code=400, detail="OM Model Canvas is only available for OM projects.")
    return canvas_service.get_om_model_canvas(db, project_id)


@router.put("/{project_id}/om/model-canvas", response_model=OMModelCanvasRead)
def save_om_model_canvas(
    project_id: uuid.UUID,
    payload: OMModelCanvasUpsert,
    db: Session = Depends(get_db),
) -> OMModelCanvasRead:
    project = project_service.get_project(db, project_id)
    if project.paradigm.value != "OM":
        raise HTTPException(status_code=400, detail="OM Model Canvas is only available for OM projects.")
    return canvas_service.save_om_model_canvas(db, project_id, payload.payload)


@router.get("/{project_id}/or/problem-frame", response_model=ORProblemFrameRead | None)
def get_or_problem_frame(project_id: uuid.UUID, db: Session = Depends(get_db)) -> ORProblemFrameRead | None:
    project = project_service.get_project(db, project_id)
    if project.paradigm.value != "OR":
        raise HTTPException(status_code=400, detail="OR Problem Frame is only available for OR projects.")
    return canvas_service.get_or_problem_frame(db, project_id)


@router.put("/{project_id}/or/problem-frame", response_model=ORProblemFrameRead)
def save_or_problem_frame(
    project_id: uuid.UUID,
    payload: ORProblemFrameUpsert,
    db: Session = Depends(get_db),
) -> ORProblemFrameRead:
    project = project_service.get_project(db, project_id)
    if project.paradigm.value != "OR":
        raise HTTPException(status_code=400, detail="OR Problem Frame is only available for OR projects.")
    return canvas_service.save_or_problem_frame(db, project_id, payload.payload)


@router.get("/{project_id}/is/study-frame", response_model=ISStudyFrameRead | None)
def get_is_study_frame(project_id: uuid.UUID, db: Session = Depends(get_db)) -> ISStudyFrameRead | None:
    project = project_service.get_project(db, project_id)
    if project.paradigm.value != "IS":
        raise HTTPException(status_code=400, detail="IS Study Frame is only available for IS projects.")
    return canvas_service.get_is_study_frame(db, project_id)


@router.put("/{project_id}/is/study-frame", response_model=ISStudyFrameRead)
def save_is_study_frame(
    project_id: uuid.UUID,
    payload: ISStudyFrameUpsert,
    db: Session = Depends(get_db),
) -> ISStudyFrameRead:
    project = project_service.get_project(db, project_id)
    if project.paradigm.value != "IS":
        raise HTTPException(status_code=400, detail="IS Study Frame is only available for IS projects.")
    return canvas_service.save_is_study_frame(db, project_id, payload.payload)


@router.post(
    "/{project_id}/question-generator",
    response_model=QuestionGenerationArtifactRead,
    status_code=status.HTTP_201_CREATED,
)
def generate_research_questions(
    project_id: uuid.UUID,
    payload: ResearchQuestionGenerationRequest,
    db: Session = Depends(get_db),
) -> QuestionGenerationArtifactRead:
    project = ProjectRead.model_validate(project_service.get_project(db, project_id))
    try:
        return research_question_service.generate(db, project=project, request=payload)
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.post(
    "/{project_id}/design-check",
    response_model=DesignReviewArtifactRead,
    status_code=status.HTTP_201_CREATED,
)
def run_design_check(
    project_id: uuid.UUID,
    payload: DesignReviewRequest,
    db: Session = Depends(get_db),
) -> DesignReviewArtifactRead:
    project = ProjectRead.model_validate(project_service.get_project(db, project_id))
    try:
        return design_checker_service.review(db, project=project, request=payload)
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
