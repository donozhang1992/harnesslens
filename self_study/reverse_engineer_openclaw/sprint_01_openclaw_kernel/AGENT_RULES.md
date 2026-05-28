# AGENT_RULES: Sprint 01

## 1. Operating Mode

This sprint uses Project-Driven Vibe Coding.

AI may generate code, but the human owns:

- scope;
- architecture;
- contracts;
- tests;
- acceptance;
- interview defense.

## 2. Context Discipline

- Work on one module at a time.
- Do not load unrelated files unless needed.
- Keep generated files small.
- Do not let one agent modify unrelated layers.
- Update TODO and design notes when decisions change.

## 3. Required Review Questions

For every implementation:

- Which layer owns this responsibility?
- What invalid input breaks it?
- What concurrent scenario breaks it?
- What failure is observable?
- What test proves it?
- What is the future replacement path?

## 4. Agent Roles

Start with:

- Orchestrator
- Backend Architect
- Implementer
- QA / Auditor

Optional expansion:

- Contract Agent
- Persistence Agent
- Async/Event Agent
- Worker Agent
- Resilience Agent
- Observability Agent
- Docs/Interview Agent

## 5. Prohibited Drift

Do not add:

- frontend polish;
- auth;
- real LLM APIs;
- Redis/Kafka/Celery;
- plugin marketplace;
- broad refactors unrelated to the current module.

## 6. Acceptance Standard

No code is done merely because it runs.

Done means:

- tested;
- logged;
- explainable;
- aligned with SPEC;
- defensible in interview.
