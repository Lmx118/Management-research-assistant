export type Paradigm = "OM" | "OR" | "IS";
export type CanvasKind = "om_model_canvas" | "or_problem_frame" | "is_study_frame";
export type ArtifactType = "research_question_generation" | "design_review";
export type ResponseLanguage = "en" | "zh";

export type Project = {
  id: string;
  title: string;
  paradigm: Paradigm;
  domain: string;
  problem_statement: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectCreateInput = {
  title: string;
  paradigm: Paradigm;
  domain: string;
  problem_statement: string;
  notes?: string;
};

export type OMModelCanvasPayload = {
  research_puzzle: string;
  actors: string;
  timing: string;
  information_structure: string;
  decisions: string;
  payoffs: string;
  institutional_context: string;
  equilibrium_concept: string;
  propositions: string[];
  empirical_implications: string[];
  validation_notes: string;
};

export type ORProblemFramePayload = {
  objective: string;
  decision_variables: string;
  constraints: string;
  inputs_and_data: string;
  solution_approach: string;
  validation_plan: string;
};

export type ISStudyFramePayload = {
  unit_of_analysis: string;
  treatment_or_exposure: string;
  outcome: string;
  data_source: string;
  identification_strategy: string;
  threats_to_validity: string;
  robustness_plan: string;
};

export type CanvasRecord<TPayload> = {
  project_id: string;
  canvas_kind: CanvasKind;
  version: number;
  payload: TPayload;
  updated_at: string;
};

export type ResearchQuestionCandidate = {
  question: string;
  why_this_matters: string;
  best_fit_paradigm: {
    paradigm: Paradigm;
    rationale: string;
  };
  potential_contribution: string;
  risks_or_weaknesses: string[];
  suggested_next_step: string;
};

export type ResearchQuestionGenerationPayload = {
  input_interpretation: string;
  candidate_research_questions: ResearchQuestionCandidate[];
};

export type QuestionGenerationArtifact = {
  id: string;
  artifact_type: ArtifactType;
  payload: ResearchQuestionGenerationPayload;
  created_at: string;
};

export type ResearchQuestionGenerationInput = {
  idea: string;
  additional_context?: string;
  constraints?: string;
  response_language?: ResponseLanguage;
};

export type DesignReviewInput = {
  response_language?: ResponseLanguage;
};

export type InformsLatestDigestInput = {
  response_language?: ResponseLanguage;
  limit?: number;
  force_refresh?: boolean;
};

export type PaperLibraryEntryCreateInput = {
  doi: string;
  title: string;
  journal: string;
  source_url: string;
  ai_summary: string;
  authors: string[];
  published_at: string;
};

export type DesignIssue = {
  severity: "low" | "medium" | "high";
  issue: string;
  rationale: string;
  affected_module: string;
  next_action: string;
};

export type DesignReviewPayload = {
  overall_assessment: string;
  issues: DesignIssue[];
};

export type DesignReviewArtifact = {
  id: string;
  artifact_type: ArtifactType;
  payload: DesignReviewPayload;
  created_at: string;
};

export type InformsArticleDigest = {
  title: string;
  journal: string;
  published_at: string;
  authors: string[];
  doi: string;
  source_url: string;
  ai_summary: string;
};

export type InformsLatestDigest = {
  source_name: string;
  source_url: string;
  refreshed_at: string;
  articles: InformsArticleDigest[];
};

export type PaperLibraryEntry = {
  id: string;
  doi: string;
  title: string;
  journal: string;
  source_url: string;
  ai_summary: string;
  authors: string[];
  published_at: string;
  created_at: string;
  updated_at: string;
};

export type ProjectWorkspace = {
  project: Project;
  om_model_canvas: CanvasRecord<OMModelCanvasPayload> | null;
  or_problem_frame: CanvasRecord<ORProblemFramePayload> | null;
  is_study_frame: CanvasRecord<ISStudyFramePayload> | null;
  latest_question_generation: QuestionGenerationArtifact | null;
  latest_design_review: DesignReviewArtifact | null;
};

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

type ClientOptions = {
  baseUrl: string;
};

type ApiValidationIssue = {
  loc?: Array<string | number>;
  msg?: string;
};

const formatApiDetail = (detail: unknown): string => {
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail)) {
    const issues = detail
      .map((item) => {
        if (typeof item !== "object" || item === null) {
          return null;
        }

        const issue = item as ApiValidationIssue;
        const field = issue.loc?.filter((part) => part !== "body").join(".");
        const message = issue.msg?.trim();

        if (!message) {
          return null;
        }

        return field ? `${field}: ${message}` : message;
      })
      .filter((item): item is string => Boolean(item));

    if (issues.length > 0) {
      return issues.join("; ");
    }
  }

  return "Request failed.";
};

const request = async <TResponse>(
  baseUrl: string,
  path: string,
  init?: RequestInit,
): Promise<TResponse> => {
  let response: Response;

  try {
    response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      0,
      `Cannot reach the API at ${baseUrl}. Start the backend server or run docker compose up --build.`,
    );
  }

  if (!response.ok) {
    let detail = "Request failed.";

    try {
      const json = (await response.json()) as { detail?: unknown };
      detail = formatApiDetail(json.detail);
    } catch {
      detail = response.statusText || detail;
    }

    throw new ApiError(response.status, detail);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as TResponse;
};

export const createApiClient = ({ baseUrl }: ClientOptions) => ({
  listProjects: () => request<Project[]>(baseUrl, "/projects"),
  getInformsLatestDigest: (input?: InformsLatestDigestInput) => {
    const params = new URLSearchParams();

    if (input?.response_language) {
      params.set("response_language", input.response_language);
    }

    if (typeof input?.limit === "number") {
      params.set("limit", String(input.limit));
    }

    if (input?.force_refresh) {
      params.set("force_refresh", "true");
    }

    const query = params.size > 0 ? `?${params.toString()}` : "";
    return request<InformsLatestDigest>(baseUrl, `/feeds/informs-latest${query}`);
  },
  listPaperLibraryEntries: () => request<PaperLibraryEntry[]>(baseUrl, "/paper-library/entries"),
  savePaperLibraryEntry: (input: PaperLibraryEntryCreateInput) =>
    request<PaperLibraryEntry>(baseUrl, "/paper-library/entries", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  deletePaperLibraryEntry: (entryId: string) =>
    request<void>(baseUrl, `/paper-library/entries/${entryId}`, {
      method: "DELETE",
    }),
  createProject: (input: ProjectCreateInput) =>
    request<Project>(baseUrl, "/projects", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getProject: (projectId: string) => request<Project>(baseUrl, `/projects/${projectId}`),
  getWorkspace: (projectId: string) => request<ProjectWorkspace>(baseUrl, `/projects/${projectId}/workspace`),
  getModelCanvas: (projectId: string) =>
    request<CanvasRecord<OMModelCanvasPayload> | null>(baseUrl, `/projects/${projectId}/om/model-canvas`),
  saveModelCanvas: (projectId: string, payload: OMModelCanvasPayload) =>
    request<CanvasRecord<OMModelCanvasPayload>>(baseUrl, `/projects/${projectId}/om/model-canvas`, {
      method: "PUT",
      body: JSON.stringify({ payload }),
    }),
  getProblemFrame: (projectId: string) =>
    request<CanvasRecord<ORProblemFramePayload> | null>(baseUrl, `/projects/${projectId}/or/problem-frame`),
  saveProblemFrame: (projectId: string, payload: ORProblemFramePayload) =>
    request<CanvasRecord<ORProblemFramePayload>>(baseUrl, `/projects/${projectId}/or/problem-frame`, {
      method: "PUT",
      body: JSON.stringify({ payload }),
    }),
  getStudyFrame: (projectId: string) =>
    request<CanvasRecord<ISStudyFramePayload> | null>(baseUrl, `/projects/${projectId}/is/study-frame`),
  saveStudyFrame: (projectId: string, payload: ISStudyFramePayload) =>
    request<CanvasRecord<ISStudyFramePayload>>(baseUrl, `/projects/${projectId}/is/study-frame`, {
      method: "PUT",
      body: JSON.stringify({ payload }),
    }),
  generateResearchQuestions: (projectId: string, input: ResearchQuestionGenerationInput) =>
    request<QuestionGenerationArtifact>(baseUrl, `/projects/${projectId}/question-generator`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  runDesignCheck: (projectId: string, input?: DesignReviewInput) =>
    request<DesignReviewArtifact>(baseUrl, `/projects/${projectId}/design-check`, {
      method: "POST",
      body: JSON.stringify(input ?? {}),
    }),
});
