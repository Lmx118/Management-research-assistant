"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/components/locale-provider";
import { LOCALE_COOKIE_NAME, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";


const localeOptions: Locale[] = ["en", "zh"];

export function LanguageSwitcher() {
  const router = useRouter();
  const { locale, messages } = useI18n();

  const setLocale = (nextLocale: Locale) => {
    document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 p-1">
      <span className="px-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate">
        {messages.nav.language}
      </span>
      {localeOptions.map((option) => {
        const selected = option === locale;
        const label = option === "en" ? messages.nav.english : messages.nav.chinese;

        return (
          <button
            key={option}
            type="button"
            onClick={() => setLocale(option)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition",
              selected ? "bg-ink text-cloud" : "text-slate hover:bg-cloud hover:text-ink",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
