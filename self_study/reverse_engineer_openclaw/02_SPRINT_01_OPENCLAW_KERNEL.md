# 02_SPRINT_01_OPENCLAW_KERNEL: Two-Week Sprint Plan

## 1. Sprint Name

```text
Sprint 01: OpenClaw-Kernel
```

Subtitle:

```text
A minimum full-stack AI Gateway with streaming, token accounting, and deterministic AI-development discipline.
```

## 2. Sprint Goal

Build a small but defensible AI Gateway kernel that demonstrates:

- FastAPI backend boundary design;
- Pydantic request/response contracts;
- SQLAlchemy async persistence and Alembic migrations;
- async job dispatch with `asyncio.Queue`;
- SSE streaming for LLM-style responses;
- one real native provider path or AWS Bedrock experiment;
- timeout and rate-limit retry handling;
- token usage and cost estimation;
- structured observability with `trace_id`;
- a minimal Next.js 15 frontend console;
- ADLC-based Vibe Coding discipline;
- interview-ready trade-off reasoning.

This sprint is both a learning sprint and a portfolio sprint.

## 3. Source Of Truth For Sprint 01

The target is not “whatever a demo happens to run.” The target is the Definition of Done below.

The project is complete only when a new reviewer can run the app, submit a message from the frontend, observe a streaming response or job lifecycle, inspect logs/tests, and hear a credible interview defense.

## 4. Core Product Loop

```text
User
  -> Next.js gateway console
  -> submits message
  -> FastAPI validates Pydantic payload
  -> service persists session/message/job
  -> gateway either streams via SSE or enqueues background job
  -> provider adapter calls real or fake LLM backend
  -> retry/timeout policy handles transient failures
  -> token usage and estimated cost are recorded
  -> assistant response is persisted
  -> UI shows response, trace_id, token/cost, and job status
```

## 5. Must Include

Backend:

- FastAPI HTTP boundary.
- Pydantic request/response contracts.
- Route/service/repository layering.
- SQLAlchemy async persistence.
- Alembic migration workflow.
- Session, Message, Job, and TokenUsage concepts.
- `asyncio.Queue` through a `QueueBackend` abstraction.
- Worker path for background job processing.
- Fake provider for deterministic tests.

AI Gateway:

- SSE streaming endpoint.
- Native provider adapter interface.
- AWS Bedrock experiment as the cloud-provider representative if credentials are available.
- At least one provider path that can be run or convincingly mocked behind the same interface.
- Timeout handling.
- Rate-limit/transient-error retry with bounded backoff.
- Token counting and cost estimation.
- TTFT and total latency measurement fields where practical.

Frontend:

- Next.js 15.
- React.
- TypeScript.
- Tailwind CSS.
- shadcn/ui where useful.
- Minimal chat/gateway console.
- Display streaming response, trace_id, token/cost estimate, and job status.
- No UI polish rabbit hole.

Engineering Discipline:

- ADLC flow: Ask -> Explore -> Plan -> Code -> Verify.
- `CLAUDE.md` or equivalent project rule file.
- Agent rules and scoped implementation prompts.
- pytest coverage for core boundaries.
- lint/typecheck/build commands documented.
- No app-level `print()`.
- Structured logs with `trace_id`.
- Interview notes updated daily.

## 6. Non-Goals

Do not implement in Sprint 01:

- full OpenClaw port;
- real plugin system;
- real chat-channel integrations;
- Redis/Kafka/Celery production queue;
- LangGraph or multi-agent runtime;
- RAG;
- full auth/user-management;
- polished frontend product design;
- Kubernetes or production cloud deployment.

## 7. Week 1: Backend And AI Gateway Immersion

Week 1 is not a full build week.

Goal:

```text
Build backend, streaming, provider, retry, token-cost, and observability intuition.
Freeze the SPEC that controls Week 2 Vibe Coding.
```

Daily focus:

- Day 1: HTTP boundary, Pydantic contracts, route/service split.
- Day 2: persistence, SQLAlchemy async, transactions, Alembic, token-usage schema.
- Day 3: `asyncio.Queue`, worker lifecycle, backpressure, queue vs SSE boundary.
- Day 4: provider adapter, AWS Bedrock experiment, timeout, rate-limit retry, fake provider.
- Day 5: SSE mini experiment, token/cost calculator, trace_id logging, final SPEC freeze.

Deliverables:

- revised `PRD.md`;
- revised `SPEC.md`;
- revised `SYSTEM_DESIGN.md`;
- revised `TEST_PLAN.md`;
- revised `AGENT_RULES.md`;
- revised `INTERVIEW_NOTES.md`;
- daily mini-experiment notes;
- Week 2 implementation TODO.

Main guide:

- [03_WEEK1_BACKEND_IMMERSION.md](./03_WEEK1_BACKEND_IMMERSION.md)

## 8. Week 2: Vibe Coding Build And Audit

Week 2 turns the Week 1 SPEC into a working full-stack gateway.

Goal:

```text
Use AI for high-throughput implementation while humans control architecture, tests, logs, and acceptance.
```

Daily focus:

- Day 6: scaffold FastAPI + Next.js app shell and contracts.
- Day 7: persistence, migrations, and core APIs.
- Day 8: provider adapter, SSE streaming, token/cost accounting.
- Day 9: queue worker path, resilience, logs, and tests.
- Day 10: audit, README, demo script, interview notes, portfolio freeze.

Main guide:

- [04_WEEK2_VIBE_BUILD_PLAN.md](./04_WEEK2_VIBE_BUILD_PLAN.md)

## 9. Agent Orchestration Progression

Do not start with 10+ agents blindly.

Start small:

```text
Orchestrator
Backend Architect
Implementer
QA / Auditor
```

Expand by boundary:

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

Sprint target:

```text
By the end of Sprint 01, understand how to control a 10+ agent workflow,
even if the first implementation uses fewer explicit agents at once.
```

## 10. Definition Of Done

Sprint 01 is complete when:

- the app can be run locally;
- the Next.js console can submit a message;
- FastAPI validates invalid payloads with Pydantic;
- session/message/job data is migration-backed;
- at least one streaming response path works through SSE;
- a provider adapter exists and has a fake provider for deterministic tests;
- AWS Bedrock is either tested locally or documented as a concrete adapter experiment with setup notes;
- timeout and retry behavior are testable;
- token usage and estimated cost are visible in API/UI/logs;
- `trace_id` appears across route, service, provider/worker, and persistence logs;
- `asyncio.Queue` worker path is implemented or explicitly scoped as the background path;
- tests cover contracts, persistence, SSE/provider behavior, retry, and observability;
- README explains run/test/build commands;
- interview notes cover AI coding workflow, SSE, token cost, provider choice, retry, and queue trade-offs.

## 11. Interview Story

The sprint should be explainable as:

```text
I built a minimum full-stack AI Gateway kernel inspired by OpenClaw.
The goal was not to copy OpenClaw, but to isolate the engineering pattern:
validated message intake, persisted conversation state, streaming model output,
provider abstraction, bounded retry, token-cost visibility, async background work,
and traceable end-to-end behavior.
```

Strong defense points:

- strict contracts;
- layered backend architecture;
- SSE streaming;
- provider abstraction;
- AWS Bedrock as the cloud-provider representative;
- bounded retry and timeout;
- token economics;
- structured logs and trace_id;
- minimal but real Next.js console;
- clear upgrade path to durable queues and production tracing.

