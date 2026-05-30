# TODO: Sprint 01 OpenClaw-Kernel

> Source of truth for daily execution. Update this file at the end of each day.

## Week 1: Backend And AI Gateway Immersion

- [x] Day 1: HTTP boundary, Pydantic contracts, route/service split.
- [x] Day 2: persistence, SQLAlchemy async, transaction, Alembic, token-usage data shape.
- [ ] Day 3: `asyncio.Queue`, worker lifecycle, backpressure, queue vs SSE boundary.
- [ ] Day 4: provider adapter, AWS Bedrock experiment, timeout, rate-limit retry, fake provider.
- [ ] Day 5: SSE mini experiment, token/cost calculator, trace_id logs, final SPEC freeze.

## Week 2: Full-Stack Gateway Build

- [ ] Day 6: scaffold FastAPI backend, Next.js frontend shell, contracts, and `CLAUDE.md` rules.
- [ ] Day 7: implement persistence, Alembic migrations, session/message/job/token APIs.
- [ ] Day 8: implement provider adapter, fake provider, SSE streaming, token/cost accounting, frontend streaming display.
- [ ] Day 9: implement `QueueBackend`, `asyncio.Queue` worker path, retry/timeout, structured logs, full tests.
- [ ] Day 10: audit, README, demo script, interview notes, portfolio freeze.

## Daily Required Output

Each day must produce:

- one observable mini experiment or implementation proof;
- one SPEC/SYSTEM_DESIGN/TEST_PLAN update;
- one interview defense note;
- one explicit next-step decision.

## Current Next Step

Start Week 1 Day 3:

```text
asyncio.Queue, worker lifecycle, backpressure, and queue vs SSE boundary.
```

Do not build the complete app yet. Use the day to refine async dispatch boundaries, worker lifecycle, backpressure behavior, queue recovery limits, and the queue vs SSE distinction for Week 2.

## Handoff Notes

Latest Day 2 discussion covered:

- AI Gateway as the OpenClaw-Kernel control plane for validated message intake, persistence, provider calls, streaming/job execution, retry/timeout handling, token-cost visibility, and traceability.
- Provider as a normalized model backend adapter target such as Bedrock, OpenAI, Anthropic, or a fake test provider.
- Streaming path as the request path that calls the provider and emits chunks to the browser through SSE, distinct from the background job path.
- Transaction decision: user Message and queued Job must be created in the same service-owned business transaction.
- Repository decision: repositories may query/add ORM objects but should not commit; services own transaction boundaries with `AsyncSession.begin()` for Sprint 01.
- Unit of Work decision: do not introduce a custom UnitOfWork abstraction for Sprint 01 unless implementation complexity later justifies it.
- Queue enqueue decision: enqueue happens after DB commit because the queue is an execution signal, not the source of truth. If enqueue fails, persist a recoverable enqueue state and support startup/manual/scheduled recovery scan.
- Alembic decision: Alembic owns schema initialization/evolution through versioned incremental migrations in the codebase, but outside request runtime. App startup must not manage the main schema with `Base.metadata.create_all()`.
- TokenUsage decision: TokenUsage should be first-class observability data, recorded per provider invocation. `trigger_message_id` is required; `job_id` and `assistant_message_id` are nullable; multiple TokenUsage rows may share the same triggering message or job.

Important unfinished work:

- Day 3 still needs a mini experiment for `asyncio.Queue` backpressure with a small `maxsize`.
- Day 3 should update SPEC/SYSTEM_DESIGN/TEST_PLAN with QueueBackend, worker lifecycle, queue-full behavior, and queue vs SSE rules.
- Day 3 should add interview notes explaining why Sprint 01 uses `asyncio.Queue` and how it differs from production durable queues.

