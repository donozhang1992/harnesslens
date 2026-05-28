# SYSTEM_DESIGN: OpenClaw-Kernel

## 1. Target Architecture

```text
FastAPI route
  -> Pydantic schema
  -> service
  -> repository
  -> SQLAlchemy AsyncSession
  -> database

message service
  -> QueueBackend
  -> asyncio.Queue
  -> worker
  -> fake LLM runner
  -> repository
```

## 2. Data Lifecycle

```text
Client submits message
  -> payload validated
  -> user message persisted
  -> job created
  -> job enqueued
  -> worker marks job running
  -> fake LLM runner returns reply or error
  -> assistant reply persisted on success
  -> job completed or failed
  -> client queries job/messages
```

## 3. Key Design Decisions

### Use `asyncio.Queue` For Sprint 01

Reason:

- fastest way to learn async dispatch and backpressure;
- no external service dependency;
- enough to demonstrate producer/consumer architecture.

Known limitations:

- in-memory jobs are lost on process restart;
- not cross-process;
- not durable;
- not suitable for production queueing.

Upgrade path:

- Redis Streams;
- Celery + Redis;
- Kafka;
- RabbitMQ.

The queue must be hidden behind a `QueueBackend` abstraction.

### Use Fake LLM Runner

Reason:

- focus on backend architecture and failure handling;
- avoid API key, cost, and provider drift;
- simulate success, transient errors, and permanent errors deterministically.

## 4. Open Questions

These questions are intentionally left open at sprint start.

They should be answered during Week 1 backend immersion and written back into `SPEC.md` / `SYSTEM_DESIGN.md` before Week 2 implementation begins.

- Should job state be persisted in DB from day one, or start in memory during experiments?
- Should worker lifecycle be controlled through FastAPI lifespan?
- What is the exact minimum set of job status fields?
- How should trace_id be injected and propagated?
