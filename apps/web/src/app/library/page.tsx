import { ApiError } from "@research-assistant/api-client";

import { Panel } from "@/components/panel";
import { PaperLibraryList } from "@/features/library/paper-library-list";
import { apiClient } from "@/lib/api";
import { getCurrentLocale } from "@/lib/locale";

const copyByLocale = {
  en: {
    eyebrow: "Saved papers",
    title: "Your paper library",
    description:
      "Articles you save from the literature watch appear here with their metadata and AI summary, so you can build a focused reading queue.",
    error: "Unable to load the paper library right now.",
  },
  zh: {
    eyebrow: "\u5df2\u4fdd\u5b58\u8bba\u6587",
    title: "\u4f60\u7684\u8bba\u6587\u5e93",
    description:
      "\u4f60\u4ece\u6587\u732e\u89c2\u5bdf\u4e2d\u4fdd\u5b58\u7684\u8bba\u6587\u4f1a\u5728\u8fd9\u91cc\u7edf\u4e00\u5c55\u793a\u3002\u6bcf\u6761\u8bb0\u5f55\u4fdd\u7559\u5143\u6570\u636e\u548c AI \u6458\u8981\uff0c\u4fbf\u4e8e\u5f62\u6210\u81ea\u5df1\u7684\u9605\u8bfb\u5e93\u3002",
    error: "\u5f53\u524d\u65e0\u6cd5\u52a0\u8f7d\u8bba\u6587\u5e93\u3002",
  },
} as const;

export default async function LibraryPage() {
  const locale = await getCurrentLocale();
  const copy = copyByLocale[locale];

  try {
    const entries = await apiClient.listPaperLibraryEntries();

    return (
      <Panel eyebrow={copy.eyebrow} title={copy.title} description={copy.description}>
        <PaperLibraryList initialEntries={entries} locale={locale} />
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
