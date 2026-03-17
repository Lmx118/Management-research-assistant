from app.core.config import Settings
from app.llm.base import LLMProvider
from app.llm.providers.openai_compatible import OpenAICompatibleProvider
from app.llm.providers.stub import StubLLMProvider


def build_llm_provider(settings: Settings) -> LLMProvider:
    if settings.llm_provider == "stub":
        return StubLLMProvider()

    if settings.llm_provider == "openai_compatible":
        if not settings.openai_compatible_api_key:
            raise ValueError("OPENAI_COMPATIBLE_API_KEY is required when LLM_PROVIDER=openai_compatible.")

        return OpenAICompatibleProvider(
            base_url=settings.openai_compatible_base_url,
            api_key=settings.openai_compatible_api_key,
            model=settings.openai_compatible_model,
        )

    raise ValueError(f"Unsupported LLM_PROVIDER: {settings.llm_provider}")

