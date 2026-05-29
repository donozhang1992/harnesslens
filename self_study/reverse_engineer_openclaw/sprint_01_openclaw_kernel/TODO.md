# TODO: Sprint 01 OpenClaw-Kernel

> Source of truth for daily execution. Update this file at the end of each day.

## Week 1: Backend And AI Gateway Immersion

- [x] Day 1: HTTP boundary, Pydantic contracts, route/service split.
- [ ] Day 2: persistence, SQLAlchemy async, transaction, Alembic, token-usage data shape. In progress; conceptual notes drafted but not yet reviewed or landed into SPEC/SYSTEM_DESIGN/TEST_PLAN.
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

Resume Week 1 Day 2:

```text
persistence, SQLAlchemy async, transaction, Alembic, and token-usage data shape.
```

Do not build the complete app yet. Use the day to refine persistence boundaries, transaction ownership, migration workflow, and TokenUsage fields for Week 2.

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
- TokenUsage decision: TokenUsage should be first-class observability data, preferably recorded per provider invocation. The schema should allow multiple TokenUsage rows per Message or Job.

Important unfinished work:

- The proposed SPEC.md updates have not been reviewed or landed.
- The proposed SYSTEM_DESIGN.md updates have not been reviewed or landed.
- The proposed TEST_PLAN.md updates have not been reviewed or landed.
- Revisit whether `TokenUsage.message_id` and `TokenUsage.job_id` should be nullable, and document the final relationship rule before updating SPEC.

