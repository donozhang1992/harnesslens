# SYSTEM_DESIGN: OpenClaw-Kernel

> Status: Sprint 01 working design. Keep this file aligned with SPEC and TEST_PLAN.

## 1. Target Architecture

```text
Browser / Next.js Gateway Console
  -> FastAPI route
  -> Pydantic schema
  -> service
  -> repository
  -> SQLAlchemy AsyncSession
  -> SQLite database

FastAPI streaming path
  -> provider adapter
  -> fake provider or AWS Bedrock adapter
  -> SSE chunks
  -> frontend streaming UI

message service background path
  -> QueueBackend
  -> asyncio.Queue
  -> worker
  -> provider adapter / fake provider
  -> repository
```

## 2. Data Lifecycle

```text
User submits message
  -> frontend creates request
  -> FastAPI assigns or accepts trace_id
  -> Pydantic validates payload
  -> service checks session
  -> user message persisted
  -> job/token metadata initialized
  -> provider adapter called directly for SSE path
     OR job enqueued for worker path
  -> assistant chunks stream to frontend
  -> final assistant message and token usage persisted
  -> logs reconstruct lifecycle through trace_id
```

## 3. Layer Ownership

- Frontend owns user interaction and display of response/metadata.
- Route owns HTTP translation.
- Pydantic owns external contract validation.
- Service owns use-case decisions.
- Repository owns persistence details.
- Provider adapter owns SDK-specific calls.
- QueueBackend owns dispatch implementation details.
- Worker owns background execution.
- Logging middleware or route entry owns trace_id creation/propagation.

## 4. Queue vs SSE Boundary

SSE and queueing solve different problems:

```text
SSE:
  server -> browser streaming transport
  useful for token-by-token UX and TTFT measurement

Queue:
  producer -> worker background dispatch
  useful for buffering, async jobs, retries, and status inspection
```

Sprint 01 may use both:

- SSE path demonstrates AI Gateway streaming.
- Queue path demonstrates backend async dispatch and worker lifecycle.

The two paths must share provider adapter, logging, and error-classification concepts where practical.

## 5. Provider Strategy

Use a provider adapter interface to avoid provider lock-in.

Representative depth:

- AWS Bedrock is the cloud-provider experiment because the learner knows AWS well.
- OpenAI/Anthropic/Gemini/Azure OpenAI are comparison surfaces, not all mandatory implementations.
- Fake provider is mandatory for tests.

Provider adapter must normalize:

- input messages;
- model/provider config;
- streaming chunks;
- errors;
- token usage;
- latency;
- trace_id logging.

## 6. Persistence Decisions

Minimum tables/concepts:

- sessions;
- messages;
- jobs;
- token_usage as first-class observability data.

Transaction rule:

```text
Create user message + job + initial metadata in one transaction.
Commit before enqueue.
```

Sprint 01 uses service-owned transaction boundaries rather than a custom Unit of Work abstraction. This avoids overengineering while preserving the key consistency rule: a user `Message` and its processing `Job` must be created atomically.

Repositories do not commit because they do not know the full business workflow. They own ORM query/add details, while services decide which operations belong to the same transaction using SQLAlchemy `AsyncSession.begin()` or an equivalent transaction manager.

The phrase "no transaction" should be avoided for this design discussion. The actual failure mode is "no shared business transaction": individual database operations may still be transactional, but the full user-message-plus-job workflow is not atomic.

Known risk:

```text
database commit succeeds
enqueue fails
```

Queue enqueue happens after commit because the queue is an execution signal, not the source of truth. Workers should only receive job IDs that refer to durable database records.

If enqueue fails after commit, the persisted job remains recoverable through `enqueue_status`, structured logs, and a startup, scheduled, or explicit recovery scan. Future production options include transactional outbox, recovery scanner, or queue-as-source alternatives.

Recovery and multi-worker execution must be idempotency-aware. Sprint 01 does not need a full exactly-once design, but it should guard job status transitions so completed jobs are not processed again. Future production work should also prevent duplicate assistant messages and duplicate final usage records when jobs are re-enqueued, retried, or picked up by competing workers.

## 7. Alembic Decision

Alembic is treated as schema lifecycle management inside the codebase, but outside request runtime.

SQLAlchemy models represent the application's current intended ORM/table shape: tables, columns, relationships, constraints, indexes, and Python mappings.

Alembic migration files represent incremental schema changes from one database revision to the next. The database `alembic_version` table records which revision a database has reached.

Alembic owns schema initialization and evolution for the main application schema. Environment setup scripts may still create the database, database user, permissions, containers, or seed data, but table creation and schema evolution should be performed through `alembic upgrade head`.

Application startup must not call `Base.metadata.create_all()` for the main schema because schema changes should not happen as an implicit runtime side effect. `create_all()` can create missing tables, but it does not provide a versioned, reviewable migration workflow.

Autogenerated migrations are only drafts. They must be reviewed because schema changes can lose data, break compatibility, or drift away from the application contract.

## 8. Why `asyncio.Queue` In Sprint 01

Reasons:

- fastest way to learn producer/consumer flow;
- no external infrastructure;
- enough to demonstrate backpressure and worker lifecycle;
- easy to test.

Limitations:

- in-memory jobs are lost on process restart;
- not cross-process;
- not durable;
- not suitable for production queueing.

Upgrade paths:

- AWS SQS for cloud-native managed queue;
- Redis Streams;
- Celery + Redis;
- Kafka;
- RabbitMQ.

The queue must stay behind `QueueBackend`.

## 9. Token Economics

Sprint 01 should record or estimate:

- trace_id;
- session_id;
- trigger_message_id;
- assistant_message_id when available;
- job_id when available;
- execution_mode;
- prompt_tokens;
- completion_tokens;
- total_tokens;
- estimated_cost;
- currency;
- cost_source;
- provider;
- model;
- TTFT when streaming;
- total latency.

Exact pricing may be configured manually for the chosen model. The important skill is not memorizing every price; it is showing cost-aware gateway design.

`TokenUsage` is modeled per provider invocation, not only per assistant message, so the gateway can later support multi-step AI workflows without redesigning cost tracking.

The Sprint 01 relationship rule is:

```text
TokenUsage.trigger_message_id:
  required, because every gateway provider call must be traceable to the user message that triggered it.

TokenUsage.assistant_message_id:
  nullable, because a provider call may fail before an assistant message is persisted, or a future internal step may not produce a user-visible assistant message.

TokenUsage.job_id:
  nullable, because the streaming path may not create a background job.
```

Future multi-step or multi-agent flows do not remove the need for traceability to a triggering message. They only require avoiding a strict one-assistant-message-to-one-usage model. Multiple `TokenUsage` rows may share the same `trigger_message_id` and `job_id`.

Confidence is not part of `TokenUsage`. Token usage records describe provider invocation cost, latency, model, and token counts. If future workflows need confidence for classification, routing, RAG grounding, moderation, or human handoff decisions, confidence should live on a result or invocation object, not on the token usage record.

Future evolution:

```text
Message
  -> Run
      -> ProviderInvocation
          -> TokenUsage
```

In that future shape, `ProviderInvocation` represents the model call, and `TokenUsage` becomes a metric/detail attached to that invocation.

## 10. Frontend Scope

The frontend is a minimum Gateway Console:

- message input;
- send button;
- streamed assistant response;
- provider/model display or selector if simple;
- trace_id display;
- token/cost display;
- job status display when using async path.

Do not build:

- auth;
- dashboards;
- complex state management;
- product polish;
- marketing page.

## 11. Open Questions To Resolve During Week 1

- Exact streaming endpoint path.
- Whether Day 8 uses real Bedrock call or documented Bedrock adapter plus fake provider.
- Exact token pricing config format.
- Whether background queue path is required in UI or tested primarily through backend/API.
- Exact frontend/backend contract for final SSE metadata event.

