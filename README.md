# Management Science Research Assistant

Structured research workflow product for Management Science projects across:

- `OM`: analytical and game-theoretic modeling
- `OR`: optimization research
- `IS`: empirical, causal, and econometric research

This MVP is intentionally narrow. It prioritizes a real research workflow over a generic chat experience.

## What v1 includes

- landing page and paradigm-aware project creation
- single-user local workspace with persistent project context
- shared research-question generator
- shared research-design checker
- daily homepage digest of recent INFORMS journal articles with AI summaries
- flagship `OM Model Canvas`
- lighter but real `OR Problem Frame` and `IS Study Frame`

## Repo layout

```text
apps/
  api/          FastAPI backend
  web/          Next.js frontend
packages/
  api-client/   Typed API client used by the frontend
docs/
  architecture/
  product/
```

## Local Docker development

1. Copy `.env.example` to `.env`.
2. Keep `LLM_PROVIDER=stub` for the initial scaffold, or fill in `OPENAI_COMPATIBLE_API_KEY` if you want live model output.
3. Run:

```bash
docker compose up --build
```

Services:

- Web: `http://localhost:3000`
- API: `http://localhost:8000`
- API health: `http://localhost:8000/api/v1/health`
- API docs: `http://localhost:8000/docs`

The Docker setup intentionally uses two API URLs:

- `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1`
  Used by the browser.
- `API_BASE_URL_INTERNAL=http://api:8000/api/v1`
  Used by Next.js server-side rendering inside the `web` container.

## Manual development

Frontend:

```powershell
npm.cmd install
npm.cmd run dev --workspace @research-assistant/web
```

Backend requires Python 3.13+ and a running PostgreSQL database. From `apps/api`:

```powershell
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

If your machine uses `py` instead of `python`, replace the command prefix accordingly.

## Initial user flow

1. Open `http://localhost:3000`.
2. Click `Start a workspace`.
3. Choose `OR`, `OM`, or `IS`.
4. Create a project.
5. Enter the workspace and review the structured output panels.

## Troubleshooting

If project creation shows `Failed to fetch` or `Cannot reach the API`:

1. Confirm the API is running at `http://localhost:8000/api/v1/health`.
2. If using Docker, run `docker compose up --build`.
3. If using manual development, start the FastAPI server before submitting the form.

## LLM provider

`LLM_PROVIDER=stub` gives deterministic local responses for UI testing.

`LLM_PROVIDER=openai_compatible` uses:

- `OPENAI_COMPATIBLE_BASE_URL`
- `OPENAI_COMPATIBLE_API_KEY`
- `OPENAI_COMPATIBLE_MODEL`
- `CROSSREF_MAILTO` is optional but recommended for the homepage INFORMS article digest

The provider is isolated in the backend so model backends can be swapped later.
