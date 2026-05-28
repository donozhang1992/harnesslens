# INTERVIEW_NOTES: OpenClaw-Kernel

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

### How do you debug a failed job?

Draft defense:

```text
Every request receives a trace_id, and job lifecycle logs include trace_id, session_id, job_id, event name, status transition, and error type. I can reconstruct the path from HTTP intake through enqueue, dequeue, worker execution, retry attempts, and final persistence.
```

## 3. Trade-Offs To Document

- In-memory queue vs durable queue.
- Fake LLM runner vs real provider.
- SQLite vs PostgreSQL.
- Minimal API vs full OpenClaw plugin ecosystem.
- Local logs vs full tracing stack.

## 4. Final Notes

Update this file during Day 10 after the implementation and audit are complete.
