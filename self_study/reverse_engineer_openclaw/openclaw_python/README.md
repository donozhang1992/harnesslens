# OpenClaw Python

## Current Status: Legacy Baseline

As of 2026-05-28, this folder is no longer the active sprint workspace.

It is preserved as the pre-pivot backend foundation baseline from the earlier OpenClaw Phase 1 work. It can be used as reference material for FastAPI, Pydantic, SQLAlchemy, persistence tests, and backend layering.

The active project is now:

```text
../sprint_01_openclaw_kernel
```

Do not continue the new Vibe Coding sprint directly in this folder unless the strategy changes.

OpenClaw Python is a Python reimplementation of the core backend architecture inspired by the original Node/TypeScript OpenClaw project.

The goal is not a line-by-line port. The project rebuilds the same backend responsibilities in a Python-native stack: API boundaries, data contracts, session/message persistence, agent orchestration, async job execution, observability, and an extensible tool/plugin layer.

## Strategy Update

As of 2026-05-26, this project is scoped as the backend foundation part of a broader AI Engineer portfolio plan.

The near-term goal is to finish:

```text
Phase 1 + basic observability
```

After that, the main study line moves to LLM Twin / LLM Engineers Handbook for DDD, data pipelines, RAG, evaluation, deployment, CI/CD, and LLMOps.

The original OpenClaw-inspired Phase 2-4 ideas remain valuable backlog, but they are no longer the immediate execution path.

## Scope

Current active scope:

- FastAPI backend gateway for HTTP APIs and later realtime streaming endpoints.
- Pydantic v2 request/response contracts for users, sessions, and messages.
- SQLAlchemy 2.0 async persistence with Alembic migrations.
- Session and message CRUD APIs.
- Structured JSON logging with structlog.

Paused backlog:

- Agent orchestration using LangGraph.
- Long-running task execution using Celery and Redis.
- Event-driven decoupling using Kafka where useful.
- Later memory/RAG support using LlamaIndex.
- Lightweight Python-native tool/plugin registry.

## Non-Goals

This project does not aim to:

- Preserve the original Node/TypeScript code structure.
- Reimplement every OpenClaw UI, CLI, or platform integration in the first pass.
- Provide a full drop-in replacement for the original project immediately.
- Copy channel/provider/plugin implementations line by line.

## Technology Stack

- API: FastAPI
- Data contracts: Pydantic v2
- Persistence: SQLAlchemy 2.0 Async, Alembic
- Initial database: SQLite
- Later database target: PostgreSQL
- Agent workflow: LangGraph
- RAG/memory: LlamaIndex
- Background jobs: Celery, Redis
- Event bus: Kafka
- Logging: structlog

## Architecture Direction

The original OpenClaw Gateway acts as a control plane that coordinates configuration, authentication, plugins, runtime state, HTTP/WebSocket surfaces, channels, and sidecars.

This Python version maps those responsibilities into a conventional Python backend layout:

```text
app/main.py      application composition and startup
app/core/        config, logging, cross-cutting runtime concerns
app/api/         HTTP/WebSocket protocol boundaries
app/schemas/     Pydantic request/response contracts
app/services/    business use cases
app/models/      SQLAlchemy persistence models
app/db/          database engine, sessions, migrations integration
```

## Major Differences From The Original

- Python-native backend structure instead of mirroring the TypeScript source tree.
- REST-first implementation for the initial session/message backend.
- WebSocket and streaming support will be added after the data contract layer is stable.
- Pydantic schemas and SQLAlchemy models are kept separate by design.
- Plugin and channel behavior will be rebuilt as Python-native abstractions rather than copied from the original runtime.

## Current Status

Phase 1 is focused on the backend foundation:

- Project skeleton
- Session and message schemas
- Schema tests
- Database models and migrations
- Minimal Session/Message REST APIs
