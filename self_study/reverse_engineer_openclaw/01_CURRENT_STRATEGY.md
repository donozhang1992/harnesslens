# 01_CURRENT_STRATEGY: Current Strategy After Pivot

## 1. What Changed

This project no longer follows the old learning path:

```text
read everything first
  -> slowly understand
  -> hand-write modules
  -> eventually build portfolio
```

The new path is:

```text
define a project
  -> write strict SPEC
  -> use AI to generate comparative implementations
  -> audit edge cases
  -> verify with tests and structured logs
  -> turn the result into interview-ready portfolio evidence
```

OpenClaw is still the first major learning object. The change is the method.

## 2. Why We Pivoted

The old method gave psychological safety because every line felt personally owned. But it was too slow and did not create enough real project judgment.

The new method aims to build experience faster:

- build portfolio assets quickly;
- learn by making architecture decisions;
- extract engineering taste from implementation comparisons;
- pressure-test edge cases instead of only running happy paths;
- develop Vibe Coding control skills that modern AI engineering interviews increasingly expect.

This does not reduce backend rigor. It raises the bar.

## 3. What Remains Important

The core learning targets are still:

- backend boundaries;
- system design;
- data lifecycle;
- async task dispatch;
- failure handling;
- observability;
- testing;
- trade-off explanation;
- architecture defense in interviews.

We are not skipping backend foundations. We are learning them through higher-bandwidth practice.

## 4. New Safety Model

Old safety:

```text
I typed it, so I probably know it.
```

New safety:

```text
I specified it.
I reviewed three implementation levels.
I attacked it.
I tested it.
I traced it.
I explained its data lifecycle and failure modes.
Therefore I control it.
```

The goal is not passive AI usage. The goal is human system ownership.

## 5. The Middle Path

We will not jump from hand-written learning to blind AI generation.

Every important backend concept follows this loop:

```text
Business pain
  -> vocabulary bootstrapping
  -> naive / acceptable / production-minded implementation comparison
  -> attack review
  -> observable mini experiment
  -> test assertions
  -> human explanation
```

This creates backend "physical intuition" without spending days hand-typing boilerplate.

## 6. Why OpenClaw-Kernel First

OpenClaw contains the right architecture pressure:

- gateway;
- sessions and messages;
- event dispatch;
- agent runner;
- plugin-oriented thinking;
- async flow;
- observability;
- failure handling.

But full OpenClaw is too large for the first sprint.

Therefore Sprint 01 builds:

```text
OpenClaw-Kernel
```

A minimum full-stack AI Gateway kernel. It keeps the OpenClaw-inspired backend pressure, but the Sprint 01 target is now broader than the first draft:

- FastAPI + Pydantic backend;
- persistence and migrations;
- SSE streaming;
- provider adapter / AWS Bedrock experiment;
- timeout and rate-limit retry;
- token usage and cost estimation;
- `asyncio.Queue` background path;
- minimal Next.js gateway console;
- ADLC-driven Vibe Coding discipline.

The implementation should be small, but it must be demoable and interview-defensible.

## 7. Basket Principle

The new sprint plan uses a basket strategy.

We do not need to master every named technology in every category during Sprint 01. Each category needs one representative technology with real depth, plus enough comparison knowledge to explain alternatives.

Current representatives:

- backend: FastAPI + Pydantic;
- frontend: Next.js 15 + React + TypeScript + Tailwind + shadcn/ui;
- cloud/provider: AWS Bedrock;
- streaming: SSE;
- queueing: `asyncio.Queue`;
- cost: token accounting and cost estimation;
- AI workflow: ADLC.

## 8. What Happened To LLM Twin

LLM Twin / LLM Engineers Handbook is no longer the immediate heavy rebuild target.

It remains a reference and later portfolio direction for:

- DDD;
- data pipelines;
- RAG;
- evaluation;
- LLMOps;
- deployment.

The first sprint focuses on OpenClaw-Kernel because it is better suited for learning backend architecture, streaming gateway design, provider integration, async dispatch, Vibe Coding control, and system defense.

## 9. Current Source Of Truth

For current execution, trust:

- [00_START_HERE.md](./00_START_HERE.md)
- [02_SPRINT_01_OPENCLAW_KERNEL.md](./02_SPRINT_01_OPENCLAW_KERNEL.md)
- [03_WEEK1_BACKEND_IMMERSION.md](./03_WEEK1_BACKEND_IMMERSION.md)
- [04_WEEK2_VIBE_BUILD_PLAN.md](./04_WEEK2_VIBE_BUILD_PLAN.md)
- [sprint_01_openclaw_kernel/](./sprint_01_openclaw_kernel/)

For history, use:

- [archive/old_phase_plan/](./archive/old_phase_plan/)
- [openclaw_python/](./openclaw_python/)
