import { ApiError } from "@research-assistant/api-client";

import { Panel } from "@/components/panel";
import { ProjectList } from "@/features/projects/project-list";
import { apiClient } from "@/lib/api";
import { getMessages } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/locale";


export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const locale = await getCurrentLocale();
  const messages = getMessages(locale);

  try {
    const projects = await apiClient.listProjects();

    return (
      <div className="space-y-8">
        <Panel
          eyebrow={messages.projects.eyebrow}
          title={messages.projects.title}
          description={messages.projects.description}
        >
          <ProjectList projects={projects} />
        </Panel>
      </div>
    );
  } catch (error) {
    const message = error instanceof ApiError ? error.detail : messages.projects.loadError;

    return (
      <Panel eyebrow={messages.projects.eyebrow} title={messages.projects.title}>
        <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-ink">{message}</div>
      </Panel>
    );
  }
}
