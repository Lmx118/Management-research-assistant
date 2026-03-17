import { Panel } from "@/components/panel";
import { ProjectCreateForm } from "@/features/projects/project-create-form";
import { getMessages } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/locale";


export default async function NewProjectPage() {
  const locale = await getCurrentLocale();
  const messages = getMessages(locale);

  return (
    <div className="space-y-8">
      <Panel
        eyebrow={messages.newProject.eyebrow}
        title={messages.newProject.title}
        description={messages.newProject.description}
      >
        <ProjectCreateForm />
      </Panel>
    </div>
  );
}
