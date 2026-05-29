# TODO: Sprint 01 OpenClaw-Kernel

> Source of truth for daily execution. Update this file at the end of each day.

## Week 1: Backend And AI Gateway Immersion

- [x] Day 1: HTTP boundary, Pydantic contracts, route/service split.
- [ ] Day 2: persistence, SQLAlchemy async, transaction, Alembic, token-usage data shape.
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

Start Week 1 Day 2:

```text
persistence, SQLAlchemy async, transaction, Alembic, and token-usage data shape.
```

Do not build the complete app yet. Use the day to refine persistence boundaries, transaction ownership, migration workflow, and TokenUsage fields for Week 2.

