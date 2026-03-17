"use client";

import { useState } from "react";

import type { QuestionGenerationArtifact } from "@research-assistant/api-client";

import { useI18n } from "@/components/locale-provider";
import { ParadigmBadge } from "@/components/paradigm-badge";
import { apiClient } from "@/lib/api";


type Props = {
  projectId: string;
  initialArtifact: QuestionGenerationArtifact | null;
};

export function ResearchQuestionPanel({ projectId, initialArtifact }: Props) {
  const { locale, messages } = useI18n();
  const [artifact, setArtifact] = useState<QuestionGenerationArtifact | null>(initialArtifact);
  const [idea, setIdea] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [constraints, setConstraints] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!idea.trim()) {
      setError(messages.researchQuestionPanel.missingIdea);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await apiClient.generateResearchQuestions(projectId, {
        idea: idea.trim(),
        additional_context: additionalContext || undefined,
        constraints: constraints || undefined,
        response_language: locale,
      });
      setArtifact(result);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : messages.researchQuestionPanel.submitError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4">
        <div>
          <label className="label" htmlFor="idea">
            {messages.researchQuestionPanel.idea}
          </label>
          <textarea
            id="idea"
            className="field min-h-28"
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            placeholder={messages.researchQuestionPanel.ideaPlaceholder}
          />
        </div>
        <div>
          <label className="label" htmlFor="additional_context">
            {messages.researchQuestionPanel.additionalContext}
          </label>
          <textarea
            id="additional_context"
            className="field min-h-24"
            value={additionalContext}
            onChange={(event) => setAdditionalContext(event.target.value)}
            placeholder={messages.researchQuestionPanel.additionalContextPlaceholder}
          />
        </div>
        <div>
          <label className="label" htmlFor="constraints">
            {messages.researchQuestionPanel.constraints}
          </label>
          <textarea
            id="constraints"
            className="field min-h-20"
            value={constraints}
            onChange={(event) => setConstraints(event.target.value)}
            placeholder={messages.researchQuestionPanel.constraintsPlaceholder}
          />
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-ink">{error}</div> : null}

      <button className="button-primary" onClick={handleGenerate} disabled={isLoading} type="button">
        {isLoading ? messages.researchQuestionPanel.generating : messages.researchQuestionPanel.generate}
      </button>

      {artifact ? (
        <div className="space-y-4 rounded-3xl border border-ink/10 bg-white/80 p-5">
          <div>
            <div className="label">{messages.researchQuestionPanel.inputInterpretation}</div>
            <p className="text-sm leading-6 text-slate">{artifact.payload.input_interpretation}</p>
          </div>
          <div className="grid gap-4">
            {artifact.payload.candidate_research_questions.map((candidate, index) => (
              <article key={`${candidate.question}-${index}`} className="rounded-3xl border border-ink/10 bg-cloud p-5">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                  {messages.researchQuestionPanel.candidateLabel} {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-ink">{candidate.question}</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="label">{messages.researchQuestionPanel.whyThisMatters}</div>
                    <p className="text-sm leading-6 text-slate">{candidate.why_this_matters}</p>
                  </div>
                  <div>
                    <div className="label">{messages.researchQuestionPanel.bestFitParadigm}</div>
                    <div className="space-y-3">
                      <ParadigmBadge paradigm={candidate.best_fit_paradigm.paradigm} />
                      <p className="text-sm leading-6 text-slate">{candidate.best_fit_paradigm.rationale}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="label">{messages.researchQuestionPanel.potentialContribution}</div>
                  <p className="text-sm leading-6 text-slate">{candidate.potential_contribution}</p>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="label">{messages.researchQuestionPanel.risks}</div>
                    <ul className="space-y-2 text-sm leading-6 text-slate">
                      {candidate.risks_or_weaknesses.map((risk) => (
                        <li key={risk}>- {risk}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="label">{messages.researchQuestionPanel.nextStep}</div>
                    <p className="text-sm leading-6 text-slate">{candidate.suggested_next_step}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-ink/15 bg-white/40 p-5 text-sm leading-6 text-slate">
          {messages.researchQuestionPanel.empty}
        </div>
      )}
    </div>
  );
}
