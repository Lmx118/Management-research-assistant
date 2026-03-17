import Link from "next/link";

import { Panel } from "@/components/panel";
import { InformsDigestSection } from "@/features/home/informs-digest-section";
import { getMessages } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/locale";

const paradigms = ["OM", "OR", "IS"] as const;

export default async function HomePage() {
  const locale = await getCurrentLocale();
  const messages = getMessages(locale);

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate">{messages.home.eyebrow}</div>
          <h1 className="max-w-4xl font-[family:var(--font-serif)] text-5xl leading-tight text-ink lg:text-6xl">
            {messages.home.title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate">
            {messages.home.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects/new" className="button-primary">
              {messages.home.startWorkspace}
            </Link>
            <Link href="/projects" className="button-secondary">
              {messages.home.viewProjects}
            </Link>
          </div>
        </div>

        <Panel
          eyebrow={messages.home.initialModulesEyebrow}
          title={messages.home.initialModulesTitle}
          description={messages.home.initialModulesDescription}
        >
          <div className="grid gap-3 text-sm text-slate">
            {messages.home.initialModules.map((item) => (
              <div key={item} className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-3">
                {item}
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {paradigms.map((paradigm) => (
          <Panel key={paradigm} eyebrow={paradigm} title={messages.home.paradigms[paradigm].title}>
            <p className="text-sm leading-6 text-slate">{messages.home.paradigms[paradigm].description}</p>
          </Panel>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Panel
          eyebrow={messages.home.workflowEyebrow}
          title={messages.home.workflowTitle}
          description={messages.home.workflowDescription}
        >
          <div className="grid gap-3 text-sm text-slate">
            {messages.home.workflowCards.map((item, index) => {
              const styles = [
                "border-brass/25 bg-brass/10",
                "border-moss/25 bg-moss/10",
                "border-ink/10 bg-white/70",
                "border-rose/25 bg-rose/10",
              ];

              return (
                <div key={item} className={`rounded-2xl border px-4 py-3 ${styles[index]}`}>
                  {item}
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel
          eyebrow={messages.home.guardrailEyebrow}
          title={messages.home.guardrailTitle}
          description={messages.home.guardrailDescription}
        >
          <div className="space-y-4 text-sm leading-6 text-slate">
            {messages.home.guardrailPoints.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </Panel>
      </section>

      <InformsDigestSection locale={locale} />
    </div>
  );
}
