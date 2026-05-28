# 04_WEEK2_VIBE_BUILD_PLAN: Vibe Coding Build And Audit Week

## 1. Week 2 Positioning

Week 2 is the implementation week for:

```text
Sprint 01: OpenClaw-Kernel
```

Week 1 built backend intuition, constraints, and test redlines. Week 2 uses Vibe Coding to build the working kernel under those constraints.

The goal is not to watch AI write code. The goal is to practice:

- writing tight tasks;
- keeping agents scoped;
- preventing context drift;
- reviewing generated code through tests and logs;
- forcing the system to satisfy SPEC rather than vibes;
- converting implementation into interview defense.

## 2. Build Principles

Week 2 follows these rules:

- Do not implement without a SPEC section.
- Do not accept code without tests or observable behavior.
- Do not let one agent touch unrelated layers.
- Do not chase UI, auth, Redis, Kafka, Celery, or real LLM integration.
- Keep files small and modular.
- Prefer one closed loop over broad unfinished features.
- Every day ends with audit notes and interview defense notes.

## 3. Suggested Day Plan

### Day 6: Scaffold, Contracts, And App Shell

Goal:

```text
Create the project skeleton and lock the external contracts.
```

Work:

- create app package;
- configure FastAPI;
- define Pydantic schemas for Session, Message, Job;
- define error models;
- write contract tests;
- create first README run notes.

Agent roles:

- Orchestrator;
- Contract Agent;
- QA Agent.

DoD:

- invalid payloads fail predictably;
- schema tests pass;
- route skeleton exists;
- no persistence or queue logic hidden inside route handlers.

### Day 7: Persistence And Migrations

Goal:

```text
Implement durable Session / Message / Job storage.
```

Work:

- SQLAlchemy async setup;
- models;
- repositories;
- Alembic migration;
- repository tests;
- route/service integration for `POST /sessions` and basic reads.

Agent roles:

- Persistence Agent;
- Backend Architect;
- QA Agent.

DoD:

- migration creates tables;
- repository tests prove persistence;
- service owns use-case decisions;
- route does not directly query database.

### Day 8: Queue, Dispatcher, And Worker

Goal:

```text
Implement the async message-processing path.
```

Work:

- define `QueueBackend` abstraction;
- implement `InMemoryAsyncQueue` with `asyncio.Queue`;
- create job enqueue service;
- create background worker lifecycle;
- fake LLM runner;
- status transitions: queued, running, completed, failed.

Agent roles:

- Async/Event Agent;
- Worker Agent;
- QA Agent.

DoD:

- submitting a message creates a job;
- worker consumes the job;
- assistant reply is persisted;
- job status changes are observable;
- queue limitations are documented.

### Day 9: Resilience, Observability, And Tests

Goal:

```text
Make failures visible and bounded.
```

Work:

- add transient/permanent fake LLM failures;
- bounded retry with backoff;
- structlog setup;
- trace_id propagation;
- HTTP boundary tests;
- queue behavior tests;
- failure-state tests.

Agent roles:

- Resilience Agent;
- Observability Agent;
- QA/Audit Agent.

DoD:

- every request/job has trace_id;
- retry attempts are logged;
- permanent failure does not retry forever;
- failed job status is persisted;
- tests cover main failure paths.

### Day 10: Audit, Documentation, And Portfolio Freeze

Goal:

```text
Turn the working kernel into a defensible portfolio artifact.
```

Work:

- run full test suite;
- perform `/audit`;
- update README;
- update SYSTEM_DESIGN;
- update TEST_PLAN;
- write INTERVIEW_NOTES;
- document trade-offs and upgrade path;
- prepare tag/commit if requested.

Agent roles:

- Auditor;
- Docs/Interview Agent;
- Orchestrator.

DoD:

- app runs locally;
- tests pass;
- logs prove end-to-end lifecycle;
- README explains run/test commands;
- interview notes contain attack and defense points;
- known limitations are explicit, not hidden.

## 4. Agent Expansion Strategy

Start with 4 roles:

```text
Orchestrator
Backend Architect
Implementer
QA / Auditor
```

Expand only when boundaries are stable:

```text
Contract Agent
Persistence Agent
Async/Event Agent
Worker Agent
Resilience Agent
Observability Agent
Docs/Interview Agent
```

The goal is to practice the mechanics of 10+ agent orchestration by the end of the sprint, not to create chaos on day one.

## 5. Review Checklist

Every generated module must be reviewed against:

- Does it satisfy SPEC?
- Does it belong to the right layer?
- Can it be tested in isolation?
- Does it leak infrastructure into business logic?
- Does it preserve trace_id?
- What happens on invalid input?
- What happens on transient failure?
- What happens on permanent failure?
- What happens if the worker is not running?
- What happens on process restart?

## 6. Final Interview Defense Themes

Prepare answers for:

- Why `asyncio.Queue` instead of Redis/Kafka/Celery?
- How would you replace the queue backend later?
- How do you prevent route handlers from becoming business logic?
- How do migrations differ from `create_all`?
- How do you trace a failed message from HTTP to worker?
- How do you distinguish transient vs permanent failures?
- What does this kernel borrow from OpenClaw, and what does it intentionally omit?
