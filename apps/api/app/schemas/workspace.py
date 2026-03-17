from pydantic import BaseModel

from app.schemas.artifact import DesignReviewArtifactRead, QuestionGenerationArtifactRead
from app.schemas.canvas import ISStudyFrameRead, OMModelCanvasRead, ORProblemFrameRead
from app.schemas.project import ProjectRead


class ProjectWorkspaceRead(BaseModel):
    project: ProjectRead
    om_model_canvas: OMModelCanvasRead | None = None
    or_problem_frame: ORProblemFrameRead | None = None
    is_study_frame: ISStudyFrameRead | None = None
    latest_question_generation: QuestionGenerationArtifactRead | None = None
    latest_design_review: DesignReviewArtifactRead | None = None
