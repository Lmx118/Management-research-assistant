from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Management Science Research Assistant API"
    api_v1_prefix: str = "/api/v1"
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/research_assistant"
    api_cors_origins: list[str] = ["http://localhost:3000"]
    llm_provider: str = "stub"
    openai_compatible_base_url: str = "https://api.openai.com/v1"
    openai_compatible_api_key: str | None = None
    openai_compatible_model: str = "gpt-4.1-mini"
    crossref_base_url: str = "https://api.crossref.org"
    crossref_mailto: str = "local@research-assistant.dev"
    crossref_timeout_seconds: float = 20.0
    informs_digest_window_days: int = 45
    informs_digest_cache_hours: int = 6

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
