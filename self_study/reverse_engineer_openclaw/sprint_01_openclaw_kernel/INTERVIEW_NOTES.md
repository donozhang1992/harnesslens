# INTERVIEW_NOTES: OpenClaw-Kernel

> Status: Draft scaffold. These notes are placeholders for interview defense. They should be expanded during Week 1 and finalized after Week 2 implementation and audit.

## 1. Project Pitch

I built a lightweight OpenClaw-inspired AI Gateway kernel to demonstrate backend architecture for AI applications: strict message contracts, persisted conversation state, async job dispatch, resilient fake model execution, and traceable end-to-end logs.

## 2. Likely Interview Attacks

### Why use `asyncio.Queue` instead of Redis/Kafka/Celery?

Draft defense:

```text
For Sprint 01, the goal was to validate the async Gateway kernel with minimal infrastructure. `asyncio.Queue` lets me demonstrate producer/consumer flow, backpressure, worker lifecycle, and failure handling without external services. I know it is not durable or cross-process, so I isolate it behind a QueueBackend abstraction. In production, I would replace it with Redis Streams, Celery, Kafka, or RabbitMQ depending on durability and throughput requirements.
```

### How do you avoid route handlers becoming business logic?

Draft defense:

```text
Routes only translate HTTP into service calls and map service errors into HTTP responses. Business rules live in services, while persistence details live in repositories.
```

Expanded Day 1 defense:

```text
I keep POST /sessions/{id}/messages as an HTTP adapter only. Pydantic owns request validation, so invalid roles or empty content fail fast with 422 before entering business logic.

The service layer owns the use case: checking whether the session exists, creating the user message, creating the job, and deciding when to enqueue. The repository hides persistence details, so the route does not know SQLAlchemy models or table schemas. QueueBackend hides the dispatch mechanism, so Sprint 01 can start with asyncio.Queue and later move to Redis, SQS, or Kafka without changing the business flow.

This gives clean test boundaries, predictable error mapping, and a place to reason about async failure modes like DB commit succeeding while enqueue fails.
```

### Why keep a job table if SQS or Redis already persists queue messages?

Draft defense:

```text
The queue is a delivery mechanism, not the business source of truth. A job table records domain state: queued, running, completed, failed, ownership, failure reason, and queryable status for GET /jobs/{job_id}. SQS or Redis can deliver work to workers, but the application still needs its own state machine and audit trail.
```

### Why generate message_id and job_id in the application layer?

Draft defense:

```text
Generating IDs in the application layer lets the service attach the same identifiers to logs, database records, queue notifications, and responses before waiting for database-generated IDs. The important guardrail is ordering: generate IDs early, persist message and job in a transaction, commit, and only then enqueue the job.
```

### How do you debug a failed job?

Draft defense:

```text
Every request receives a trace_id, and job lifecycle logs include trace_id, session_id, job_id, event name, status transition, and error type. I can reconstruct the path from HTTP intake through enqueue, dequeue, worker execution, retry attempts, and final persistence.
```

## 3. Trade-Offs To Document

- In-memory queue vs durable queue.
- Job table as state source vs queue as delivery mechanism.
- Enqueue-after-commit risk vs transactional outbox.
- DB polling simplicity vs query load and duplicate-processing risk.
- Fake LLM runner vs real provider.
- SQLite vs PostgreSQL.
- Minimal API vs full OpenClaw plugin ecosystem.
- Local logs vs full tracing stack.

## 4. Final Notes

Update this file during Day 10 after the implementation and audit are complete.
