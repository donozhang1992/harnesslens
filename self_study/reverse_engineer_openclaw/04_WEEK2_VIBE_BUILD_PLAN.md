# 04_WEEK2_VIBE_BUILD_PLAN: Full-Stack Gateway Build And Audit Week

## 1. Week 2 Positioning

Week 2 implements Sprint 01:

```text
OpenClaw-Kernel: a minimum full-stack AI Gateway.
```

Week 1 created the SPEC, tests, architecture decisions, and interview defenses. Week 2 uses Vibe Coding to build the app under those constraints.

The goal is not to watch AI write code. The goal is to practice directing AI through:

- precise scoped tasks;
- agent boundary control;
- implementation review;
- tests;
- logs;
- frontend/backend contract alignment;
- interview-ready explanation.

## 2. Build Principles

- Do not implement without reading `SPEC.md`.
- Do not accept code without tests or observable behavior.
- Do not let one agent touch unrelated layers.
- Keep the frontend to the minimum gateway console; spend time on streaming, metadata, and full-stack proof.
- Do not add RAG, LangGraph, auth, Redis, Kafka, or Celery.
- Keep one closed loop working before adding secondary paths.
- Use fake provider for deterministic tests.
- Use real/AWS Bedrock provider path as the representative integration when credentials and time allow.
- Every day ends with docs, tests, and interview notes updated.

## 3. Day 6: Scaffold, Contracts, App Shell, ADLC Rules

Goal:

```text
Create the project skeleton and lock external contracts.
```

Work:

- create FastAPI backend package;
- create Next.js 15 frontend app shell;
- add TypeScript/Tailwind/shadcn baseline where practical;
- define Pydantic schemas for Session, Message, Job, TokenUsage, ProviderConfig;
- define frontend contract types or documented API shapes;
- create `CLAUDE.md` or equivalent rule file;
- write first contract tests;
- document run commands.

Agent roles:

- Orchestrator;
- Contract Agent;
- Frontend Console Agent;
- QA Agent.

Definition of Done:

- backend and frontend can start separately;
- invalid payload contract tests exist;
- frontend has a minimal page shell;
- no persistence or provider logic hidden inside route handlers;
- project rules are visible to future agents.

## 4. Day 7: Persistence, Migrations, Core APIs

Goal:

```text
Implement durable Session / Message / Job / TokenUsage storage.
```

Work:

- SQLAlchemy async setup;
- models and repositories;
- Alembic migration;
- repository tests;
- `POST /sessions`;
- `GET /sessions/{id}`;
- `POST /sessions/{id}/messages` non-stream acceptance path;
- `GET /sessions/{id}/messages`;
- `GET /jobs/{id}`.

Agent roles:

- Persistence Agent;
- Backend Architect;
- QA Agent.

Definition of Done:

- migration creates tables;
- repository tests prove persistence;
- service owns use-case decisions;
- route does not directly query database;
- transaction failure does not leave inconsistent state.

## 5. Day 8: Provider Adapter, SSE Streaming, Token Cost

Goal:

```text
Implement the AI Gateway behavior.
```

Work:

- provider adapter interface;
- fake streaming provider;
- AWS Bedrock adapter experiment or concrete adapter stub with setup notes;
- SSE endpoint;
- token counting / cost estimation;
- TTFT and total latency capture where practical;
- frontend connects to SSE and renders streamed output;
- UI displays trace_id, provider/model, token estimate, and cost estimate.

Agent roles:

- Provider Adapter Agent;
- Frontend Console Agent;
- Observability Agent;
- QA Agent.

Definition of Done:

- frontend can send a message and receive streamed chunks;
- fake provider is deterministic in tests;
- token/cost metadata is returned or persisted;
- provider interface prevents lock-in;
- SSE behavior is testable.

## 6. Day 9: Queue Worker, Resilience, Observability, Full Tests

Goal:

```text
Make async background work and failures visible, bounded, and testable.
```

Work:

- `QueueBackend` abstraction;
- `asyncio.Queue` implementation;
- background worker lifecycle;
- job status transitions;
- bounded retry with backoff;
- timeout handling;
- transient vs permanent provider error classification;
- structlog configuration;
- trace_id propagation;
- HTTP, provider, queue, persistence, and observability tests.

Agent roles:

- Async/Event Agent;
- Resilience Agent;
- Observability Agent;
- QA/Audit Agent.

Definition of Done:

- submitting a message can create a job;
- worker can process a job through fake provider;
- retry attempts are logged;
- permanent failures do not retry forever;
- failed job status is inspectable;
- no app-level `print()` calls;
- tests cover main failure paths.

## 7. Day 10: Audit, Documentation, Demo, Portfolio Freeze

Goal:

```text
Turn the working gateway into a defensible portfolio artifact.
```

Work:

- run backend tests;
- run frontend build/typecheck if configured;
- perform architecture audit;
- update README;
- update SYSTEM_DESIGN;
- update TEST_PLAN;
- finalize INTERVIEW_NOTES;
- write demo script;
- prepare portfolio summary.

Agent roles:

- Auditor;
- Docs/Interview Agent;
- Orchestrator.

Definition of Done:

- app runs locally;
- tests pass or failures are explicitly documented;
- frontend demo path works;
- logs prove end-to-end lifecycle;
- README explains setup/run/test commands;
- interview notes contain attack/defense points;
- known limitations are explicit, not hidden.

## 8. Agent Expansion Strategy

Start with:

```text
Orchestrator
Backend Architect
Implementer
QA / Auditor
```

Expand only by clear boundary:

```text
Contract Agent
Persistence Agent
Async/Event Agent
Provider Adapter Agent
Frontend Console Agent
Resilience Agent
Observability Agent
Docs/Interview Agent
```

The goal is to learn 10+ agent orchestration control, not to create ten simultaneous sources of drift.

## 9. Review Checklist

Every generated module must answer:

- Does it satisfy `SPEC.md`?
- Does it belong to the right layer?
- Can it be tested in isolation?
- Does it leak infrastructure into business logic?
- Does it preserve `trace_id`?
- What happens on invalid input?
- What happens on timeout?
- What happens on rate limit?
- What happens on permanent provider failure?
- What happens if the worker is not running?
- What happens on process restart?
- What does the frontend prove?

## 10. Final Interview Defense Themes

Prepare answers for:

- How do you use AI coding tools without losing deterministic control?
- Why FastAPI and Pydantic for the gateway?
- How does SSE work and why use it here?
- Why AWS Bedrock as the representative cloud provider?
- How do you compare Bedrock, Azure OpenAI, OpenAI, Anthropic, and Gemini at a high level?
- How do you handle timeout and rate limits?
- How do you estimate token cost?
- Why `asyncio.Queue` instead of Redis/Kafka/Celery?
- How would you replace the queue backend later?
- How do you trace a failed request from browser to provider/worker?
- What did this project borrow from OpenClaw, and what did it intentionally omit?
