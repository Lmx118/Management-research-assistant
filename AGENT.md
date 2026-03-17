# AGENTS.md

## Product
This repo is for a Management Science Research Assistant.
The product serves three research paradigms:
- OR: optimization research
- OM: analytical / game-theoretic modeling research
- IS: empirical / causal / econometric research

The assistant is not a generic chatbot.
It is a workflow product for research design, literature positioning, writing assistance, and method-specific guidance.

## Product principles
- Prioritize a clean MVP over broad feature coverage.
- Build reusable modules instead of one-off pages.
- Keep outputs structured and reviewable.
- Prefer deterministic, transparent workflows where possible.
- Every feature should map to a concrete research task.

## MVP scope
Phase 1 MVP should include:
1. landing page
2. workspace selector: OR / OM / IS
3. one shared chat/research canvas
4. one structured output panel
5. first working module: research question generator
6. first working module: research design checker

Do not build all advanced features in v1.

## Tech stack
- Frontend: Next.js + TypeScript + Tailwind
- Backend: Python FastAPI
- Database: PostgreSQL
- Auth: simple placeholder auth for now unless explicitly requested
- API provider abstraction: model providers should be swappable
- Keep environment variables centralized

## Engineering rules
- Keep code modular and typed.
- Add comments only where they improve clarity.
- Avoid overengineering.
- Create clear folder structure.
- Add basic error handling for all API routes.
- Add loading, empty, and error states in the UI.

## UX rules
- The UI should feel like a serious research tool, not a toy chatbot.
- Use minimal, clean, academic-product styling.
- Prefer cards, tabs, side panels, and structured sections.
- Long outputs should be divided into:
  - Research Question
  - Contribution
  - Method Fit
  - Risks
  - Next Steps

## Task execution rules
For non-trivial tasks:
1. inspect relevant files first
2. propose a short implementation plan
3. implement in small steps
4. run relevant checks
5. summarize changed files and remaining risks

## Done means
A task is done only when:
- code compiles
- changed flows are testable manually
- obvious lint/type issues are resolved
- output matches the requested product behavior