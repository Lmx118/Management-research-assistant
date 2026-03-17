import Link from "next/link";

import { ApiError } from "@research-assistant/api-client";

import { Panel } from "@/components/panel";
import { ParadigmBadge } from "@/components/paradigm-badge";
import { ProblemFrameForm } from "@/features/workspace/problem-frame-form";
import { apiClient } from "@/lib/api";
import { getMessages } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/locale";


export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProblemFramePage({ params }: PageProps) {
  const { projectId } = await params;
  const locale = await getCurrentLocale();
  const messages = getMessages(locale);

  try {
    const workspace = await apiClient.getWorkspace(projectId);

    if (workspace.project.paradigm !== "OR") {
      return (
        <Panel eyebrow={messages.common.moduleMismatch} title={messages.problemFramePage.title}>
          <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-ink">
            {messages.problemFramePage.notMatching}
          </div>
        </Panel>
      );
    }

    return (
      <div className="space-y-8">
        <Panel
          eyebrow={messages.common.paradigmStub}
          title={messages.problemFramePage.title}
          description={messages.problemFramePage.description}
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ParadigmBadge paradigm={workspace.project.paradigm} />
              <div className="text-sm text-slate">{workspace.project.title}</div>
            </div>
            <Link className="button-secondary" href={`/projects/${workspace.project.id}`}>
              {messages.common.backToWorkspace}
            </Link>
          </div>
          <ProblemFrameForm projectId={workspace.project.id} initialPayload={workspace.or_problem_frame?.payload} />
        </Panel>
      </div>
    );
  } catch (error) {
    const message = error instanceof ApiError ? error.detail : messages.problemFramePage.loadError;

    return (
      <Panel eyebrow={messages.problemFramePage.errorEyebrow} title={messages.problemFramePage.title}>
        <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-ink">{message}</div>
      </Panel>
    );
  }
}
