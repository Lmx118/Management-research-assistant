from enum import Enum


class Paradigm(str, Enum):
    OM = "OM"
    OR = "OR"
    IS = "IS"


class CanvasKind(str, Enum):
    OM_MODEL_CANVAS = "om_model_canvas"
    OR_PROBLEM_FRAME = "or_problem_frame"
    IS_STUDY_FRAME = "is_study_frame"


class ArtifactType(str, Enum):
    RESEARCH_QUESTION_GENERATION = "research_question_generation"
    DESIGN_REVIEW = "design_review"

