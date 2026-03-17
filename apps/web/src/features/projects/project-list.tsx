"use client";

import Link from "next/link";

import type { Project } from "@research-assistant/api-client";

import { useI18n } from "@/components/locale-provider";
import { ParadigmBadge } from "@/components/paradigm-badge";


export function ProjectList({ projects }: { projects: Project[] }) {
  const { messages } = useI18n();

  if (projects.length === 0) {
    return (
      <div className="app-panel flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-xl font-semibold text-ink">{messages.projects.emptyTitle}</div>
        <p className="max-w-md text-sm leading-6 text-slate">
          {messages.projects.emptyDescription}
        </p>
        <Link href="/projects/new" className="button-primary">
          {messages.projects.createWorkspace}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="app-panel space-y-4 p-6 transition hover:-translate-y-0.5 hover:border-ink/15 hover:bg-white"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xl font-semibold text-ink">{project.title}</div>
              <div className="mt-1 text-sm text-slate">{project.domain}</div>
            </div>
            <ParadigmBadge paradigm={project.paradigm} />
          </div>
          <p className="text-sm leading-6 text-slate">{project.problem_statement}</p>
        </Link>
      ))}
    </div>
  );
}
