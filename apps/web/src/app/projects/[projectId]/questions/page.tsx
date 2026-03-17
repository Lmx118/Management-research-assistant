import Link from "next/link";

import { ApiError } from "@research-assistant/api-client";

import { Panel } from "@/components/panel";
import { ParadigmBadge } from "@/components/paradigm-badge";
import { ResearchQuestionPanel } from "@/features/workspace/research-question-panel";
import { apiClient } from "@/lib/api";
import { getMessages } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/locale";


export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ResearchQuestionsPage({ params }: PageProps) {
  const { projectId } = await params;
  const locale = await getCurrentLocale();
  const messages = getMessages(locale);

  try {
    const workspace = await apiClient.getWorkspace(projectId);

    return (
      <div className="space-y-8">
        <Panel
          eyebrow={messages.questionsPage.eyebrow}
          title={messages.questionsPage.title}
          description={messages.questionsPage.description}
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

          <div className="mb-6 rounded-3xl border border-ink/10 bg-white/70 p-5 text-sm leading-6 text-slate">
            {messages.questionsPage.helper}
          </div>

          <ResearchQuestionPanel
            projectId={workspace.project.id}
            initialArtifact={workspace.latest_question_generation}
          />
        </Panel>
      </div>
    );
  } catch (error) {
    const message = error instanceof ApiError ? error.detail : messages.questionsPage.loadError;

    return (
      <Panel eyebrow={messages.questionsPage.errorEyebrow} title={messages.questionsPage.title}>
        <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-ink">{message}</div>
      </Panel>
    );
  }
}
