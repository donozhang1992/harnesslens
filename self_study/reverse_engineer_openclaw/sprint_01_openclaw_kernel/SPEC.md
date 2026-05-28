# SPEC: OpenClaw-Kernel

> Status: Draft scaffold. This is not a finished specification. Week 1 should progressively tighten this file as backend boundaries, failure modes, and acceptance rules become clearer.

## 1. Hard Constraints

- Use FastAPI for HTTP boundaries.
- Use Pydantic for every external request and response contract.
- Use route -> service -> repository layering.
- Do not pass raw unvalidated dicts across boundaries.
- Use SQLAlchemy async for persistence.
- Use Alembic for schema migration workflow.
- Use `asyncio.Queue` through a `QueueBackend` abstraction.
- Use structlog or an equivalent structured logging setup.
- Propagate `trace_id` across route, service, queue, worker, and repository logs.
- Use pytest for tests.
- Do not use `print()` in application code.

## 2. Domain Concepts

Minimum concepts:

- Session
- Message
- Job

Minimum message roles:

- user
- assistant
- system

Minimum job statuses:

- queued
- running
- completed
- failed

## 3. Required Endpoints

Draft endpoints:

```text
POST /sessions
GET /sessions/{session_id}
POST /sessions/{session_id}/messages
GET /sessions/{session_id}/messages
GET /jobs/{job_id}
```

Endpoint details can change during Week 1, but all changes must be reflected here before implementation.

## 4. Async Dispatch Rules

- Submitting a user message creates a job.
- The HTTP request should not synchronously generate the assistant reply.
- The worker consumes jobs from `QueueBackend`.
- The fake LLM runner can simulate success, transient failure, and permanent failure.
- Job status changes must be persisted or otherwise inspectable.

## 5. Failure Rules

- Invalid payloads fail at Pydantic boundary.
- Missing session returns a clear not-found error.
- Transient fake model failures may retry with bounded backoff.
- Permanent fake model failures fail fast.
- Final job failure must be observable through job status and logs.

## 6. Observability Rules

Every important log event should include:

- trace_id
- session_id when available
- job_id when available
- event name
- status or transition
- error type when applicable

## 7. Review Rule

Generated code is not accepted until it satisfies:

- SPEC alignment;
- tests;
- layer ownership;
- observable behavior;
- documented limitations.
