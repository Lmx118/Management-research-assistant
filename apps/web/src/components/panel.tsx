import type { ReactNode } from "react";

import { cn } from "@/lib/utils";


type PanelProps = {
  title?: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, eyebrow, description, children, className }: PanelProps) {
  return (
    <section className={cn("app-panel p-6", className)}>
      {(eyebrow || title || description) && (
        <div className="mb-5 space-y-2">
          {eyebrow ? <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">{eyebrow}</div> : null}
          {title ? <h2 className="text-2xl font-semibold text-ink">{title}</h2> : null}
          {description ? <p className="max-w-2xl text-sm leading-6 text-slate">{description}</p> : null}
        </div>
      )}
      {children}
    </section>
  );
}

