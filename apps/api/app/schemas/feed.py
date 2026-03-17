from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, HttpUrl


class InformsArticleDigest(BaseModel):
    title: str = Field(max_length=1000)
    journal: str = Field(max_length=500)
    published_at: datetime
    authors: list[str] = Field(default_factory=list)
    doi: str = Field(max_length=200)
    source_url: HttpUrl
    ai_summary: str = Field(max_length=2000)


class InformsLatestDigestRead(BaseModel):
    source_name: str = Field(max_length=200)
    source_url: HttpUrl
    refreshed_at: datetime
    articles: list[InformsArticleDigest] = Field(default_factory=list)


class InformsArticleSummaryInput(BaseModel):
    doi: str = Field(max_length=200)
    title: str = Field(max_length=1000)
    journal: str = Field(max_length=500)
    published_at: datetime
    authors: list[str] = Field(default_factory=list)
    abstract: str | None = Field(default=None, max_length=6000)


class InformsArticleSummary(BaseModel):
    doi: str = Field(max_length=200)
    summary: str = Field(max_length=2000)


class InformsArticleSummaryBatch(BaseModel):
    article_summaries: list[InformsArticleSummary] = Field(default_factory=list)


ResponseLanguage = Literal["en", "zh"]
