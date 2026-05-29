# 03_WEEK1_BACKEND_IMMERSION: Backend And AI Gateway Immersion Week

## 1. Week Positioning

Week 1 is the design, intuition, and experiment week for Sprint 01.

Do not build the full app yet. The goal is to understand the system deeply enough that Week 2 Vibe Coding can be constrained by clear SPEC, tests, and interview-ready trade-offs.

The markdown files inside `sprint_01_openclaw_kernel/` are draft scaffolds, not finished answers. During Week 1, the learner must actively revise:

- `PRD.md`
- `SPEC.md`
- `SYSTEM_DESIGN.md`
- `TEST_PLAN.md`
- `AGENT_RULES.md`
- `INTERVIEW_NOTES.md`
- `TODO.md`

Writing these files is part of Vibe Coding skill. A strong AI engineer does not merely ask AI to code; they define contracts, acceptance criteria, failure modes, and review boundaries.

## 2. Week 1 Method

Each module follows the same rhythm:

```text
1. Business pain
2. Vocabulary bootstrapping
3. Three implementation levels: naive / acceptable / production-minded
4. Attack review
5. Observable mini experiment
6. Test assertion
7. SPEC/TEST_PLAN update
8. Human interview explanation
```

Every day must produce:

- one observable mini experiment;
- one architecture or trade-off note in `SYSTEM_DESIGN.md`;
- one technical constraint in `SPEC.md`;
- one acceptance redline in `TEST_PLAN.md`;
- one interview defense note.

## 3. Day 1: HTTP Boundary And Pydantic Contracts

Goal:

```text
Understand the external boundary of the gateway.
```

Core questions:

- Why is a route a protocol adapter, not the business layer?
- Why is Pydantic the system boundary guard?
- Why separate request schema from response schema?
- Why should raw dictionaries not cross service boundaries?
- Which errors are validation errors, not business errors?

Mini experiment:

Ask AI to generate three versions of `POST /sessions/{id}/messages`:

```text
naive:
  route owns everything and passes raw dicts

acceptable:
  route uses schemas and calls a service

production-minded:
  route/schema/service/repository boundaries are clear
```

Observe:

- illegal role rejected;
- empty content rejected;
- route does not know SQLAlchemy;
- service owns session existence and message submission decisions.

Outputs:

- update `SPEC.md` contract rules;
- update `TEST_PLAN.md` contract tests;
- add interview defense for route/service separation.

## 4. Day 2: Persistence, Transactions, Alembic, Token Usage Shape

Goal:

```text
Understand durable state and transaction boundaries.
```

Core questions:

- What is the difference between engine, session, transaction, model, and migration?
- Why is `AsyncSession` a unit of work?
- Why is `Base.metadata.create_all()` not a migration workflow?
- Which data must be persisted for interview/debug value?
- Where should token usage and cost estimates live?

Minimum data concepts:

- Session
- Message
- Job
- TokenUsage

Mini experiment:

Compare three persistence patterns:

```text
no transaction:
  failure leaves partial writes

scattered commit:
  service and repository commit unpredictably

unit of work:
  one transaction protects message/job creation
```

Failure case:

```text
user message created
job creation fails
```

Observe:

- which rows remain;
- whether rollback protects consistency;
- whether logs identify the failure point.

Outputs:

- update `SYSTEM_DESIGN.md` with transaction ownership;
- update `SPEC.md` with TokenUsage fields;
- update `TEST_PLAN.md` with rollback and migration tests.

## 5. Day 3: `asyncio.Queue`, Worker Lifecycle, And Queue vs SSE

Goal:

```text
Understand background work separately from streaming transport.
```

Core distinction:

```text
asyncio.Queue
  -> background job dispatch and worker buffering

SSE
  -> HTTP response streaming from server to browser
```

Core questions:

- What are producer, consumer, maxsize, backpressure, cancellation, and graceful shutdown?
- What is the difference between at-most-once and at-least-once?
- Why is an in-memory queue acceptable for Sprint 01 but not production?
- When should Redis Streams, SQS, Celery, Kafka, or RabbitMQ replace it?
- Should the streaming path and background job path both exist in Sprint 01?

Mini experiment:

```text
queue maxsize = 2
worker handles 1 job/second
submit 10 jobs concurrently
```

Required structured events:

```text
job_enqueued
queue_full
job_dequeued
job_started
job_completed
job_failed
```

Observe:

- how backpressure appears;
- what happens when worker is stopped;
- what is lost on process restart;
- how job state remains queryable in DB.

Outputs:

- update `SYSTEM_DESIGN.md` with queue vs SSE boundary;
- update `SPEC.md` with `QueueBackend` rules;
- update `TEST_PLAN.md` with queue behavior tests;
- add interview defense for `asyncio.Queue`.

## 6. Day 4: Provider Adapter, AWS Bedrock, Timeout, Rate-Limit Retry

Goal:

```text
Understand native LLM gateway integration without becoming provider-dependent.
```

Basket choice:

- Cloud representative: AWS Bedrock.
- Other providers: know the comparison surface; do not implement all of them.
- Test representative: fake provider with deterministic success/failure/streaming.

Core questions:

- What interface should all providers satisfy?
- How does a streaming provider differ from a non-streaming provider?
- Which errors are transient and retryable?
- Which errors should fail fast?
- How do timeout and retry interact with user experience?
- How do we test provider behavior without spending tokens?

Minimum provider interface should account for:

- prompt/messages input;
- model name;
- stream vs non-stream mode;
- timeout;
- token usage or estimated token usage;
- provider error classification;
- trace_id propagation.

Mini experiment:

Create or specify a fake provider with:

```text
30% success
40% transient/rate-limit style error
30% permanent validation/provider error
```

Then define retry behavior:

```text
transient: bounded retry with backoff
permanent: fail fast
timeout: bounded failure and visible error state
```

AWS Bedrock experiment:

- define setup prerequisites;
- identify model choice;
- run a tiny call if credentials are available;
- otherwise document exact adapter contract and setup command path.

Outputs:

- update `SPEC.md` provider adapter rules;
- update `TEST_PLAN.md` retry/provider tests;
- update `SYSTEM_DESIGN.md` provider trade-offs;
- add interview defense for Bedrock as the representative cloud basket.

## 7. Day 5: SSE, Token Economics, Observability, SPEC Freeze

Goal:

```text
Freeze the Week 2 build contract.
```

Core questions:

- How does SSE work over HTTP?
- What is Time To First Token (TTFT)?
- What is total latency?
- How do input tokens, output tokens, and cost differ?
- Which log fields are required to debug a failed streamed request?
- What must the frontend show to make the demo interview-ready?

Mini experiment:

Build or specify a tiny SSE endpoint:

```text
GET or POST streaming endpoint
  -> emits token chunks
  -> emits final metadata event
  -> includes trace_id
  -> records TTFT / latency / token estimate
```

Required observable fields:

- trace_id;
- session_id;
- message_id;
- job_id when applicable;
- provider;
- model;
- prompt_tokens;
- completion_tokens;
- estimated_cost;
- ttft_ms;
- latency_ms;
- error_type when applicable.

Outputs:

- freeze `SPEC.md`;
- finalize `TEST_PLAN.md`;
- update `TODO.md` for Week 2;
- update `INTERVIEW_NOTES.md` with:
  - ADLC answer;
  - SSE explanation;
  - token cost explanation;
  - provider choice explanation;
  - retry/debug story.

## 8. Week 1 Acceptance

Week 1 is complete when the learner can explain:

- the full gateway data lifecycle;
- route/service/repository ownership;
- transaction and migration boundaries;
- queue vs SSE difference;
- why Sprint 01 uses `asyncio.Queue`;
- how provider adapters prevent lock-in;
- why AWS Bedrock is a good representative provider for this learner;
- timeout and rate-limit retry rules;
- input/output token cost estimation;
- trace_id-based debugging;
- what the Next.js console must show in Week 2.

Week 1 is not accepted if the documents remain generic. The documents must contain decisions specific enough for Week 2 agents to implement without reinventing scope.

