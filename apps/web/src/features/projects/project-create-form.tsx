"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import type { Paradigm, ProjectCreateInput } from "@research-assistant/api-client";

import { useI18n } from "@/components/locale-provider";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";


const defaultForm: ProjectCreateInput = {
  title: "",
  paradigm: "OM",
  domain: "",
  problem_statement: "",
  notes: "",
};

const validateProjectForm = (
  form: ProjectCreateInput,
  validationMessages: {
    title: string;
    domain: string;
    problemStatement: string;
  },
): string | null => {
  if (form.title.trim().length < 3) {
    return validationMessages.title;
  }

  if (form.domain.trim().length < 2) {
    return validationMessages.domain;
  }

  if (form.problem_statement.trim().length < 10) {
    return validationMessages.problemStatement;
  }

  return null;
};

export function ProjectCreateForm() {
  const { messages } = useI18n();
  const router = useRouter();
  const [form, setForm] = useState<ProjectCreateInput>(defaultForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paradigmOptions: Array<{
    value: Paradigm;
    title: string;
    description: string;
    badge?: string;
  }> = [
    {
      value: "OM",
      title: messages.newProject.paradigms.OM.title,
      description: messages.newProject.paradigms.OM.description,
      badge: messages.newProject.paradigms.OM.badge,
    },
    {
      value: "OR",
      title: messages.newProject.paradigms.OR.title,
      description: messages.newProject.paradigms.OR.description,
    },
    {
      value: "IS",
      title: messages.newProject.paradigms.IS.title,
      description: messages.newProject.paradigms.IS.description,
    },
  ];

  const updateField = <K extends keyof ProjectCreateInput>(key: K, value: ProjectCreateInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateProjectForm(form, messages.newProject.validation);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const project = await apiClient.createProject({
        ...form,
        notes: form.notes?.trim() || undefined,
      });
      router.push(`/projects/${project.id}`);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : messages.newProject.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="grid gap-4 lg:grid-cols-3">
        {paradigmOptions.map((option) => {
          const selected = form.paradigm === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField("paradigm", option.value)}
              className={cn(
                "rounded-3xl border p-5 text-left transition",
                selected
                  ? "border-ink bg-ink text-cloud shadow-panel"
                  : "border-ink/10 bg-white/70 text-ink hover:border-ink/20 hover:bg-white",
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-lg font-semibold">{option.title}</span>
                {option.value === "OM" && option.badge ? (
                  <span className={cn("rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em]", selected ? "bg-cloud/20" : "bg-brass/15")}>
                    {option.badge}
                  </span>
                ) : null}
              </div>
              <p className={cn("text-sm leading-6", selected ? "text-cloud/80" : "text-slate")}>{option.description}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
        <div className="space-y-5">
          <div>
            <label className="label" htmlFor="title">
              {messages.newProject.fields.title}
            </label>
            <input
              id="title"
              className="field"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder={messages.newProject.fields.titlePlaceholder}
              minLength={3}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="domain">
              {messages.newProject.fields.domain}
            </label>
            <input
              id="domain"
              className="field"
              value={form.domain}
              onChange={(event) => updateField("domain", event.target.value)}
              placeholder={messages.newProject.fields.domainPlaceholder}
              minLength={2}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="problem_statement">
              {messages.newProject.fields.problemStatement}
            </label>
            <textarea
              id="problem_statement"
              className="field min-h-40"
              value={form.problem_statement}
              onChange={(event) => updateField("problem_statement", event.target.value)}
              placeholder={messages.newProject.fields.problemStatementPlaceholder}
              minLength={10}
              required
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="label" htmlFor="notes">
              {messages.newProject.fields.notes}
            </label>
            <textarea
              id="notes"
              className="field min-h-40"
              value={form.notes ?? ""}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder={messages.newProject.fields.notesPlaceholder}
            />
          </div>
          <div className="rounded-3xl border border-brass/30 bg-brass/10 p-5 text-sm leading-6 text-ink">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate">{messages.newProject.guardrailTitle}</div>
            {messages.newProject.guardrailBody}
          </div>
          {error ? <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-ink whitespace-pre-line">{error}</div> : null}
          <button className="button-primary w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? messages.newProject.submitting : messages.newProject.submit}
          </button>
        </div>
      </div>
    </form>
  );
}
