# 02_SPRINT_01_OPENCLAW_KERNEL: Two-Week Sprint Plan

## 1. Sprint Name

```text
Sprint 01: OpenClaw-Kernel
```

Subtitle:

```text
A lightweight AI Gateway with observable async event dispatch.
```

## 2. Sprint Goal

Build a small but defensible OpenClaw-inspired kernel that demonstrates:

- backend boundary design;
- async job dispatch;
- persistence and migrations;
- resilient fake model execution;
- structured observability;
- Vibe Coding orchestration;
- interview-ready trade-off reasoning.

This sprint is both a learning sprint and a portfolio sprint.

## 3. Core Loop

The minimum system loop is:

```text
Client
  -> POST /sessions
  -> POST /sessions/{session_id}/messages
  -> FastAPI route validates Pydantic payload
  -> service persists user message
  -> service enqueues agent job
  -> endpoint returns job_id / accepted status
  -> async worker consumes job
  -> fake LLM runner creates assistant reply
  -> repository persists reply and job status
  -> client queries messages or job status
  -> trace_id connects the whole lifecycle
```

## 4. Scope

Must include:

- FastAPI HTTP boundary.
- Pydantic request / response contracts.
- Route / service / repository layering.
- SQLAlchemy async persistence.
- Alembic migration workflow.
- Session, Message, Job concepts.
- `asyncio.Queue` backed in-memory event bus.
- Async worker / dispatcher.
- Fake LLM runner.
- Retry with bounded backoff for transient fake failures.
- Structured JSON logs with trace_id.
- Tests for contracts, persistence, queue behavior, and HTTP boundary.
- Interview notes explaining limitations and upgrade path.

## 5. Non-Goals

Do not implement in Sprint 01:

- Full OpenClaw port.
- Real plugin system.
- Real Discord / Telegram / WhatsApp channels.
- Real OpenAI / Anthropic integration.
- Redis / Kafka / Celery.
- LangGraph.
- RAG.
- Full auth.
- UI polish.
- Kubernetes or cloud deployment.

These are future sprint options.

## 6. Week 1: Backend Immersion And SPEC

Week 1 is not a full build week.

Goal:

```text
Build backend intuition and freeze the design constraints that will control Week 2 Vibe Coding.
```

Deliverables:

- data-flow diagrams;
- failure-mode notes;
- small observable experiments;
- test redlines;
- draft `PRD.md`;
- draft `SPEC.md`;
- draft `AGENT_RULES.md`;
- draft `SYSTEM_DESIGN.md`;
- draft `TEST_PLAN.md`.

Main guide:

- [03_WEEK1_BACKEND_IMMERSION.md](./03_WEEK1_BACKEND_IMMERSION.md)

## 7. Week 2: Vibe Coding Build And Audit

Week 2 turns the Week 1 SPEC into a working project.

Goal:

```text
Use AI for high-throughput implementation while humans control architecture, tests, logs, and acceptance.
```

Deliverables:

- runnable `sprint_01_openclaw_kernel` app;
- tests passing;
- structured logs showing end-to-end trace;
- README with run instructions;
- interview notes with attack/defense Q&A;
- tag-ready portfolio snapshot.

Main guide:

- [04_WEEK2_VIBE_BUILD_PLAN.md](./04_WEEK2_VIBE_BUILD_PLAN.md)

## 8. Agent Orchestration Progression

Do not start with 10+ agents blindly.

Start small:

```text
Stage 1:
  Orchestrator
  Backend Architect
  Implementer
  QA / Auditor
```

Then expand:

```text
Stage 2:
  Contract Agent
  Persistence Agent
  Async/Event Agent
  Observability Agent
  Docs/Interview Agent
```

Sprint target:

```text
By the end of Sprint 01, understand how to control a 10+ agent workflow,
even if the first implementation uses fewer explicit agents.
```

## 9. Definition Of Done

Sprint 01 is complete when:

- a session can be created;
- a message can be submitted;
- submitting a message creates a job;
- the worker processes the job asynchronously;
- a fake assistant reply is persisted;
- job status can be inspected;
- invalid payloads are rejected by Pydantic;
- database schema is migration-backed;
- logs expose trace_id / session_id / job_id lifecycle;
- tests cover the main boundaries;
- limitations are clearly documented;
- interview defense notes explain why `asyncio.Queue` is acceptable for Sprint 01 and when to replace it.

## 10. Interview Story

The sprint should be explainable as:

```text
I built a lightweight OpenClaw-inspired AI Gateway kernel.
The goal was not to copy OpenClaw, but to isolate its core backend pattern:
validated message intake, persisted conversation state, async task dispatch,
resilient worker execution, and observable end-to-end traces.
```

The strongest defense points:

- strict contracts;
- layered architecture;
- explicit async dispatch;
- migration-backed persistence;
- bounded retry;
- structured logs;
- clear upgrade path to Redis/Kafka/Celery without changing business logic.
