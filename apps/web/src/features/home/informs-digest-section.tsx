import { ApiError, type PaperLibraryEntry } from "@research-assistant/api-client";

import { Panel } from "@/components/panel";
import { InformsDigestCards } from "@/features/home/informs-digest-cards";
import { apiClient } from "@/lib/api";
import type { Locale } from "@/lib/i18n";

type Copy = {
  eyebrow: string;
  title: string;
  description: string;
  error: string;
};

const copyByLocale: Record<Locale, Copy> = {
  en: {
    eyebrow: "Daily literature watch",
    title: "Latest INFORMS journal articles",
    description:
      "Pulled from the latest published INFORMS journal articles. Each card shows publication metadata, an AI-generated abstract summary, and a direct save action into your paper library.",
    error: "Unable to load the latest INFORMS articles right now.",
  },
  zh: {
    eyebrow: "\u6bcf\u65e5\u6587\u732e\u89c2\u5bdf",
    title: "\u6700\u65b0 INFORMS \u671f\u520a\u8bba\u6587",
    description:
      "\u8fd9\u4e2a\u6a21\u5757\u76f4\u63a5\u62c9\u53d6 INFORMS \u671f\u520a\u4e2d\u6700\u65b0\u53d1\u8868\u7684\u8bba\u6587\u3002\u6bcf\u5f20\u5361\u7247\u5c55\u793a\u53d1\u8868\u4fe1\u606f\u3001AI \u6458\u8981\u548c\u4e00\u952e\u4fdd\u5b58\u5230\u8bba\u6587\u5e93\u7684\u5165\u53e3\u3002",
    error: "\u5f53\u524d\u65e0\u6cd5\u52a0\u8f7d\u6700\u65b0 INFORMS \u8bba\u6587\u3002",
  },
};

export async function InformsDigestSection({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale];

  try {
    const digest = await apiClient.getInformsLatestDigest({
      response_language: locale,
      limit: 6,
    });

    let initialLibraryEntries: PaperLibraryEntry[] = [];

    try {
      initialLibraryEntries = await apiClient.listPaperLibraryEntries();
    } catch {
      initialLibraryEntries = [];
    }

    return (
      <Panel eyebrow={copy.eyebrow} title={copy.title} description={copy.description}>
        <InformsDigestCards digest={digest} initialLibraryEntries={initialLibraryEntries} locale={locale} />
      </Panel>
    );
  } catch (error) {
    const message = error instanceof ApiError ? error.detail : copy.error;

    return (
      <Panel eyebrow={copy.eyebrow} title={copy.title} description={copy.description}>
        <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-ink">{message}</div>
      </Panel>
    );
  }
}
