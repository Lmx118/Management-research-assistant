from app.llm.base import LLMProvider, ModelT


class StubLLMProvider(LLMProvider):
    def generate_object(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        response_model: type[ModelT],
    ) -> ModelT:
        if response_model.__name__ == "ResearchQuestionGenerationPayload":
            return response_model.model_validate(self._build_question_generation_payload(user_prompt))

        if response_model.__name__ == "DesignReviewPayload":
            return response_model.model_validate(self._build_design_review_payload())

        raise ValueError(f"Unsupported response model for stub provider: {response_model.__name__}")

    @staticmethod
    def _build_question_generation_payload(user_prompt: str) -> dict:
        if '"paradigm": "OR"' in user_prompt:
            return {
                "input_interpretation": "The idea points to a decision problem with explicit trade-offs, which makes it suitable for optimization-oriented framing.",
                "candidate_research_questions": [
                    {
                        "question": "How should a platform allocate limited review capacity to maximize trust while controlling seller delay costs?",
                        "why_this_matters": "Many operational settings face a direct tension between quality assurance and response speed, yet the allocation logic is often treated ad hoc.",
                        "best_fit_paradigm": {
                            "paradigm": "OR",
                            "rationale": "The question is centered on an explicit objective, constrained decisions, and measurable trade-offs.",
                        },
                        "potential_contribution": "A tractable optimization model that clarifies the trade-off frontier between trust protection and operational responsiveness.",
                        "risks_or_weaknesses": [
                            "The objective function may be hard to justify without a specific operational context.",
                            "The data requirements may outgrow an MVP framing exercise.",
                        ],
                        "suggested_next_step": "Define the decision variables, objective, and one realistic institutional constraint.",
                    },
                    {
                        "question": "When does dynamic inventory repositioning outperform static safety-stock rules in a service network with heterogeneous demand?",
                        "why_this_matters": "Service networks often rely on legacy heuristics even when demand heterogeneity makes static rules inefficient.",
                        "best_fit_paradigm": {
                            "paradigm": "OR",
                            "rationale": "The research problem is naturally expressed as a constrained optimization or dynamic control problem.",
                        },
                        "potential_contribution": "A sharper problem formulation that links a realistic operational pain point to a solvable decision model.",
                        "risks_or_weaknesses": [
                            "The state space may become too large for a clean first paper framing.",
                        ],
                        "suggested_next_step": "Narrow the setting to one network structure and one performance metric.",
                    },
                ],
            }

        if '"paradigm": "IS"' in user_prompt:
            return {
                "input_interpretation": "The idea reads as a causal or empirical phenomenon where identification and observable outcomes will determine research quality.",
                "candidate_research_questions": [
                    {
                        "question": "How does the introduction of platform transparency tools affect seller pricing behavior and buyer conversion?",
                        "why_this_matters": "Digital platforms keep adding transparency features, but the downstream behavioral and market effects are still unevenly understood.",
                        "best_fit_paradigm": {
                            "paradigm": "IS",
                            "rationale": "The question is strongest when framed around observable treatment variation, outcomes, and identification strategy.",
                        },
                        "potential_contribution": "An empirical design that links a common product intervention to measurable market responses and managerial implications.",
                        "risks_or_weaknesses": [
                            "Credible identification may be difficult without a clear rollout event or quasi-experiment.",
                            "Outcome measures may mix direct treatment effects with concurrent platform changes.",
                        ],
                        "suggested_next_step": "Specify the treatment, outcome, and one plausible identification strategy before refining the question further.",
                    },
                    {
                        "question": "Do automated recommendation systems reinforce incumbent seller advantage after a ranking policy change?",
                        "why_this_matters": "Recommendation systems shape digital competition, but ranking interventions may have unequal effects across seller types.",
                        "best_fit_paradigm": {
                            "paradigm": "IS",
                            "rationale": "This question depends on behavioral data, treatment timing, and empirical identification rather than analytical derivation.",
                        },
                        "potential_contribution": "A causal framing that connects platform design choices to competitive outcomes in digital markets.",
                        "risks_or_weaknesses": [
                            "Policy-change timing may not be exogenous.",
                        ],
                        "suggested_next_step": "Choose one platform event and define a clean before-after comparison design.",
                    },
                ],
            }

        return {
            "input_interpretation": "The idea points to a strategic phenomenon where a disciplined analytical model can clarify mechanisms, assumptions, and testable implications.",
            "candidate_research_questions": [
                {
                    "question": "How does disclosure timing change competitor pricing incentives in a repeated market setting?",
                    "why_this_matters": "Firms routinely choose when to disclose information, but the strategic consequences depend on how rivals update beliefs and respond.",
                    "best_fit_paradigm": {
                        "paradigm": "OM",
                        "rationale": "The core problem is a strategic interaction defined by actors, timing, information structure, and equilibrium behavior.",
                    },
                    "potential_contribution": "A cleaner model framing that isolates disclosure timing as a mechanism shaping competitive response.",
                    "risks_or_weaknesses": [
                        "The institutional setting may still be too broad.",
                        "The payoff mechanism may need sharper empirical motivation.",
                    ],
                    "suggested_next_step": "Specify the actors, the timing sequence, and the equilibrium concept before drafting propositions.",
                },
                {
                    "question": "When do platform governance rules create credible commitment in a two-sided market with strategic sellers?",
                    "why_this_matters": "Governance rules are central to platform strategy, but their effect on expectations and strategic compliance is often underspecified.",
                    "best_fit_paradigm": {
                        "paradigm": "OM",
                        "rationale": "The research problem is best framed as a stylized game where governance changes incentives and beliefs.",
                    },
                    "potential_contribution": "A mechanism-based contribution that clarifies when governance rules change equilibrium outcomes rather than simply documenting policy variety.",
                    "risks_or_weaknesses": [
                        "The setting could become too diffuse if multiple governance levers are included at once.",
                    ],
                    "suggested_next_step": "Choose one governance lever and one focal market before tightening the model scope.",
                },
            ],
        }

    @staticmethod
    def _build_design_review_payload() -> dict:
        return {
            "overall_assessment": "The project is directionally coherent but still needs sharper assumptions and a narrower institutional setting.",
            "issues": [
                {
                    "severity": "medium",
                    "issue": "Model scope remains broad relative to the stated contribution.",
                    "rationale": "The framing references multiple strategic mechanisms without choosing a focal one.",
                    "affected_module": "project framing",
                    "next_action": "Pick one mechanism and restate the contribution in one sentence.",
                },
                {
                    "severity": "medium",
                    "issue": "Empirical implications are not yet tightly linked to propositions.",
                    "rationale": "The design currently suggests validation intent but not a disciplined mapping from theory to observable implications.",
                    "affected_module": "model canvas",
                    "next_action": "Add one empirical implication for each central proposition.",
                },
            ],
        }
