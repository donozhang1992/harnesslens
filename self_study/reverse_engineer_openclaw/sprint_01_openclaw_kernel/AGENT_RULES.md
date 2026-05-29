# AGENT_RULES: Sprint 01

> Operating rules for Vibe Coding control practice.

## 1. Operating Mode

This sprint uses Project-Driven Vibe Coding.

AI may generate code, but the human owns:

- scope;
- architecture;
- contracts;
- tests;
- acceptance;
- interview defense.

All agents must follow ADLC:

```text
Ask -> Explore -> Plan -> Code -> Verify
```

## 2. Context Discipline

- Work on one module at a time.
- Do not load unrelated files unless needed.
- Keep generated files small.
- Do not let one agent modify unrelated layers.
- Update TODO and design notes when decisions change.
- Before implementing, read `SPEC.md` and relevant `TEST_PLAN.md` sections.
- If behavior is not covered by `SPEC.md`, update the specification before implementing.
- If implementation reveals a new test redline, update `TEST_PLAN.md`.

## 3. Required Review Questions

For every implementation:

- Which layer owns this responsibility?
- What invalid input breaks it?
- What concurrent scenario breaks it?
- What provider failure breaks it?
- What timeout or rate-limit case breaks it?
- What failure is observable?
- What test proves it?
- What is the future replacement path?

## 4. Agent Roles

Start with:

- Orchestrator
- Backend Architect
- Implementer
- QA / Auditor

Expand by boundary:

- Contract Agent
- Persistence Agent
- Async/Event Agent
- Provider Adapter Agent
- Frontend Console Agent
- Resilience Agent
- Observability Agent
- Docs/Interview Agent

Do not run many agents at once just to look advanced. Add agents only when the boundary is clear.

## 5. Prohibited Drift

Do not add:

- frontend polish beyond the minimum console;
- auth;
- RAG;
- LangGraph;
- Redis/Kafka/Celery;
- plugin marketplace;
- broad refactors unrelated to the current module;
- multiple real providers when one representative provider plus fake adapter is enough.

Do not place:

- database access inside route handlers;
- provider SDK calls inside route handlers;
- SQLAlchemy ORM models inside response contracts;
- raw unvalidated dictionaries across service boundaries;
- concrete queue implementation details inside business services.

## 6. Provider Discipline

- Use fake provider for tests.
- Use AWS Bedrock as the cloud-provider experiment when practical.
- Keep OpenAI/Anthropic/Gemini/Azure OpenAI as comparison knowledge unless explicitly scoped.
- Do not hard-code provider-specific response shapes outside adapters.

## 7. Frontend Discipline

- Build a minimum Gateway Console only.
- Do not create a landing page.
- Do not spend time on polish before streaming and metadata work.
- The frontend proves the full-stack loop; it is not the product focus.

## 8. Acceptance Standard

No code is done merely because it runs.

Done means:

- tested;
- logged;
- explainable;
- aligned with SPEC;
- aligned with TEST_PLAN;
- visible in the frontend when relevant;
- defensible in interview.

