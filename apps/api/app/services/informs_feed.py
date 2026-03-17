from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from html import unescape
import re
from typing import Any

import httpx

from app.core.config import get_settings
from app.llm.service import build_llm_provider
from app.schemas.feed import (
    InformsArticleDigest,
    InformsArticleSummaryBatch,
    InformsArticleSummaryInput,
    InformsLatestDigestRead,
    ResponseLanguage,
)
from app.workflows.prompts import build_informs_digest_user_prompt, informs_digest_system_prompt


@dataclass
class _CachedDigest:
    expires_at: datetime
    payload: InformsLatestDigestRead


class InformsFeedService:
    _cache: dict[tuple[str, int], _CachedDigest] = {}
    _source_name = "Crossref metadata for latest published INFORMS journal articles"
    _source_url = "https://api.crossref.org/works?filter=prefix:10.1287,type:journal-article&sort=published&order=desc"

    def __init__(self) -> None:
        self.settings = get_settings()

    def get_latest_digest(
        self,
        *,
        response_language: ResponseLanguage = "en",
        limit: int = 6,
        force_refresh: bool = False,
    ) -> InformsLatestDigestRead:
        now = datetime.now(timezone.utc)
        cache_key = (response_language, limit)
        cached = self._cache.get(cache_key)

        if not force_refresh and cached and cached.expires_at > now:
            return cached.payload

        try:
            articles = self._fetch_recent_articles(limit=max(limit * 2, 12))
        except ValueError:
            if cached is not None:
                return cached.payload
            raise

        summaries = self._summarize_articles(articles[:limit], response_language)
        digest = InformsLatestDigestRead(
            source_name=self._source_name,
            source_url=self._source_url,
            refreshed_at=now,
            articles=[
                InformsArticleDigest(
                    title=article.title,
                    journal=article.journal,
                    published_at=article.published_at,
                    authors=article.authors,
                    doi=article.doi,
                    source_url=self._build_article_url(article.doi),
                    ai_summary=summaries.get(article.doi, self._fallback_summary(article, response_language)),
                )
                for article in articles[:limit]
            ],
        )
        self._cache[cache_key] = _CachedDigest(
            expires_at=now + timedelta(hours=self.settings.informs_digest_cache_hours),
            payload=digest,
        )
        return digest

    def _fetch_recent_articles(self, *, limit: int) -> list[InformsArticleSummaryInput]:
        request_errors: list[Exception] = []

        for params in self._query_attempts(limit):
            try:
                items = self._request_crossref_items(params)
            except ValueError as exc:
                request_errors.append(exc)
                continue

            parsed_items = [self._parse_article(item) for item in items]
            articles = sorted(
                [item for item in parsed_items if item is not None],
                key=lambda article: (article.published_at, article.doi),
                reverse=True,
            )

            if articles:
                return articles

        if request_errors:
            raise ValueError("Unable to load the latest INFORMS articles right now.") from request_errors[-1]

        raise ValueError("No recently published INFORMS articles were found.")

    def _query_attempts(self, limit: int) -> list[dict[str, str]]:
        attempts: list[dict[str, str]] = []
        base_filter = ["prefix:10.1287", "type:journal-article"]
        lookback_windows = [120, 365, 3650, None]
        sort_options = ["published-online", "published", "issued"]

        for days in lookback_windows:
            filter_parts = [*base_filter]
            if days is not None:
                filter_parts.append(f"from-pub-date:{(date.today() - timedelta(days=days)).isoformat()}")

            for sort in sort_options:
                attempts.append(
                    {
                        "filter": ",".join(filter_parts),
                        "sort": sort,
                        "order": "desc",
                        "rows": str(limit),
                        "mailto": self.settings.crossref_mailto,
                    }
                )

        return attempts

    def _request_crossref_items(self, params: dict[str, str]) -> list[dict[str, Any]]:
        try:
            response = httpx.get(
                self.settings.crossref_base_url.rstrip("/") + "/works",
                params=params,
                headers={"User-Agent": f"{self.settings.app_name} (mailto:{self.settings.crossref_mailto})"},
                timeout=self.settings.crossref_timeout_seconds,
            )
            response.raise_for_status()
        except httpx.HTTPError as exc:
            raise ValueError("Unable to load the latest INFORMS articles right now.") from exc

        return response.json().get("message", {}).get("items", [])

    def _summarize_articles(
        self,
        articles: list[InformsArticleSummaryInput],
        response_language: ResponseLanguage,
    ) -> dict[str, str]:
        if not articles:
            return {}

        try:
            provider = build_llm_provider(self.settings)
        except ValueError:
            return {article.doi: self._fallback_summary(article, response_language) for article in articles}

        try:
            batch = provider.generate_object(
                system_prompt=informs_digest_system_prompt(),
                user_prompt=build_informs_digest_user_prompt(
                    {
                        "response_language": response_language,
                        "articles": [article.model_dump(mode="json") for article in articles],
                    }
                ),
                response_model=InformsArticleSummaryBatch,
            )
        except Exception:
            return {article.doi: self._fallback_summary(article, response_language) for article in articles}

        summaries = {
            item.doi: item.summary.strip()
            for item in batch.article_summaries
            if item.summary.strip()
        }

        for article in articles:
            summaries.setdefault(article.doi, self._fallback_summary(article, response_language))

        return summaries

    def _parse_article(self, item: dict[str, Any]) -> InformsArticleSummaryInput | None:
        title = self._first_text(item.get("title"))
        journal = self._first_text(item.get("container-title"))
        doi = str(item.get("DOI", "")).strip()

        if not title or not journal or not doi:
            return None

        return InformsArticleSummaryInput(
            doi=doi,
            title=title,
            journal=journal,
            published_at=self._extract_published_at(item),
            authors=self._extract_authors(item.get("author")),
            abstract=self._strip_abstract(item.get("abstract")),
        )

    @staticmethod
    def _build_article_url(doi: str) -> str:
        return f"https://doi.org/{doi}"

    @staticmethod
    def _first_text(value: Any) -> str:
        if isinstance(value, list) and value:
            return str(value[0]).strip()
        if isinstance(value, str):
            return value.strip()
        return ""

    @staticmethod
    def _extract_authors(value: Any) -> list[str]:
        if not isinstance(value, list):
            return []

        authors: list[str] = []
        for author in value:
            if not isinstance(author, dict):
                continue
            given = str(author.get("given", "")).strip()
            family = str(author.get("family", "")).strip()
            full_name = " ".join(part for part in [given, family] if part).strip()
            if full_name:
                authors.append(full_name)
        return authors

    @staticmethod
    def _extract_published_at(item: dict[str, Any]) -> datetime:
        for key in ("published-online", "published-print", "published", "issued", "created"):
            parts = item.get(key, {}).get("date-parts")
            if isinstance(parts, list) and parts and isinstance(parts[0], list):
                date_parts = parts[0]
                year = int(date_parts[0])
                month = int(date_parts[1]) if len(date_parts) > 1 else 1
                day = int(date_parts[2]) if len(date_parts) > 2 else 1
                return datetime(year, month, day, tzinfo=timezone.utc)

        return datetime.now(timezone.utc)

    @staticmethod
    def _strip_abstract(abstract: Any) -> str | None:
        if not isinstance(abstract, str) or not abstract.strip():
            return None

        text = re.sub(r"<[^>]+>", " ", abstract)
        text = unescape(text)
        text = re.sub(r"\s+", " ", text).strip()
        return text[:5000] if text else None

    @staticmethod
    def _first_sentences(text: str, max_sentences: int = 2) -> str:
        pieces = re.split(r"(?<=[.!?])\s+", text)
        cleaned = [piece.strip() for piece in pieces if piece.strip()]
        if not cleaned:
            return text[:320].strip()
        return " ".join(cleaned[:max_sentences])[:420].strip()

    def _fallback_summary(self, article: InformsArticleSummaryInput, response_language: ResponseLanguage) -> str:
        if response_language == "zh":
            if article.abstract:
                return (
                    f"[ZH fallback] This article in {article.journal} studies {article.title}. "
                    "Connect a live LLM provider to generate a true Chinese abstract summary."
                )
            return (
                f"[ZH fallback] This article in {article.journal} appears to study {article.title}. "
                "No abstract text was available for a fuller summary."
            )

        if article.abstract:
            return self._first_sentences(article.abstract)

        return (
            f"This article in {article.journal} appears to study {article.title}. "
            "A full abstract-based summary is not available yet."
        )
