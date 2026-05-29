# SYSTEM_DESIGN: OpenClaw-Kernel

> Status: Draft scaffold. This file contains an initial architecture sketch and open questions. Week 1 should turn experiments and trade-off discussions into explicit design decisions.

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

### Sprint File Usage

`00_START_HERE.md` is for the learner and coach agent. Week 2 Vibe Coding agents must treat `SPEC.md` as the highest technical constraint, `AGENT_RULES.md` as operating discipline, `SYSTEM_DESIGN.md` as architecture rationale, and `TEST_PLAN.md` as acceptance redlines.

`SPEC.md` must link implementation acceptance to `TEST_PLAN.md`; otherwise implementers may generate code without matching the intended tests.

### HTTP Boundary And Layer Ownership

For `POST /sessions/{session_id}/messages`:

```text
Client
  -> FastAPI/Pydantic boundary validates MessageCreateRequest
  -> route receives validated request
  -> MessageService.submit_user_message(session_id, request, trace_id)
  -> SessionRepository.get(session_id)
  -> MessageRepository.insert_user_message(...)
  -> JobRepository.insert_queued_job(...)
  -> database commit succeeds
  -> QueueBackend.enqueue(job_id, trace_id)
  -> route serializes MessageAcceptedResponse
  -> route returns 202 Accepted
```

Layer decisions:

- Pydantic validates payload shape and field constraints.
- Route maps HTTP input/output and service exceptions.
- Service owns use-case decisions and generates `message_id` / `job_id`.
- Repository owns persistence details.
- DB or repository owns `created_at`.
- QueueBackend owns dispatch implementation details.
- Middleware or route entry owns `trace_id` creation or propagation.

Client message submission accepts only `role=user`. Assistant messages are created by the worker.

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

### Job Table Versus Queue Item

The job table is the business state source of truth. It supports job status queries, recovery notes, auditability, and interview defense.

The queue item is an execution notification. For Sprint 01 it may be an in-memory `asyncio.Queue` item. In later versions it may become an SQS, Redis Streams, Celery, Kafka, or RabbitMQ message.

This is intentional duplication of identifiers, not duplicated responsibility:

```text
jobs table
  -> domain state machine
  -> queryable status
  -> recovery/audit source

queue item
  -> delivery mechanism
  -> worker wake-up / pull target
  -> not the source of business truth
```

### Enqueue After Commit

The service should create user message and job records inside a database transaction. Enqueue must happen only after the database commit succeeds.

This avoids a worker receiving a `job_id` before the job exists in the database.

Known risk:

```text
database commit succeeds
enqueue fails
```

This creates a half-success state: the job exists as queued in the database but may not be visible to the worker queue. Sprint 01 must make this observable through structured logs and documentation. Future options include recovery scanning, an `enqueue_failed` state, DB polling, or a transactional outbox.

### DB Polling Trade-Off

DB polling can avoid DB-plus-queue double-write risk because the job table itself becomes the worker source. It also supports API/worker process separation.

Trade-offs:

- polling adds database query load;
- indexes and batch size matter;
- multiple workers need atomic claim/lock behavior;
- batch polling improves performance but does not prevent duplicate processing;
- claim/lock protects correctness.

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
- Should Sprint 01 represent enqueue failure as `queued` plus logs, or add an explicit `enqueue_failed` status?
- Should Week 2 implement recovery scanning, or document it as a future upgrade?
