# 00_START_HERE: OpenClaw-Kernel Sprint Dashboard

## 1. Current State

This repo has pivoted from old-style OpenClaw source-code dissection into:

```text
Project-Driven Vibe Coding
  -> Sprint 01: OpenClaw-Kernel
  -> A full-stack AI Gateway kernel for Australian AIE interview readiness
```

The current goal is not to finish a full OpenClaw port. The goal is to build one small, defensible, interview-ready AI Gateway that proves:

- backend architecture judgment;
- full-stack AI product delivery;
- native LLM gateway integration;
- streaming, retry, timeout, and token-cost awareness;
- deterministic AI-assisted development discipline.

Old materials remain available but are no longer the execution path:

```text
archive/old_phase_plan/     historical old-phase plan
openclaw_python/            pre-pivot backend baseline reference
openclaw/                   original OpenClaw source reference
references/                 methodology references
```

The active workspace is:

```text
sprint_01_openclaw_kernel/
```

## 2. Basket Principle

Sprint 01 does not require mastering every named tool in every category.

Each category is a basket. The learner should gain working depth in one representative technology and enough comparison knowledge to explain the alternatives.

Current Sprint 01 choices:

- Backend basket: **FastAPI + Pydantic**.
- Frontend basket: **Next.js 15 + React + TypeScript + Tailwind + shadcn/ui**.
- Cloud/provider basket: **AWS Bedrock** as the cloud-native experiment because the learner already has strong AWS background.
- Model/API basket: one real provider path must work; other providers can be adapter slots, mocks, or comparison notes.
- Streaming basket: **SSE** as the main streaming protocol.
- Cost basket: **tiktoken-style token accounting** and explicit cost estimation.
- AI coding basket: **ADLC: Ask -> Explore -> Plan -> Code -> Verify**.

Do not expand Sprint 01 into a provider zoo. Depth beats coverage.

## 3. Required Read Order

A new Codex conversation must read these files in order:

1. [01_CURRENT_STRATEGY.md](./01_CURRENT_STRATEGY.md)
2. [02_SPRINT_01_OPENCLAW_KERNEL.md](./02_SPRINT_01_OPENCLAW_KERNEL.md)
3. [03_WEEK1_BACKEND_IMMERSION.md](./03_WEEK1_BACKEND_IMMERSION.md)
4. [04_WEEK2_VIBE_BUILD_PLAN.md](./04_WEEK2_VIBE_BUILD_PLAN.md)
5. [sprint_01_openclaw_kernel/PRD.md](./sprint_01_openclaw_kernel/PRD.md)
6. [sprint_01_openclaw_kernel/SPEC.md](./sprint_01_openclaw_kernel/SPEC.md)
7. [sprint_01_openclaw_kernel/AGENT_RULES.md](./sprint_01_openclaw_kernel/AGENT_RULES.md)

Supplementary files:

- [sprint_01_openclaw_kernel/TODO.md](./sprint_01_openclaw_kernel/TODO.md): day-by-day task board.
- [sprint_01_openclaw_kernel/SYSTEM_DESIGN.md](./sprint_01_openclaw_kernel/SYSTEM_DESIGN.md): architecture decisions and trade-offs.
- [sprint_01_openclaw_kernel/TEST_PLAN.md](./sprint_01_openclaw_kernel/TEST_PLAN.md): acceptance redlines.
- [sprint_01_openclaw_kernel/INTERVIEW_NOTES.md](./sprint_01_openclaw_kernel/INTERVIEW_NOTES.md): interview defense material.

## 4. Sprint 01 Target

Build a minimum full-stack AI Gateway console:

```text
Next.js chat console
  -> FastAPI gateway
  -> Pydantic request validation
  -> session/message/job persistence
  -> optional async queue job path
  -> native LLM provider adapter or Bedrock experiment
  -> SSE streaming response
  -> timeout/rate-limit retry handling
  -> token usage and cost estimate
  -> trace_id structured logs
  -> pytest-backed acceptance
```

The app should be simple enough to finish in two weeks, but serious enough to defend in interviews.

## 5. Two-Week Execution Shape

Week 1:

```text
Backend and AI Gateway immersion.
No full implementation yet.
Design the contracts, run small experiments, revise SPEC/TEST_PLAN, and freeze the Week 2 build boundary.
```

Week 2:

```text
Vibe Coding implementation.
Build the FastAPI gateway, minimal Next.js console, SSE streaming, provider adapter, token accounting, tests, logs, and interview artifact.
```

## 6. Sprint 01 Daily Map

Week 1:

- Day 1: HTTP boundary, Pydantic contracts, route/service split.
- Day 2: persistence, SQLAlchemy async, transactions, Alembic, token-usage data shape.
- Day 3: `asyncio.Queue`, job lifecycle, backpressure, and the difference between queueing and SSE.
- Day 4: LLM provider adapter, AWS Bedrock experiment, timeout, rate-limit retry, fake provider for tests.
- Day 5: SSE protocol experiment, token/cost calculator, trace_id logs, final SPEC freeze.

Week 2:

- Day 6: scaffold FastAPI + Next.js app shell, shared contracts, ADLC rules.
- Day 7: implement persistence and migrations.
- Day 8: implement provider adapter, SSE streaming, token/cost accounting.
- Day 9: implement queue worker path, resilience, observability, full tests.
- Day 10: audit, documentation, demo script, interview notes, portfolio freeze.

## 7. Current Non-Goals

Do not build in Sprint 01:

- full OpenClaw port;
- full plugin marketplace;
- real Discord/Telegram/WhatsApp channels;
- Redis/Kafka/Celery production queue;
- LangGraph or multi-agent runtime;
- RAG;
- auth/payment/user-management system;
- polished frontend product UI;
- Kubernetes/cloud deployment.

These are future sprint options.

## 8. Collaboration Discipline

- SPEC before code.
- Data flow before implementation.
- One closed loop before broad feature coverage.
- AI generates at high throughput; human owns architecture, tests, and acceptance.
- No `print()` in app code; use structured logs with `trace_id`.
- Every day must produce:
  - one observable mini experiment;
  - one SPEC or TEST_PLAN refinement;
  - one interview-defense note;
  - one explicit trade-off decision.
- Generated code is not accepted until it passes tests and can be explained.

## 9. Recommended Startup Prompt

```text
请阅读 00_START_HERE.md、02_SPRINT_01_OPENCLAW_KERNEL.md、03_WEEK1_BACKEND_IMMERSION.md、04_WEEK2_VIBE_BUILD_PLAN.md、sprint_01_openclaw_kernel/SPEC.md 和 sprint_01_openclaw_kernel/TODO.md。

然后带我从 TODO 里的当前 Day 开始执行 Sprint 01。
请严格遵守：先做当天的小实验、SPEC/TEST_PLAN 修订和面试防守，再进入实现；Week 2 才做完整全栈交付。
```

## 10. Sprint File Protocol

- New technical constraints go into `SPEC.md`.
- New architecture decisions go into `SYSTEM_DESIGN.md`.
- New acceptance tests go into `TEST_PLAN.md`.
- New AI collaboration rules go into `AGENT_RULES.md`.
- New interview defenses go into `INTERVIEW_NOTES.md`.
- Next actions go into `TODO.md`.

