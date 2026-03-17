export const LOCALE_COOKIE_NAME = "ra_locale";

export const SUPPORTED_LOCALES = ["en", "zh"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

const messages = {
  en: {
    meta: {
      title: "Management Science Research Assistant",
      description: "Structured research workflow for OM, OR, and IS projects.",
    },
    nav: {
      discipline: "Management Science",
      product: "Research Assistant",
      projects: "Projects",
      newWorkspace: "New Workspace",
      language: "Language",
      english: "EN",
      chinese: "中",
    },
    common: {
      backToWorkspace: "Back to workspace",
      savedAt: "Saved at",
      sharedModule: "Shared module",
      flagshipModule: "Flagship module",
      paradigmStub: "Paradigm stub",
      moduleMismatch: "Module mismatch",
    },
    home: {
      eyebrow: "Workflow-first MVP",
      title: "A structured research workspace for serious management science projects.",
      description:
        "Build projects around explicit research framing, reviewable outputs, and paradigm-aware modules instead of a generic chatbot shell.",
      startWorkspace: "Start a workspace",
      viewProjects: "View projects",
      initialModulesEyebrow: "Initial modules",
      initialModulesTitle: "What the MVP actually does",
      initialModulesDescription: "The first vertical slice is intentionally narrow and operational.",
      initialModules: [
        "Create a project and choose OM, OR, or IS.",
        "Generate structured research-question options with persisted outputs.",
        "Run a diagnostic design check with issues and next actions.",
        "Use the OM Model Canvas as the flagship paradigm module.",
      ],
      paradigms: {
        OM: {
          title: "Analytical and game-theoretic modeling",
          description:
            "Flagship v1 workflow with a structured Model Canvas for disciplined model framing.",
        },
        OR: {
          title: "Optimization research",
          description:
            "Lighter but real problem framing so the shared workflow remains coherent across paradigms.",
        },
        IS: {
          title: "Empirical and causal design",
          description:
            "Lighter but real study framing focused on identification and validity logic.",
        },
      },
      workflowEyebrow: "Shared workflow",
      workflowTitle: "Reviewable outputs, not chat transcripts",
      workflowDescription:
        "Generated content is organized into cards and panels so it can be revised as part of a research workflow.",
      workflowCards: ["Research Question", "Contribution", "Method Fit", "Risks and Next Steps"],
      guardrailEyebrow: "Guardrail",
      guardrailTitle: "The interface stays disciplined",
      guardrailDescription:
        "Each module maps to a concrete research task: framing, questioning, checking, and structured refinement.",
      guardrailPoints: [
        "LLMs are used for schema-driven research assistance, not open-ended conversation.",
        "OR and IS are already supported at the navigation and architecture level, while OM goes deeper first.",
        "Everything persists into a project workspace so context survives across sessions.",
      ],
    },
    projects: {
      eyebrow: "Projects",
      title: "Research workspaces",
      description:
        "Each workspace persists project framing, paradigm-specific canvases, and generated outputs.",
      emptyTitle: "No projects yet",
      emptyDescription: "Create your first workspace to start the structured research workflow.",
      createWorkspace: "Create workspace",
      loadError: "Unable to load projects.",
    },
    newProject: {
      eyebrow: "New workspace",
      title: "Create a project",
      description:
        "Start with a paradigm choice and a disciplined problem statement. OM goes deeper first, but OR and IS are already part of the workflow.",
      paradigms: {
        OM: {
          title: "OM",
          description: "Analytical and game-theoretic modeling. This is the deepest v1 workflow.",
          badge: "Flagship",
        },
        OR: {
          title: "OR",
          description: "Optimization-oriented problem framing with a lighter but real canvas.",
        },
        IS: {
          title: "IS",
          description: "Empirical and causal framing with a lighter but real study design stub.",
        },
      },
      fields: {
        title: "Project title",
        titlePlaceholder: "Strategic disclosure and competitor response",
        domain: "Research domain",
        domainPlaceholder: "Platform strategy, supply chain coordination, digital governance",
        problemStatement: "Problem statement",
        problemStatementPlaceholder:
          "Describe the focal phenomenon, the strategic tension, and the contribution you want to make.",
        notes: "Notes",
        notesPlaceholder: "Optional context, provisional assumptions, or literature notes.",
      },
      validation: {
        title: "Project title must be at least 3 characters.",
        domain: "Research domain must be at least 2 characters.",
        problemStatement: "Problem statement must be at least 10 characters.",
      },
      guardrailTitle: "Product guardrail",
      guardrailBody:
        "This workspace starts with structured research framing. It does not open into a generic chat screen.",
      submit: "Create workspace",
      submitting: "Creating workspace...",
      submitError: "Unable to create the project.",
    },
    workspace: {
      persistentContext: "Persistent project context",
      notes: "Notes",
      orientationTitle: "Workspace orientation",
      orientationPoints: [
        "The workspace keeps shared modules stable while the primary paradigm module carries the deeper logic.",
        "For v1, OM is the deepest path. OR and IS stay real but lighter.",
      ],
      modules: {
        modelCanvas: {
          title: "Model Canvas",
          description:
            "Structured model framing for actors, sequence, information, equilibrium, propositions, and empirical implications.",
          start: "Start canvas",
          started: "Canvas started",
        },
        problemFrame: {
          title: "Problem Frame",
          description: "Lighter optimization framing to keep OR inside the shared workflow from day one.",
          start: "Start frame",
          started: "Frame started",
        },
        studyFrame: {
          title: "Study Frame",
          description: "Lighter empirical framing with explicit identification and validity logic.",
          start: "Start frame",
          started: "Frame started",
        },
        questionGenerator: {
          title: "Research Question Generator",
          description:
            "Generate reviewable candidate questions with why-it-matters, best-fit paradigm, contribution, risks, and next step.",
          ready: "Ready to run",
          saved: "Latest run saved",
        },
        designChecker: {
          title: "Research Design Checker",
          description:
            "Run a diagnostic review that flags issues and recommends next actions without rewriting the project.",
          ready: "Ready to review",
          saved: "Latest review saved",
        },
      },
      questionPanelTitle: "Research Question Generator",
      questionPanelDescription:
        "Use the current workspace framing to generate paradigm-aware, reviewable question options.",
      designPanelTitle: "Research Design Checker",
      designPanelDescription:
        "Hybrid review with deterministic checks and structured diagnostic feedback.",
      loadError: "Unable to load the workspace.",
      errorEyebrow: "Workspace",
      errorTitle: "Project workspace",
    },
    questionsPage: {
      eyebrow: "Shared feature",
      title: "Research Question Generator",
      description:
        "Turn a research phenomenon or rough idea into structured, reviewable candidate questions across OR, OM, and IS.",
      helper:
        "The current project paradigm is one input, but the generator still recommends the best-fit paradigm for each candidate question.",
      loadError: "Unable to load the Research Question Generator.",
      errorEyebrow: "Research Questions",
    },
    researchQuestionPanel: {
      idea: "Research phenomenon or rough idea",
      ideaPlaceholder:
        "Describe the phenomenon, tension, or rough research idea you want to turn into candidate questions.",
      additionalContext: "Additional context",
      additionalContextPlaceholder:
        "Optional notes on setting, literature, mechanism, or empirical context.",
      constraints: "Constraints",
      constraintsPlaceholder: "Method, data, or scope constraints.",
      missingIdea: "Enter a research phenomenon or rough idea before generating.",
      generate: "Generate questions",
      generating: "Generating...",
      inputInterpretation: "Input interpretation",
      candidateLabel: "Candidate Research Question",
      whyThisMatters: "Why This Matters",
      bestFitParadigm: "Best-fit Paradigm",
      potentialContribution: "Potential Contribution",
      risks: "Risks / Weaknesses",
      nextStep: "Suggested Next Step",
      empty:
        "Submit a phenomenon or rough idea to generate structured, reviewable candidate research questions.",
      submitError: "Unable to generate questions.",
    },
    designChecker: {
      description:
        "Diagnostic review only. The checker flags issues and suggests next actions without rewriting the project.",
      run: "Run design check",
      running: "Reviewing...",
      overallAssessment: "Overall assessment",
      affectedModule: "Affected module",
      nextAction: "Next action",
      noIssues: "No major issues were flagged in the latest review.",
      empty: "Run the checker after you have filled the relevant framing canvas.",
      submitError: "Unable to run design review.",
      severity: {
        low: "low",
        medium: "medium",
        high: "high",
      },
    },
    modelCanvasPage: {
      title: "OM Model Canvas",
      description:
        "Structured model framing for disciplined analytical work. The goal is clear assumptions and reviewable propositions, not full derivation.",
      notMatching: "This project is not an OM workspace.",
      loadError: "Unable to load the Model Canvas.",
      errorEyebrow: "Model Canvas",
    },
    modelCanvasForm: {
      researchPuzzle: "Research puzzle",
      actors: "Actors",
      timing: "Timing and sequence",
      informationStructure: "Information structure",
      decisions: "Strategic decisions",
      payoffs: "Incentives and payoffs",
      institutionalContext: "Institutional context",
      equilibriumConcept: "Equilibrium concept",
      propositions: "Propositions",
      propositionsPlaceholder: "One proposition per line",
      empiricalImplications: "Empirical implications",
      empiricalImplicationsPlaceholder: "One implication per line",
      validationNotes: "Validation notes",
      canvasStatus: "Canvas status",
      coreFieldsFilled: "core fields filled",
      guardrail:
        "This module is for disciplined model framing. It is not a derivation engine.",
      qualityTitle: "What good looks like",
      qualityPoints: [
        "A single focal mechanism, not several competing stories.",
        "Clear timing and information assumptions.",
        "Propositions that map to observable implications.",
      ],
      save: "Save Model Canvas",
      saving: "Saving...",
      submitError: "Unable to save the Model Canvas.",
    },
    problemFramePage: {
      title: "OR Problem Frame",
      description:
        "Light but real optimization framing so the workspace can support OR projects without pretending the paradigms are identical.",
      notMatching: "This project is not an OR workspace.",
      loadError: "Unable to load the OR Problem Frame.",
      errorEyebrow: "Problem Frame",
    },
    problemFrameForm: {
      fields: {
        objective: "Objective",
        decisionVariables: "Decision variables",
        constraints: "Constraints",
        inputsAndData: "Inputs and data",
        solutionApproach: "Solution approach",
        validationPlan: "Validation plan",
      },
      guardrail:
        "This is a lighter v1 stub. It captures the optimization problem shape so shared modules can still operate coherently.",
      save: "Save Problem Frame",
      saving: "Saving...",
      submitError: "Unable to save the OR Problem Frame.",
    },
    studyFramePage: {
      title: "IS Study Frame",
      description:
        "Light but real empirical framing so identification logic and validity concerns are explicit from the start.",
      notMatching: "This project is not an IS workspace.",
      loadError: "Unable to load the IS Study Frame.",
      errorEyebrow: "Study Frame",
    },
    studyFrameForm: {
      fields: {
        unitOfAnalysis: "Unit of analysis",
        treatmentOrExposure: "Treatment or exposure",
        outcome: "Outcome",
        dataSource: "Data source",
        identificationStrategy: "Identification strategy",
        threatsToValidity: "Threats to validity",
        robustnessPlan: "Robustness plan",
      },
      guardrail:
        "This is a lighter v1 stub focused on disciplined empirical framing rather than execution.",
      save: "Save Study Frame",
      saving: "Saving...",
      submitError: "Unable to save the IS Study Frame.",
    },
  },
  zh: {
    meta: {
      title: "管理科学研究助手",
      description: "面向 OM、OR、IS 项目的结构化研究工作流。",
    },
    nav: {
      discipline: "管理科学",
      product: "研究助手",
      projects: "项目",
      newWorkspace: "新建工作区",
      language: "语言",
      english: "EN",
      chinese: "中",
    },
    common: {
      backToWorkspace: "返回工作区",
      savedAt: "保存时间",
      sharedModule: "共享模块",
      flagshipModule: "主线模块",
      paradigmStub: "范式占位模块",
      moduleMismatch: "模块不匹配",
    },
    home: {
      eyebrow: "工作流优先 MVP",
      title: "面向严肃管理科学研究的结构化工作区。",
      description:
        "围绕明确的研究框架、可审阅的输出和范式感知模块来构建项目，而不是做成一个泛化聊天壳。",
      startWorkspace: "开始一个工作区",
      viewProjects: "查看项目",
      initialModulesEyebrow: "初始模块",
      initialModulesTitle: "这个 MVP 实际能做什么",
      initialModulesDescription: "第一条垂直切片刻意做得很窄，但可运行。",
      initialModules: [
        "创建项目，并选择 OM、OR 或 IS。",
        "生成结构化研究问题候选，并持久化输出。",
        "运行诊断式设计检查，返回问题和下一步动作。",
        "使用 OM Model Canvas 作为主线范式模块。",
      ],
      paradigms: {
        OM: {
          title: "分析 / 博弈论建模",
          description: "v1 的主线工作流，用结构化 Model Canvas 做严谨的模型框架定义。",
        },
        OR: {
          title: "优化研究",
          description: "较轻但真实的问题框架，使共享工作流在不同范式间保持一致。",
        },
        IS: {
          title: "实证与因果设计",
          description: "较轻但真实的研究设计框架，聚焦识别逻辑和效度问题。",
        },
      },
      workflowEyebrow: "共享工作流",
      workflowTitle: "可审阅的输出，而不是聊天记录",
      workflowDescription: "生成内容被组织成卡片和面板，便于在研究工作流中反复修订。",
      workflowCards: ["研究问题", "潜在贡献", "方法匹配", "风险与下一步"],
      guardrailEyebrow: "产品护栏",
      guardrailTitle: "界面保持克制",
      guardrailDescription: "每个模块都映射到一个明确的研究任务：框定、提问、检查和结构化修订。",
      guardrailPoints: [
        "LLM 用于基于 schema 的研究辅助，而不是开放式闲聊。",
        "OR 和 IS 在导航和架构层面已经接入，OM 先做得更深。",
        "所有内容都持久化到项目工作区，跨会话保留上下文。",
      ],
    },
    projects: {
      eyebrow: "项目",
      title: "研究工作区",
      description: "每个工作区都会保存项目框架、范式模块和生成结果。",
      emptyTitle: "还没有项目",
      emptyDescription: "创建第一个工作区，开始结构化研究流程。",
      createWorkspace: "创建工作区",
      loadError: "无法加载项目列表。",
    },
    newProject: {
      eyebrow: "新建工作区",
      title: "创建项目",
      description:
        "先做范式选择，再写一个有约束的 problem statement。OM 会更深，但 OR 和 IS 也已经进入工作流。",
      paradigms: {
        OM: {
          title: "OM",
          description: "分析 / 博弈论建模。这是 v1 最完整的工作流。",
          badge: "主线",
        },
        OR: {
          title: "OR",
          description: "面向优化的问题框架，较轻，但不是空壳。",
        },
        IS: {
          title: "IS",
          description: "面向实证 / 因果的问题框架，先提供较轻但真实的设计骨架。",
        },
      },
      fields: {
        title: "项目标题",
        titlePlaceholder: "信息披露时机与竞争者响应",
        domain: "研究领域",
        domainPlaceholder: "平台战略、供应链协调、数字治理",
        problemStatement: "问题陈述",
        problemStatementPlaceholder: "描述核心现象、战略张力，以及你希望形成的贡献。",
        notes: "备注",
        notesPlaceholder: "可选：补充背景、临时假设或文献笔记。",
      },
      validation: {
        title: "项目标题至少需要 3 个字符。",
        domain: "研究领域至少需要 2 个字符。",
        problemStatement: "问题陈述至少需要 10 个字符。",
      },
      guardrailTitle: "产品护栏",
      guardrailBody: "这个工作区从结构化研究框架开始，而不是直接打开成一个通用聊天界面。",
      submit: "创建工作区",
      submitting: "正在创建工作区...",
      submitError: "无法创建项目。",
    },
    workspace: {
      persistentContext: "持久化项目上下文",
      notes: "备注",
      orientationTitle: "工作区说明",
      orientationPoints: [
        "工作区保持共享模块稳定，同时由主范式模块承载更深的研究逻辑。",
        "在 v1 中，OM 是最深的路径；OR 和 IS 保持真实但更轻。",
      ],
      modules: {
        modelCanvas: {
          title: "Model Canvas",
          description: "围绕参与者、时序、信息结构、均衡、命题和实证含义进行结构化模型框定。",
          start: "开始画布",
          started: "画布已开始",
        },
        problemFrame: {
          title: "Problem Frame",
          description: "较轻的优化框架，让 OR 从第一天起就进入共享工作流。",
          start: "开始框架",
          started: "框架已开始",
        },
        studyFrame: {
          title: "Study Frame",
          description: "较轻的实证框架，明确识别逻辑与效度问题。",
          start: "开始框架",
          started: "框架已开始",
        },
        questionGenerator: {
          title: "研究问题生成器",
          description: "生成可审阅的问题候选，包括意义、最佳范式、贡献、风险和下一步。",
          ready: "可运行",
          saved: "已保存最近一次结果",
        },
        designChecker: {
          title: "研究设计检查器",
          description: "运行诊断式审阅，标记问题并给出下一步动作，不直接重写项目。",
          ready: "可审阅",
          saved: "已保存最近一次审阅",
        },
      },
      questionPanelTitle: "研究问题生成器",
      questionPanelDescription: "基于当前工作区的研究框架，生成范式感知且可审阅的问题候选。",
      designPanelTitle: "研究设计检查器",
      designPanelDescription: "结合确定性检查和结构化诊断反馈的混合审阅。",
      loadError: "无法加载工作区。",
      errorEyebrow: "工作区",
      errorTitle: "项目工作区",
    },
    questionsPage: {
      eyebrow: "共享功能",
      title: "研究问题生成器",
      description: "把一个研究现象或模糊想法转成跨 OR、OM、IS 的结构化问题候选。",
      helper: "当前项目的范式只是输入之一，生成器仍会为每个候选问题推荐最佳匹配范式。",
      loadError: "无法加载研究问题生成器。",
      errorEyebrow: "研究问题",
    },
    researchQuestionPanel: {
      idea: "研究现象或模糊想法",
      ideaPlaceholder: "描述你想转化为研究问题候选的现象、张力或初步研究想法。",
      additionalContext: "补充背景",
      additionalContextPlaceholder: "可选：研究场景、文献背景、机制线索或实证背景。",
      constraints: "约束条件",
      constraintsPlaceholder: "方法、数据或范围约束。",
      missingIdea: "请先输入一个研究现象或模糊想法，再生成结果。",
      generate: "生成问题",
      generating: "正在生成...",
      inputInterpretation: "输入理解",
      candidateLabel: "候选研究问题",
      whyThisMatters: "为什么重要",
      bestFitParadigm: "最佳匹配范式",
      potentialContribution: "潜在贡献",
      risks: "风险 / 弱点",
      nextStep: "建议下一步",
      empty: "提交一个现象或模糊想法，以生成结构化、可审阅的研究问题候选。",
      submitError: "无法生成研究问题。",
    },
    designChecker: {
      description: "这里只做诊断式审阅。检查器会标记问题并提出下一步动作，不会直接重写项目。",
      run: "运行设计检查",
      running: "正在审阅...",
      overallAssessment: "总体判断",
      affectedModule: "影响模块",
      nextAction: "下一步动作",
      noIssues: "最近一次审阅没有发现重大问题。",
      empty: "先完成相关框架画布，再运行检查器。",
      submitError: "无法运行设计审阅。",
      severity: {
        low: "低",
        medium: "中",
        high: "高",
      },
    },
    modelCanvasPage: {
      title: "OM Model Canvas",
      description: "用于严谨分析研究的结构化模型框架。目标是明确假设和可审阅命题，而不是完整推导。",
      notMatching: "这个项目不是 OM 工作区。",
      loadError: "无法加载 Model Canvas。",
      errorEyebrow: "Model Canvas",
    },
    modelCanvasForm: {
      researchPuzzle: "研究谜题",
      actors: "参与者",
      timing: "时序与行动顺序",
      informationStructure: "信息结构",
      decisions: "策略决策",
      payoffs: "激励与收益",
      institutionalContext: "制度背景",
      equilibriumConcept: "均衡概念",
      propositions: "命题",
      propositionsPlaceholder: "每行一个命题",
      empiricalImplications: "实证含义",
      empiricalImplicationsPlaceholder: "每行一个实证含义",
      validationNotes: "验证备注",
      canvasStatus: "画布状态",
      coreFieldsFilled: "个核心字段已填写",
      guardrail: "这个模块用于严谨的模型框架定义，不是推导引擎。",
      qualityTitle: "好的状态应该是什么样",
      qualityPoints: [
        "聚焦单一核心机制，而不是同时讲多个竞争故事。",
        "时序和信息假设清晰。",
        "命题能映射到可观察的实证含义。",
      ],
      save: "保存 Model Canvas",
      saving: "正在保存...",
      submitError: "无法保存 Model Canvas。",
    },
    problemFramePage: {
      title: "OR Problem Frame",
      description: "较轻但真实的优化框架，让工作区支持 OR 项目，而不是假装所有范式都一样。",
      notMatching: "这个项目不是 OR 工作区。",
      loadError: "无法加载 OR Problem Frame。",
      errorEyebrow: "Problem Frame",
    },
    problemFrameForm: {
      fields: {
        objective: "目标函数",
        decisionVariables: "决策变量",
        constraints: "约束条件",
        inputsAndData: "输入与数据",
        solutionApproach: "求解思路",
        validationPlan: "验证计划",
      },
      guardrail: "这是一个较轻的 v1 占位模块，用来捕捉优化问题的形状，使共享模块仍能一致运行。",
      save: "保存 Problem Frame",
      saving: "正在保存...",
      submitError: "无法保存 OR Problem Frame。",
    },
    studyFramePage: {
      title: "IS Study Frame",
      description: "较轻但真实的实证框架，从一开始就明确识别逻辑和效度问题。",
      notMatching: "这个项目不是 IS 工作区。",
      loadError: "无法加载 IS Study Frame。",
      errorEyebrow: "Study Frame",
    },
    studyFrameForm: {
      fields: {
        unitOfAnalysis: "分析单位",
        treatmentOrExposure: "处理 / 暴露变量",
        outcome: "结果变量",
        dataSource: "数据来源",
        identificationStrategy: "识别策略",
        threatsToValidity: "效度威胁",
        robustnessPlan: "稳健性计划",
      },
      guardrail: "这是一个较轻的 v1 占位模块，重点是严谨的实证框架，而不是执行分析。",
      save: "保存 Study Frame",
      saving: "正在保存...",
      submitError: "无法保存 IS Study Frame。",
    },
  },
} as const;

export type Messages = (typeof messages)[Locale];

export function isLocale(value: string | undefined): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}

export function getLocaleTag(locale: Locale): string {
  return locale === "zh" ? "zh-CN" : "en-US";
}
