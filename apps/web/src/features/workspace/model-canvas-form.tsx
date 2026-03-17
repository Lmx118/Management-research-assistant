"use client";

import { type FormEvent, useState } from "react";

import type { OMModelCanvasPayload } from "@research-assistant/api-client";

import { useI18n } from "@/components/locale-provider";
import { apiClient } from "@/lib/api";
import { getLocaleTag } from "@/lib/i18n";


type Props = {
  projectId: string;
  initialPayload?: OMModelCanvasPayload;
};

const emptyPayload: OMModelCanvasPayload = {
  research_puzzle: "",
  actors: "",
  timing: "",
  information_structure: "",
  decisions: "",
  payoffs: "",
  institutional_context: "",
  equilibrium_concept: "",
  propositions: [],
  empirical_implications: [],
  validation_notes: "",
};

export function ModelCanvasForm({ projectId, initialPayload }: Props) {
  const { locale, messages } = useI18n();
  const [form, setForm] = useState<OMModelCanvasPayload>(initialPayload ?? emptyPayload);
  const [propositionsText, setPropositionsText] = useState((initialPayload?.propositions ?? []).join("\n"));
  const [implicationsText, setImplicationsText] = useState((initialPayload?.empirical_implications ?? []).join("\n"));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const requiredFields = [form.actors, form.timing, form.decisions, form.payoffs, form.equilibrium_concept];
  const filled = requiredFields.filter((value) => value.trim().length > 0).length;
  const completeness = `${filled}/5 ${messages.modelCanvasForm.coreFieldsFilled}`;

  const updateField = <K extends keyof OMModelCanvasPayload>(key: K, value: OMModelCanvasPayload[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const payload: OMModelCanvasPayload = {
        ...form,
        propositions: propositionsText.split("\n").map((item) => item.trim()).filter(Boolean),
        empirical_implications: implicationsText.split("\n").map((item) => item.trim()).filter(Boolean),
      };
      const result = await apiClient.saveModelCanvas(projectId, payload);
      setForm(result.payload);
      setPropositionsText(result.payload.propositions.join("\n"));
      setImplicationsText(result.payload.empirical_implications.join("\n"));
      setSavedAt(result.updated_at);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : messages.modelCanvasForm.submitError);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-5">
          <div>
            <label className="label" htmlFor="research_puzzle">
              {messages.modelCanvasForm.researchPuzzle}
            </label>
            <textarea id="research_puzzle" className="field min-h-24" value={form.research_puzzle} onChange={(event) => updateField("research_puzzle", event.target.value)} />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="actors">
                {messages.modelCanvasForm.actors}
              </label>
              <textarea id="actors" className="field min-h-28" value={form.actors} onChange={(event) => updateField("actors", event.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="timing">
                {messages.modelCanvasForm.timing}
              </label>
              <textarea id="timing" className="field min-h-28" value={form.timing} onChange={(event) => updateField("timing", event.target.value)} />
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="information_structure">
                {messages.modelCanvasForm.informationStructure}
              </label>
              <textarea
                id="information_structure"
                className="field min-h-28"
                value={form.information_structure}
                onChange={(event) => updateField("information_structure", event.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="decisions">
                {messages.modelCanvasForm.decisions}
              </label>
              <textarea id="decisions" className="field min-h-28" value={form.decisions} onChange={(event) => updateField("decisions", event.target.value)} />
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="payoffs">
                {messages.modelCanvasForm.payoffs}
              </label>
              <textarea id="payoffs" className="field min-h-28" value={form.payoffs} onChange={(event) => updateField("payoffs", event.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="institutional_context">
                {messages.modelCanvasForm.institutionalContext}
              </label>
              <textarea
                id="institutional_context"
                className="field min-h-28"
                value={form.institutional_context}
                onChange={(event) => updateField("institutional_context", event.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="equilibrium_concept">
              {messages.modelCanvasForm.equilibriumConcept}
            </label>
            <textarea
              id="equilibrium_concept"
              className="field min-h-24"
              value={form.equilibrium_concept}
              onChange={(event) => updateField("equilibrium_concept", event.target.value)}
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="propositions">
                {messages.modelCanvasForm.propositions}
              </label>
              <textarea
                id="propositions"
                className="field min-h-32"
                value={propositionsText}
                onChange={(event) => setPropositionsText(event.target.value)}
                placeholder={messages.modelCanvasForm.propositionsPlaceholder}
              />
            </div>
            <div>
              <label className="label" htmlFor="empirical_implications">
                {messages.modelCanvasForm.empiricalImplications}
              </label>
              <textarea
                id="empirical_implications"
                className="field min-h-32"
                value={implicationsText}
                onChange={(event) => setImplicationsText(event.target.value)}
                placeholder={messages.modelCanvasForm.empiricalImplicationsPlaceholder}
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="validation_notes">
              {messages.modelCanvasForm.validationNotes}
            </label>
            <textarea
              id="validation_notes"
              className="field min-h-24"
              value={form.validation_notes}
              onChange={(event) => updateField("validation_notes", event.target.value)}
            />
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-brass/30 bg-brass/10 p-5">
            <div className="label">{messages.modelCanvasForm.canvasStatus}</div>
            <div className="text-xl font-semibold text-ink">{completeness}</div>
            <p className="mt-3 text-sm leading-6 text-slate">{messages.modelCanvasForm.guardrail}</p>
          </div>
          <div className="rounded-3xl border border-ink/10 bg-white/70 p-5">
            <div className="label">{messages.modelCanvasForm.qualityTitle}</div>
            <ul className="space-y-2 text-sm leading-6 text-slate">
              {messages.modelCanvasForm.qualityPoints.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          {savedAt ? <div className="text-sm text-slate">{messages.common.savedAt} {new Date(savedAt).toLocaleString(getLocaleTag(locale))}</div> : null}
          {error ? <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-ink">{error}</div> : null}
          <button className="button-primary w-full" disabled={isSaving} type="submit">
            {isSaving ? messages.modelCanvasForm.saving : messages.modelCanvasForm.save}
          </button>
        </aside>
      </div>
    </form>
  );
}
