# Sprint 01: OpenClaw-Kernel

This folder is the active workspace for the first Project-Driven Vibe Coding sprint.

## Mission

Build a minimum full-stack AI Gateway:

```text
Next.js gateway console
  -> FastAPI + Pydantic backend
  -> persisted session/message/job/token usage state
  -> SSE streaming response
  -> native provider adapter / AWS Bedrock experiment
  -> timeout and rate-limit retry
  -> structured trace_id logs
  -> pytest-backed acceptance
```

This is not a full OpenClaw port. It is an OpenClaw-inspired kernel focused on the engineering patterns that matter in Australian AIE interviews.

## Basket Principle

Do not try to master every provider or cloud platform in Sprint 01.

Each category is a basket. Sprint 01 goes deep on one representative technology and learns enough about alternatives to explain trade-offs:

- Backend: FastAPI + Pydantic.
- Frontend: Next.js 15 + React + TypeScript + Tailwind + shadcn/ui.
- Cloud/provider: AWS Bedrock as the representative cloud-native experiment.
- Streaming: SSE.
- Queueing: `asyncio.Queue` behind `QueueBackend`.
- Cost: token counting and cost estimation.
- AI coding discipline: ADLC and strict rules.

## Draft Scaffold Notice

The markdown files in this folder are not final answers.

Week 1 exists partly to revise them. The learner should actively participate in turning backend and AI Gateway intuition into:

- stricter SPEC rules;
- clearer AGENT_RULES;
- sharper TEST_PLAN redlines;
- more precise SYSTEM_DESIGN decisions;
- stronger INTERVIEW_NOTES defenses;
- an executable TODO board.

## Start Here

Read:

- [PRD.md](./PRD.md)
- [SPEC.md](./SPEC.md)
- [AGENT_RULES.md](./AGENT_RULES.md)
- [TODO.md](./TODO.md)
- [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md)
- [TEST_PLAN.md](./TEST_PLAN.md)
- [INTERVIEW_NOTES.md](./INTERVIEW_NOTES.md)

Sprint 01 intentionally excludes full OpenClaw, RAG, LangGraph, Redis/Kafka/Celery, auth, polished UI, and production deployment.

