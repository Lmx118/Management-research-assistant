"use client";

import Link from "next/link";
import { useState } from "react";

import type { PaperLibraryEntry } from "@research-assistant/api-client";
import { ApiError } from "@research-assistant/api-client";

import { apiClient } from "@/lib/api";
import type { Locale } from "@/lib/i18n";

type Copy = {
  empty: string;
  browse: string;
  published: string;
  authors: string;
  summary: string;
  openArticle: string;
  remove: string;
  removing: string;
  removedError: string;
};

const copyByLocale: Record<Locale, Copy> = {
  en: {
    empty: "No papers have been saved yet. Add articles from the homepage digest to start building your library.",
    browse: "Browse latest articles",
    published: "Published",
    authors: "Authors",
    summary: "AI summary",
    openArticle: "Open article",
    remove: "Remove",
    removing: "Removing...",
    removedError: "Unable to remove this paper right now.",
  },
  zh: {
    empty: "\u8fd8\u6ca1\u6709\u5df2\u4fdd\u5b58\u7684\u8bba\u6587\u3002\u53ef\u4ee5\u5148\u5728\u9996\u9875\u7684\u6700\u65b0\u8bba\u6587\u5361\u7247\u4e2d\u5c06\u611f\u5174\u8da3\u7684\u6587\u732e\u52a0\u5165\u8bba\u6587\u5e93\u3002",
    browse: "\u67e5\u770b\u6700\u65b0\u8bba\u6587",
    published: "\u53d1\u8868\u65f6\u95f4",
    authors: "\u4f5c\u8005",
    summary: "AI \u6458\u8981",
    openArticle: "\u6253\u5f00\u8bba\u6587",
    remove: "\u79fb\u51fa",
    removing: "\u79fb\u9664\u4e2d...",
    removedError: "\u5f53\u524d\u65e0\u6cd5\u79fb\u9664\u8fd9\u7bc7\u8bba\u6587\u3002",
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
  initialEntries: PaperLibraryEntry[];
  locale: Locale;
};

export function PaperLibraryList({ initialEntries, locale }: Props) {
  const copy = copyByLocale[locale];
  const [entries, setEntries] = useState<PaperLibraryEntry[]>(initialEntries);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRemove = async (entryId: string) => {
    if (removingId === entryId) {
      return;
    }

    setError(null);
    setRemovingId(entryId);

    try {
      await apiClient.deletePaperLibraryEntry(entryId);
      setEntries((current) => current.filter((entry) => entry.id !== entryId));
    } catch (removeError) {
      setError(removeError instanceof ApiError ? removeError.detail : copy.removedError);
    } finally {
      setRemovingId(null);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="space-y-4">
        {error ? <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-ink">{error}</div> : null}
        <div className="rounded-3xl border border-dashed border-ink/15 bg-white/40 p-5 text-sm leading-6 text-slate">
          <p>{copy.empty}</p>
          <Link className="mt-4 inline-flex button-secondary" href="/">
            {copy.browse}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-ink">{error}</div> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {entries.map((entry) => (
          <article key={entry.id} className="rounded-3xl border border-ink/10 bg-white/80 p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              <span>{entry.journal}</span>
              <span>{formatDate(entry.published_at, locale)}</span>
            </div>
            <h3 className="text-lg font-semibold leading-7 text-ink">
              <a className="hover:text-slate" href={entry.source_url} rel="noreferrer" target="_blank">
                {entry.title}
              </a>
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate">
              <p>
                <span className="font-semibold text-ink">{copy.published}:</span> {formatDate(entry.published_at, locale)}
              </p>
              <p>
                <span className="font-semibold text-ink">{copy.authors}:</span> {renderAuthors(entry.authors)}
              </p>
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate">{copy.summary}</div>
                <p>{entry.ai_summary}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a className="inline-flex text-sm font-semibold text-ink underline decoration-ink/20 underline-offset-4 hover:text-slate" href={entry.source_url} rel="noreferrer" target="_blank">
                {copy.openArticle}
              </a>
              <button
                className="inline-flex items-center justify-center rounded-full border border-rose/25 bg-rose/10 px-5 py-3 text-sm font-semibold text-ink transition hover:border-rose/40 hover:bg-rose/15 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={removingId === entry.id}
                onClick={() => handleRemove(entry.id)}
                type="button"
              >
                {removingId === entry.id ? copy.removing : copy.remove}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
