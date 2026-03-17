"use client";

import Link from "next/link";
import { useState } from "react";

import type { InformsArticleDigest, InformsLatestDigest, PaperLibraryEntry } from "@research-assistant/api-client";
import { ApiError } from "@research-assistant/api-client";

import { apiClient } from "@/lib/api";
import type { Locale } from "@/lib/i18n";

type Copy = {
  refreshed: string;
  source: string;
  published: string;
  authors: string;
  summary: string;
  viewArticle: string;
  openLibrary: string;
  refresh: string;
  refreshing: string;
  addToLibrary: string;
  saving: string;
  saved: string;
  empty: string;
  saveError: string;
  refreshError: string;
};

const copyByLocale: Record<Locale, Copy> = {
  en: {
    refreshed: "Refreshed",
    source: "Source",
    published: "Published",
    authors: "Authors",
    summary: "AI summary",
    viewArticle: "Open article",
    openLibrary: "Open library",
    refresh: "Refresh feed",
    refreshing: "Refreshing...",
    addToLibrary: "Add to library",
    saving: "Saving...",
    saved: "Saved",
    empty: "No recent INFORMS articles were returned for the current window.",
    saveError: "Unable to save this paper right now.",
    refreshError: "Unable to refresh the latest articles right now.",
  },
  zh: {
    refreshed: "\u5237\u65b0\u65f6\u95f4",
    source: "\u6570\u636e\u6765\u6e90",
    published: "\u53d1\u8868\u65f6\u95f4",
    authors: "\u4f5c\u8005",
    summary: "AI \u6458\u8981",
    viewArticle: "\u6253\u5f00\u8bba\u6587",
    openLibrary: "\u67e5\u770b\u8bba\u6587\u5e93",
    refresh: "\u5237\u65b0\u6587\u732e",
    refreshing: "\u5237\u65b0\u4e2d...",
    addToLibrary: "\u52a0\u5165\u8bba\u6587\u5e93",
    saving: "\u4fdd\u5b58\u4e2d...",
    saved: "\u5df2\u4fdd\u5b58",
    empty: "\u5f53\u524d\u65f6\u95f4\u7a97\u53e3\u5185\u6ca1\u6709\u8fd4\u56de\u6700\u65b0 INFORMS \u8bba\u6587\u3002",
    saveError: "\u5f53\u524d\u65e0\u6cd5\u4fdd\u5b58\u8fd9\u7bc7\u8bba\u6587\u3002",
    refreshError: "\u5f53\u524d\u65e0\u6cd5\u5237\u65b0\u6700\u65b0\u6587\u732e\u3002",
  },
};

function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function renderAuthors(authors: string[]): string {
  if (authors.length <= 4) {
    return authors.join(", ");
  }

  return `${authors.slice(0, 4).join(", ")} et al.`;
}

type Props = {
  digest: InformsLatestDigest;
  initialLibraryEntries: PaperLibraryEntry[];
  locale: Locale;
};

export function InformsDigestCards({ digest, initialLibraryEntries, locale }: Props) {
  const copy = copyByLocale[locale];
  const [currentDigest, setCurrentDigest] = useState<InformsLatestDigest>(digest);
  const [libraryEntries, setLibraryEntries] = useState<PaperLibraryEntry[]>(initialLibraryEntries);
  const [savingDoi, setSavingDoi] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savedDois = new Set(libraryEntries.map((entry) => entry.doi));

  const handleSave = async (article: InformsArticleDigest) => {
    if (savedDois.has(article.doi) || savingDoi === article.doi) {
      return;
    }

    setError(null);
    setSavingDoi(article.doi);

    try {
      const savedEntry = await apiClient.savePaperLibraryEntry({
        doi: article.doi,
        title: article.title,
        journal: article.journal,
        source_url: article.source_url,
        ai_summary: article.ai_summary,
        authors: article.authors,
        published_at: article.published_at,
      });

      setLibraryEntries((current) => {
        const existingIndex = current.findIndex((entry) => entry.doi === savedEntry.doi);

        if (existingIndex >= 0) {
          return current.map((entry, index) => (index === existingIndex ? savedEntry : entry));
        }

        return [savedEntry, ...current];
      });
    } catch (saveError) {
      setError(saveError instanceof ApiError ? saveError.detail : copy.saveError);
    } finally {
      setSavingDoi(null);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) {
      return;
    }

    setError(null);
    setIsRefreshing(true);

    try {
      const refreshed = await apiClient.getInformsLatestDigest({
        response_language: locale,
        limit: currentDigest.articles.length || 6,
        force_refresh: true,
      });
      setCurrentDigest(refreshed);
    } catch (refreshError) {
      setError(refreshError instanceof ApiError ? refreshError.detail : copy.refreshError);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (currentDigest.articles.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-ink/15 bg-white/40 p-5 text-sm leading-6 text-slate">
        {copy.empty}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-ink/10 bg-white/70 px-5 py-4 text-sm text-slate">
        <div>
          <span className="font-semibold text-ink">{copy.refreshed}:</span> {formatDate(currentDigest.refreshed_at, locale)}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="button-secondary" disabled={isRefreshing} onClick={handleRefresh} type="button">
            {isRefreshing ? copy.refreshing : copy.refresh}
          </button>
          <a className="underline decoration-ink/20 underline-offset-4 hover:text-ink" href={currentDigest.source_url} rel="noreferrer" target="_blank">
            <span className="font-semibold text-ink">{copy.source}:</span> {currentDigest.source_name}
          </a>
          <Link className="button-secondary" href="/library">
            {copy.openLibrary}
          </Link>
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-ink">{error}</div> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {currentDigest.articles.map((article) => {
          const isSaved = savedDois.has(article.doi);
          const isSaving = savingDoi === article.doi;

          return (
            <article key={article.doi} className="rounded-3xl border border-ink/10 bg-white/80 p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                <span>{article.journal}</span>
                <span>{formatDate(article.published_at, locale)}</span>
              </div>
              <h3 className="text-lg font-semibold leading-7 text-ink">
                <a className="hover:text-slate" href={article.source_url} rel="noreferrer" target="_blank">
                  {article.title}
                </a>
              </h3>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate">
                <p>
                  <span className="font-semibold text-ink">{copy.published}:</span> {formatDate(article.published_at, locale)}
                </p>
                <p>
                  <span className="font-semibold text-ink">{copy.authors}:</span> {renderAuthors(article.authors)}
                </p>
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate">{copy.summary}</div>
                  <p>{article.ai_summary}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a className="inline-flex text-sm font-semibold text-ink underline decoration-ink/20 underline-offset-4 hover:text-slate" href={article.source_url} rel="noreferrer" target="_blank">
                  {copy.viewArticle}
                </a>
                <button
                  className={isSaved ? "button-secondary" : "button-primary"}
                  disabled={isSaved || isSaving}
                  onClick={() => handleSave(article)}
                  type="button"
                >
                  {isSaving ? copy.saving : isSaved ? copy.saved : copy.addToLibrary}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
