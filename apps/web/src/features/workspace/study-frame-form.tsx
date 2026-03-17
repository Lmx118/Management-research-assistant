"use client";

import { type FormEvent, useState } from "react";

import type { ISStudyFramePayload } from "@research-assistant/api-client";

import { useI18n } from "@/components/locale-provider";
import { apiClient } from "@/lib/api";
import { getLocaleTag } from "@/lib/i18n";


type Props = {
  projectId: string;
  initialPayload?: ISStudyFramePayload;
};

const emptyPayload: ISStudyFramePayload = {
  unit_of_analysis: "",
  treatment_or_exposure: "",
  outcome: "",
  data_source: "",
  identification_strategy: "",
  threats_to_validity: "",
  robustness_plan: "",
};

export function StudyFrameForm({ projectId, initialPayload }: Props) {
  const { locale, messages } = useI18n();
  const [form, setForm] = useState<ISStudyFramePayload>(initialPayload ?? emptyPayload);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const updateField = <K extends keyof ISStudyFramePayload>(key: K, value: ISStudyFramePayload[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const result = await apiClient.saveStudyFrame(projectId, form);
      setForm(result.payload);
      setSavedAt(result.updated_at);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : messages.studyFrameForm.submitError);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]" onSubmit={handleSubmit}>
      <div className="space-y-5">
        {(
          [
            ["unit_of_analysis", messages.studyFrameForm.fields.unitOfAnalysis],
            ["treatment_or_exposure", messages.studyFrameForm.fields.treatmentOrExposure],
            ["outcome", messages.studyFrameForm.fields.outcome],
            ["data_source", messages.studyFrameForm.fields.dataSource],
            ["identification_strategy", messages.studyFrameForm.fields.identificationStrategy],
            ["threats_to_validity", messages.studyFrameForm.fields.threatsToValidity],
            ["robustness_plan", messages.studyFrameForm.fields.robustnessPlan],
          ] as Array<[keyof ISStudyFramePayload, string]>
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
        <div className="rounded-3xl border border-moss/30 bg-moss/10 p-5 text-sm leading-6 text-slate">
          {messages.studyFrameForm.guardrail}
        </div>
        {savedAt ? <div className="text-sm text-slate">{messages.common.savedAt} {new Date(savedAt).toLocaleString(getLocaleTag(locale))}</div> : null}
        {error ? <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-ink">{error}</div> : null}
        <button className="button-primary w-full" disabled={isSaving} type="submit">
          {isSaving ? messages.studyFrameForm.saving : messages.studyFrameForm.save}
        </button>
      </aside>
    </form>
  );
}
