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
- token_usage or token usage fields associated with messages/jobs.

Transaction rule:

```text
Create user message + job + initial metadata in one transaction.
Commit before enqueue.
```

Known risk:

```text
database commit succeeds
enqueue fails
```

Sprint 01 must make this visible in logs. Future production options include transactional outbox, recovery scanner, or queue-as-source alternatives.

## 7. Why `asyncio.Queue` In Sprint 01

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

## 8. Token Economics

Sprint 01 should record or estimate:

- prompt_tokens;
- completion_tokens;
- total_tokens;
- estimated_cost;
- currency;
- provider;
- model;
- TTFT when streaming;
- total latency.

Exact pricing may be configured manually for the chosen model. The important skill is not memorizing every price; it is showing cost-aware gateway design.

## 9. Frontend Scope

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

## 10. Open Questions To Resolve During Week 1

- Exact streaming endpoint path.
- Whether Day 8 uses real Bedrock call or documented Bedrock adapter plus fake provider.
- Exact token pricing config format.
- Whether token usage is a separate table or message/job fields.
- Whether background queue path is required in UI or tested primarily through backend/API.
- Exact frontend/backend contract for final SSE metadata event.

