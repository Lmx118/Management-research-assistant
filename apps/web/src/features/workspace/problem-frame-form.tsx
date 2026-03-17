"use client";

import { type FormEvent, useState } from "react";

import type { ORProblemFramePayload } from "@research-assistant/api-client";

import { useI18n } from "@/components/locale-provider";
import { apiClient } from "@/lib/api";
import { getLocaleTag } from "@/lib/i18n";


type Props = {
  projectId: string;
  initialPayload?: ORProblemFramePayload;
};

const emptyPayload: ORProblemFramePayload = {
  objective: "",
  decision_variables: "",
  constraints: "",
  inputs_and_data: "",
  solution_approach: "",
  validation_plan: "",
};

export function ProblemFrameForm({ projectId, initialPayload }: Props) {
  const { locale, messages } = useI18n();
  const [form, setForm] = useState<ORProblemFramePayload>(initialPayload ?? emptyPayload);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const updateField = <K extends keyof ORProblemFramePayload>(key: K, value: ORProblemFramePayload[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const result = await apiClient.saveProblemFrame(projectId, form);
      setForm(result.payload);
      setSavedAt(result.updated_at);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : messages.problemFrameForm.submitError);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]" onSubmit={handleSubmit}>
      <div className="space-y-5">
        {(
          [
            ["objective", messages.problemFrameForm.fields.objective],
            ["decision_variables", messages.problemFrameForm.fields.decisionVariables],
            ["constraints", messages.problemFrameForm.fields.constraints],
            ["inputs_and_data", messages.problemFrameForm.fields.inputsAndData],
            ["solution_approach", messages.problemFrameForm.fields.solutionApproach],
            ["validation_plan", messages.problemFrameForm.fields.validationPlan],
          ] as Array<[keyof ORProblemFramePayload, string]>
        ).map(([key, label]) => (
          <div key={key}>
            <label className="label" htmlFor={key}>
              {label}
            </label>
            <textarea id={key} className="field min-h-24" value={form[key]} onChange={(event) => updateField(key, event.target.value)} />
          </div>
        ))}
      </div>
      <aside className="space-y-5">
        <div className="rounded-3xl border border-brass/30 bg-brass/10 p-5 text-sm leading-6 text-slate">
          {messages.problemFrameForm.guardrail}
        </div>
        {savedAt ? <div className="text-sm text-slate">{messages.common.savedAt} {new Date(savedAt).toLocaleString(getLocaleTag(locale))}</div> : null}
        {error ? <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-ink">{error}</div> : null}
        <button className="button-primary w-full" disabled={isSaving} type="submit">
          {isSaving ? messages.problemFrameForm.saving : messages.problemFrameForm.save}
        </button>
      </aside>
    </form>
  );
}
