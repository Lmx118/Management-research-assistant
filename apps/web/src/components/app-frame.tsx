import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { getMessages, type Locale } from "@/lib/i18n";


export function AppFrame({ children, locale }: { children: ReactNode; locale: Locale }) {
  const messages = getMessages(locale);
  const libraryLabel = locale === "zh" ? "\u8bba\u6587\u5e93" : "Library";

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-cloud/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="space-y-1">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate">
              {messages.nav.discipline}
            </div>
            <div className="text-xl font-semibold text-ink">{messages.nav.product}</div>
          </Link>
          <nav className="flex items-center gap-3 text-sm text-slate">
            <LanguageSwitcher />
            <Link className="rounded-full px-4 py-2 hover:bg-white/70 hover:text-ink" href="/library">
              {libraryLabel}
            </Link>
            <Link className="rounded-full px-4 py-2 hover:bg-white/70 hover:text-ink" href="/projects">
              {messages.nav.projects}
            </Link>
            <Link className="button-primary" href="/projects/new">
              {messages.nav.newWorkspace}
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">{children}</main>
    </div>
  );
}
