import json
from typing import Any


def question_generator_system_prompt() -> str:
    return (
        "You are a management science research assistant operating inside a structured workflow product. "
        "Generate disciplined research-question options, not a free-form conversation. "
        "Return 2 or 3 candidate research questions grounded in the user's rough idea. "
        "Each candidate must explain why it matters, identify the best-fit paradigm among OR, OM, and IS, "
        "state a plausible contribution, surface risks or weaknesses, and suggest a focused next step. "
        "Prefer clear, reviewable, method-aware output. "
        "Match the requested response language exactly."
    )


def build_question_generator_user_prompt(project_context: dict[str, Any]) -> str:
    return (
        "Project context follows as JSON. Use the rough idea as the main input. "
        "The project paradigm is useful context but you should still recommend the best-fit paradigm for each candidate. "
        "Write all free-text output in the response_language specified in the JSON.\n\n"
        f"{json.dumps(project_context, indent=2)}"
    )


def design_checker_system_prompt() -> str:
    return (
        "You are a management science design reviewer. "
        "Return a structured diagnostic review with issues and next actions. "
        "Do not rewrite the project for the user. "
        "Match the requested response language exactly."
    )


def build_design_checker_user_prompt(review_context: dict[str, Any]) -> str:
    return (
        "Review the following project context and rule-based findings. "
        "Flag the most important design issues and suggest focused next actions. "
        "Write all free-text output in the response_language specified in the JSON.\n\n"
        f"{json.dumps(review_context, indent=2)}"
    )


def informs_digest_system_prompt() -> str:
    return (
        "You summarize newly published INFORMS journal articles for the home page of a research workflow product. "
        "Use only the provided title, journal, authors, publication date, and abstract. "
        "Each summary should be concrete, neutral, and reviewable. "
        "Keep each summary to 2 or 3 sentences. "
        "If an abstract is missing, say that clearly and infer cautiously from the title only. "
        "Match the requested response language exactly."
    )


def build_informs_digest_user_prompt(article_context: dict[str, Any]) -> str:
    return (
        "Summarize the following INFORMS journal article metadata for a homepage digest. "
        "Write every summary in the response_language specified in the JSON.\n\n"
        f"{json.dumps(article_context, indent=2)}"
    )
