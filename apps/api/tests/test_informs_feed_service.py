from datetime import datetime, timezone

from app.services.informs_feed import InformsFeedService
from app.schemas.feed import InformsArticleSummaryInput


def test_strip_abstract_removes_tags_and_entities() -> None:
    service = InformsFeedService()

    cleaned = service._strip_abstract("<jats:p>Test &amp; validate the model.</jats:p>")

    assert cleaned == "Test & validate the model."


def test_parse_article_extracts_core_fields() -> None:
    service = InformsFeedService()

    article = service._parse_article(
        {
            "DOI": "10.1287/mnsc.2026.0001",
            "title": ["Platform disclosure timing and rival response"],
            "container-title": ["Management Science"],
            "author": [
                {"given": "Jane", "family": "Doe"},
                {"given": "John", "family": "Smith"},
            ],
            "published-online": {"date-parts": [[2026, 3, 12]]},
            "abstract": "<jats:p>We study how disclosure timing shapes rival response.</jats:p>",
        }
    )

    assert article is not None
    assert article.title == "Platform disclosure timing and rival response"
    assert article.journal == "Management Science"
    assert article.authors == ["Jane Doe", "John Smith"]
    assert article.doi == "10.1287/mnsc.2026.0001"
    assert article.published_at == datetime(2026, 3, 12, tzinfo=timezone.utc)
    assert article.abstract == "We study how disclosure timing shapes rival response."


def test_force_refresh_bypasses_cache(monkeypatch) -> None:
    service = InformsFeedService()
    service._cache.clear()
    calls = {"count": 0}

    def fake_fetch_recent_articles(*, limit: int) -> list[InformsArticleSummaryInput]:
        calls["count"] += 1
        return [
            InformsArticleSummaryInput(
                doi=f"10.1287/test.{calls['count']}",
                title=f"Test article {calls['count']}",
                journal="Management Science",
                published_at=datetime(2026, 3, 12, tzinfo=timezone.utc),
                authors=["Jane Doe"],
                abstract="We study a test phenomenon.",
            )
        ]

    monkeypatch.setattr(service, "_fetch_recent_articles", fake_fetch_recent_articles)
    monkeypatch.setattr(
        service,
        "_summarize_articles",
        lambda articles, response_language: {article.doi: "Summary" for article in articles},
    )

    first = service.get_latest_digest(response_language="en", limit=1)
    second = service.get_latest_digest(response_language="en", limit=1)
    refreshed = service.get_latest_digest(response_language="en", limit=1, force_refresh=True)

    assert calls["count"] == 2
    assert first.articles[0].doi == second.articles[0].doi
    assert refreshed.articles[0].doi != first.articles[0].doi


def test_fetch_recent_articles_sorts_by_published_date_desc(monkeypatch) -> None:
    service = InformsFeedService()

    class DummyResponse:
        def raise_for_status(self) -> None:
            return None

        def json(self) -> dict:
            return {
                "message": {
                    "items": [
                        {
                            "DOI": "10.1287/test.older",
                            "title": ["Older article"],
                            "container-title": ["Management Science"],
                            "published-online": {"date-parts": [[2024, 1, 10]]},
                        },
                        {
                            "DOI": "10.1287/test.newer",
                            "title": ["Newer article"],
                            "container-title": ["Management Science"],
                            "published-online": {"date-parts": [[2025, 11, 2]]},
                        },
                    ]
                }
            }

    monkeypatch.setattr("app.services.informs_feed.httpx.get", lambda *args, **kwargs: DummyResponse())

    articles = service._fetch_recent_articles(limit=2)

    assert [article.doi for article in articles] == ["10.1287/test.newer", "10.1287/test.older"]


def test_query_attempts_include_published_fallbacks() -> None:
    service = InformsFeedService()

    attempts = service._query_attempts(limit=4)

    assert attempts[0]["sort"] == "published-online"
    assert attempts[1]["sort"] == "published"
    assert attempts[2]["sort"] == "issued"
    assert attempts[0]["rows"] == "4"


def test_get_latest_digest_returns_cached_payload_when_refresh_fails(monkeypatch) -> None:
    service = InformsFeedService()
    service._cache.clear()

    monkeypatch.setattr(
        service,
        "_fetch_recent_articles",
        lambda **kwargs: [
            InformsArticleSummaryInput(
                doi="10.1287/test.cached",
                title="Cached article",
                journal="Management Science",
                published_at=datetime(2026, 3, 1, tzinfo=timezone.utc),
                authors=["Jane Doe"],
                abstract="We study a cached phenomenon.",
            )
        ],
    )
    monkeypatch.setattr(
        service,
        "_summarize_articles",
        lambda articles, response_language: {article.doi: "Summary" for article in articles},
    )

    cached = service.get_latest_digest(response_language="en", limit=1)

    monkeypatch.setattr(
        service,
        "_fetch_recent_articles",
        lambda **kwargs: (_ for _ in ()).throw(ValueError("fetch failed")),
    )

    recovered = service.get_latest_digest(response_language="en", limit=1, force_refresh=True)

    assert recovered.articles[0].doi == cached.articles[0].doi
