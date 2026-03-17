import Link from "next/link";

import type { ProjectWorkspace } from "@research-assistant/api-client";
import { ApiError } from "@research-assistant/api-client";

import { Panel } from "@/components/panel";
import { ParadigmBadge } from "@/components/paradigm-badge";
import { StatusPill } from "@/components/status-pill";
import { DesignCheckerPanel } from "@/features/workspace/design-checker-panel";
import { ResearchQuestionPanel } from "@/features/workspace/research-question-panel";
import { apiClient } from "@/lib/api";
import { getMessages } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/locale";


export const dynamic = "force-dynamic";

type ModuleCard = {
  title: string;
  description: string;
  href: string;
  status: "ready" | "partial" | "empty";
  label: string;
};

const buildPrimaryModule = (workspace: ProjectWorkspace, messages: ReturnType<typeof getMessages>): ModuleCard => {
  switch (workspace.project.paradigm) {
    case "OM":
      return {
        title: messages.workspace.modules.modelCanvas.title,
        description: messages.workspace.modules.modelCanvas.description,
        href: `/projects/${workspace.project.id}/om/model-canvas`,
        status: workspace.om_model_canvas ? "ready" : "empty",
        label: workspace.om_model_canvas ? messages.workspace.modules.modelCanvas.started : messages.workspace.modules.modelCanvas.start,
      };
    case "OR":
      return {
        title: messages.workspace.modules.problemFrame.title,
        description: messages.workspace.modules.problemFrame.description,
        href: `/projects/${workspace.project.id}/or/problem-frame`,
        status: workspace.or_problem_frame ? "partial" : "empty",
        label: workspace.or_problem_frame ? messages.workspace.modules.problemFrame.started : messages.workspace.modules.problemFrame.start,
      };
    case "IS":
      return {
        title: messages.workspace.modules.studyFrame.title,
        description: messages.workspace.modules.studyFrame.description,
        href: `/projects/${workspace.project.id}/is/study-frame`,
        status: workspace.is_study_frame ? "partial" : "empty",
        label: workspace.is_study_frame ? messages.workspace.modules.studyFrame.started : messages.workspace.modules.studyFrame.start,
      };
  }
};

type PageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function WorkspacePage({ params }: PageProps) {
  const { projectId } = await params;
  const locale = await getCurrentLocale();
  const messages = getMessages(locale);

  try {
    const workspace = await apiClient.getWorkspace(projectId);
    const primaryModule = buildPrimaryModule(workspace, messages);
    const moduleCards: ModuleCard[] = [
      primaryModule,
      {
        title: messages.workspace.modules.questionGenerator.title,
        description: messages.workspace.modules.questionGenerator.description,
        href: `/projects/${workspace.project.id}/questions`,
        status: workspace.latest_question_generation ? "ready" : "empty",
        label: workspace.latest_question_generation ? messages.workspace.modules.questionGenerator.saved : messages.workspace.modules.questionGenerator.ready,
      },
      {
        title: messages.workspace.modules.designChecker.title,
        description: messages.workspace.modules.designChecker.description,
        href: "#design-check",
        status: workspace.latest_design_review ? "ready" : "empty",
        label: workspace.latest_design_review ? messages.workspace.modules.designChecker.saved : messages.workspace.modules.designChecker.ready,
      },
    ];

    return (
      <div className="space-y-8">
        <Panel className="overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <ParadigmBadge paradigm={workspace.project.paradigm} />
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">{messages.workspace.persistentContext}</div>
              </div>
              <div>
                <h1 className="font-[family:var(--font-serif)] text-4xl leading-tight text-ink">{workspace.project.title}</h1>
                <p className="mt-2 text-lg text-slate">{workspace.project.domain}</p>
              </div>
              <p className="max-w-3xl text-sm leading-7 text-slate">{workspace.project.problem_statement}</p>
              {workspace.project.notes ? (
                <div className="rounded-3xl border border-ink/10 bg-white/70 p-4 text-sm leading-6 text-slate">
                  <div className="label">{messages.workspace.notes}</div>
                  {workspace.project.notes}
                </div>
              ) : null}
            </div>

            <div className="rounded-[2rem] bg-ink px-6 py-7 text-cloud">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cloud/60">{messages.workspace.orientationTitle}</div>
              <div className="mt-4 space-y-4 text-sm leading-6 text-cloud/80">
                {messages.workspace.orientationPoints.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <div className="grid gap-4 lg:grid-cols-3">
          {moduleCards.map((card) => (
            <Link key={card.title} href={card.href} className="app-panel flex flex-col gap-4 p-6 transition hover:-translate-y-0.5 hover:bg-white">
              <div className="flex items-center justify-between gap-3">
                <div className="text-lg font-semibold text-ink">{card.title}</div>
                <StatusPill tone={card.status} label={card.label} />
              </div>
              <p className="text-sm leading-6 text-slate">{card.description}</p>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Panel
            eyebrow={messages.common.sharedModule}
            title={messages.workspace.questionPanelTitle}
            description={messages.workspace.questionPanelDescription}
            className="scroll-mt-24"
          >
            <div id="question-generator">
              <ResearchQuestionPanel
                projectId={workspace.project.id}
                initialArtifact={workspace.latest_question_generation}
              />
            </div>
          </Panel>

          <Panel
            eyebrow={messages.common.sharedModule}
            title={messages.workspace.designPanelTitle}
            description={messages.workspace.designPanelDescription}
            className="scroll-mt-24"
          >
            <div id="design-check">
              <DesignCheckerPanel projectId={workspace.project.id} initialArtifact={workspace.latest_design_review} />
            </div>
          </Panel>
        </div>
      </div>
    );
  } catch (error) {
    const message = error instanceof ApiError ? error.detail : messages.workspace.loadError;

    return (
      <Panel eyebrow={messages.workspace.errorEyebrow} title={messages.workspace.errorTitle}>
        <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-ink">{message}</div>
      </Panel>
    );
  }
}
