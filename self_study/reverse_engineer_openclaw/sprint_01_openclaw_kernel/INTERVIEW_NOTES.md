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

## 5. Final Notes

Day 10 must update this file with:

- final project pitch;
- final demo script;
- actual test results;
- known limitations;
- strongest interview story from the sprint.

