# Architecture Overview

## Principles

- Keep the product workflow-first.
- Treat OR, OM, and IS as related but not identical.
- Separate shared workflow primitives from paradigm-specific canvases.
- Keep LLM usage schema-driven and reviewable.

## Current system

- `apps/web`: Next.js App Router frontend for project setup, workspace navigation, and structured panels.
- `apps/api`: FastAPI backend with project, canvas, and artifact APIs.
- `packages/api-client`: typed client wrapper shared by the frontend.
- PostgreSQL stores projects, canvases, and generated artifacts.

## Domain model

- `Project`: stable research context for one workspace.
- `Canvas`: paradigm-specific structured framing state.
- `Artifact`: persisted output from generators and checkers.

This keeps the core workflow stable while allowing new paradigms and modules to be added incrementally.

