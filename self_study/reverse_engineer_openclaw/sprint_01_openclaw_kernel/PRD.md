# PRD: OpenClaw-Kernel

## 1. Problem

We need a small but realistic AI Gateway kernel that demonstrates backend and architecture judgment for AI Engineer interviews.

The system should accept user messages, persist conversation state, dispatch an async agent job, run a fake model worker, persist the assistant reply, and expose observable job/session state.

## 2. Users

Primary user:

- the developer building portfolio evidence and interview stories.

Secondary user:

- a reviewer or interviewer evaluating backend architecture, async dispatch, and observability decisions.

## 3. Core Use Case

```text
Client creates a session.
Client submits a user message.
System validates and persists the message.
System enqueues an agent job.
Worker processes the job asynchronously.
System persists an assistant reply.
Client can inspect messages and job status.
Logs expose the entire lifecycle through trace_id.
```

## 4. Success Criteria

- A complete message-to-reply lifecycle works locally.
- Invalid inputs are rejected at the boundary.
- Persistence is migration-backed.
- Async dispatch is visible and testable.
- Failure states are explicit.
- Logs support trace-based debugging.
- The implementation can be defended in a system design interview.

## 5. Non-Goals

- Full OpenClaw port.
- Real plugin system.
- Real LLM provider.
- Redis/Kafka/Celery in Sprint 01.
- UI polish.
- Auth and user management.
