"use client";

import { useState } from "react";

import type { DesignReviewArtifact } from "@research-assistant/api-client";

import { useI18n } from "@/components/locale-provider";
import { apiClient } from "@/lib/api";


type Props = {
  projectId: string;
  initialArtifact: DesignReviewArtifact | null;
};

export function DesignCheckerPanel({ projectId, initialArtifact }: Props) {
  const { locale, messages } = useI18n();
  const [artifact, setArtifact] = useState<DesignReviewArtifact | null>(initialArtifact);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await apiClient.runDesignCheck(projectId, { response_language: locale });
      setArtifact(result);
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : messages.designChecker.submitError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm leading-6 text-slate">
          {messages.designChecker.description}
        </p>
        <button className="button-primary" onClick={handleRun} disabled={isLoading} type="button">
          {isLoading ? messages.designChecker.running : messages.designChecker.run}
        </button>
      </div>

      {error ? <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-ink">{error}</div> : null}

      {artifact ? (
        <div className="space-y-4 rounded-3xl border border-ink/10 bg-white/80 p-5">
          <div>
            <div className="label">{messages.designChecker.overallAssessment}</div>
            <p className="text-sm leading-6 text-slate">{artifact.payload.overall_assessment}</p>
          </div>
          <div className="space-y-3">
            {artifact.payload.issues.length > 0 ? (
              artifact.payload.issues.map((issue) => (
                <article key={`${issue.issue}-${issue.affected_module}`} className="rounded-3xl border border-ink/10 bg-cloud p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-ink">{issue.issue}</span>
                    <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                      {messages.designChecker.severity[issue.severity]}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-slate">{issue.rationale}</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="label">{messages.designChecker.affectedModule}</div>
                      <p className="text-sm text-slate">{issue.affected_module}</p>
                    </div>
                    <div>
                      <div className="label">{messages.designChecker.nextAction}</div>
                      <p className="text-sm leading-6 text-slate">{issue.next_action}</p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-ink/15 bg-white/40 p-5 text-sm leading-6 text-slate">
                {messages.designChecker.noIssues}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-ink/15 bg-white/40 p-5 text-sm leading-6 text-slate">
          {messages.designChecker.empty}
        </div>
      )}
    </div>
  );
}
