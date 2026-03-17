from app.llm.providers.stub import StubLLMProvider
from app.schemas.artifact import ResearchQuestionGenerationPayload


def test_stub_question_generator_returns_structured_payload() -> None:
    provider = StubLLMProvider()

    payload = provider.generate_object(
        system_prompt="",
        user_prompt='{"project": {"paradigm": "IS"}, "idea": "A platform policy change affects seller outcomes."}',
        response_model=ResearchQuestionGenerationPayload,
    )

    assert payload.input_interpretation
    assert len(payload.candidate_research_questions) >= 1
    assert payload.candidate_research_questions[0].best_fit_paradigm.paradigm == "IS"
