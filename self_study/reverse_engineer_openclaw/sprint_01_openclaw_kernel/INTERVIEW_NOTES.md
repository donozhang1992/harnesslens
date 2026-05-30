# INTERVIEW_NOTES: OpenClaw-Kernel

> Working interview-defense notes. Update daily during Sprint 01.

## 1. Project Pitch

```text
I built a minimum full-stack AI Gateway kernel inspired by OpenClaw.
It demonstrates the core production pattern behind AI apps:
validated message intake, persisted state, SSE streaming, provider abstraction,
bounded retry, token-cost visibility, async background work, and traceable logs.
The point was not to copy a framework, but to show that I can control the
engineering boundaries of an AI system end to end.
```

## 2. AI Coding Workflow Answer

Draft 60-second answer:

```text
I use AI coding through an ADLC workflow: Ask, Explore, Plan, Code, Verify.
I do not start by asking the tool to write code. I first define the product
boundary, SPEC, test redlines, and agent rules. Then I let the tool generate
small scoped modules, and I verify through tests, type/lint checks, structured
logs, and manual architecture review. I treat Cursor or Claude Code as a fast
implementer, not the system owner. The human job is to keep deterministic
control over contracts, failure modes, and acceptance.
```

## 3. Likely Interview Attacks

### Why FastAPI and Pydantic?

```text
FastAPI gives a clean async HTTP boundary and pairs naturally with Pydantic.
Pydantic is my system gate: invalid roles, empty content, and malformed provider
settings fail before they pollute business logic. That gives me stable contracts
for both backend tests and the Next.js frontend.
```

### How does SSE work and why use it here?

```text
SSE keeps a single HTTP response open and lets the server send incremental
events to the browser. For LLM output, that means I can show Time To First Token
and stream chunks as they arrive, without building a full WebSocket protocol.
It is a good fit for one-way model output from server to client.
```

### Why AWS Bedrock?

```text
I chose AWS Bedrock as my representative cloud provider because I already have
strong AWS experience, so I can move faster and reason about IAM, regions,
managed service trade-offs, and production setup. I do not need to implement
every cloud provider in Sprint 01. I need one real representative path and a
clean adapter boundary so Azure OpenAI, OpenAI, Anthropic, or Gemini can be
swapped later.
```

### Why use `asyncio.Queue` instead of Redis/Kafka/Celery?

```text
For Sprint 01, the goal was to validate the async Gateway kernel with minimal
infrastructure. `asyncio.Queue` lets me demonstrate producer/consumer flow,
backpressure, worker lifecycle, and failure handling without external services.
I know it is not durable or cross-process, so I isolate it behind a QueueBackend
abstraction. In production, I would replace it with SQS, Redis Streams, Celery,
Kafka, or RabbitMQ depending on durability and throughput requirements.
```

### How do you avoid route handlers becoming business logic?

```text
Routes only translate HTTP into service calls and map service errors into HTTP
responses. Pydantic owns validation. Services own use-case decisions such as
checking session existence, creating messages, and deciding when to enqueue or
stream. Repositories hide persistence. Provider adapters hide SDK specifics.
```

### How do you handle timeout and rate limits?

```text
I classify provider errors before deciding behavior. Rate limits and transient
network failures can retry with bounded exponential backoff. Permanent provider
or validation failures fail fast. Timeouts are explicitly bounded so the gateway
does not hang indefinitely. Every retry attempt is logged with trace_id,
provider, model, attempt number, and error type.
```

### How do you calculate token cost?

```text
I track prompt tokens and completion tokens separately because output tokens are
often priced differently from input tokens. When the provider returns usage, I
store it. When it does not, I estimate with a tokenizer such as tiktoken or a
model-specific approximation. The important part is that cost becomes a first
class gateway concern, visible in logs, metadata, and the UI.
```

### How did you design persistence and transactions?

```text
In my gateway design, persistence is not just storage; it is the source of truth
for the AI request lifecycle. A user Message and its queued Job are created in
the same transaction because the Job is the processing commitment for that
Message. If the Message commits without the Job, the system has accepted user
input but created no execution path.

Repositories do not commit because they do not know the full business workflow.
The service layer owns transaction boundaries with SQLAlchemy AsyncSession
transaction context managers. For this sprint, I intentionally avoided a custom
Unit of Work abstraction because AsyncSession.begin() gives enough consistency
without adding extra abstraction.
```

### Why enqueue after commit?

```text
Queue enqueue happens after the database commit because the queue is only an
execution signal, not the source of truth. The durable Job record must exist
before a worker can process it. If enqueue fails, I persist a recoverable
enqueue status and rely on structured logs plus startup, scheduled, or explicit
recovery scans.
```

### Why Alembic instead of create_all?

```text
Alembic manages schema lifecycle through versioned incremental migrations.
SQLAlchemy models describe the current intended schema shape, while Alembic
migration files describe how a real database moves from one revision to the
next. I do not use Base.metadata.create_all() in app startup for the main schema
because schema changes should be reviewable, repeatable, and part of the
release workflow rather than an implicit runtime side effect.
```

### Why is TokenUsage linked to trigger_message_id?

```text
TokenUsage represents one provider invocation. In Sprint 01, every provider
invocation must be traceable to the user Message that triggered it, so
trigger_message_id is required. job_id is nullable because a direct streaming
path may not create a background Job. assistant_message_id is nullable because
a provider call may fail before an assistant Message is persisted, or a future
internal step may not produce a user-visible assistant message.

Future multi-step or multi-agent flows do not remove the need for traceability
to the triggering message. They only mean multiple TokenUsage rows may share the
same trigger_message_id or job_id.
```

### How do you debug a failed streamed request?

```text
Every request gets a trace_id. The frontend displays it, and backend logs carry
it through route, service, provider adapter or worker, token accounting, and
persistence. To debug a failure, I filter by trace_id and inspect the lifecycle:
request accepted, validation, provider call, retry attempts, stream chunks,
final metadata, and persisted state.
```

## 4. Trade-Offs To Document

- SSE vs WebSocket.
- Direct streaming path vs background queue path.
- Fake provider vs real provider.
- AWS Bedrock vs Azure OpenAI/OpenAI/Anthropic/Gemini.
- In-memory queue vs durable queue.
- Job table as state source vs queue as delivery mechanism.
- SQLite vs PostgreSQL.
- Local structured logs vs LangSmith/LangFuse.
- Minimum frontend console vs polished product UI.

## 5. Day 2 Core Memory: Persistence, Transactions, Alembic, TokenUsage

Core judgments to remember:

- Message and Job must be created in one shared business transaction because the Job is the processing commitment for the Message.
- Repositories should not commit because they do not know the full business workflow; services own transaction boundaries.
- Queue enqueue happens after commit because workers should only receive durable job IDs.
- Alembic manages schema initialization and evolution outside request runtime; app startup must not manage the main schema with `create_all()`.
- TokenUsage is per provider invocation and must have `trigger_message_id`; `job_id` and `assistant_message_id` may be nullable for streaming, failure, and future internal-step cases.

Self-check questions:

```text
Q1: Why must Message and Job be created in the same transaction?
Q2: Why should repositories not commit?
Q3: Why does queue enqueue happen after DB commit?
Q4: What does Alembic add that create_all does not?
Q5: Why is TokenUsage per provider invocation, and why is trigger_message_id required?
```

Interview wording:

```text
The service owns the transaction boundary. Repositories can query and add ORM
objects, but they do not commit. The service runs message creation and job
creation inside one transaction. If the whole operation succeeds, the
transaction commits. If any part fails, it rolls back, so the database does not
keep a partial workflow state.
```

Useful vocabulary:

```text
begin/start a transaction
  open the transaction

transaction boundary
  the scope of operations protected by one commit-or-rollback decision

commit the transaction
  make the changes durable

roll back the transaction
  undo the changes in that transaction

close/end the transaction
  generic wording after either commit or rollback

run these operations inside one transaction
  execute them under one shared atomic boundary
```

## 6. Final Notes

Day 10 must update this file with:

- final project pitch;
- final demo script;
- actual test results;
- known limitations;
- strongest interview story from the sprint.

