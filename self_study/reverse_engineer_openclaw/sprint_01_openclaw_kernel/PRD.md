# PRD: OpenClaw-Kernel

> Status: Sprint 01 working draft. Week 1 should keep tightening this file as scope and success criteria become clearer.

## 1. Problem

We need a small but realistic full-stack AI Gateway project that demonstrates AI Engineer readiness.

The system should let a user submit a message through a minimal web console, validate and persist the request, stream or process a model-style response, estimate token cost, expose traceable logs, and demonstrate deterministic AI-assisted development discipline.

## 2. Users

Primary user:

- the learner building portfolio evidence and interview stories.

Secondary users:

- a reviewer evaluating backend architecture;
- an interviewer probing AI Gateway, streaming, provider integration, and AI coding workflow;
- a future Codex/agent session continuing the sprint without prior conversation context.

## 3. Core Use Case

```text
User opens the Next.js gateway console.
User submits a message.
FastAPI validates the request with Pydantic.
The backend persists session/message/job/token metadata.
The gateway calls a provider adapter or fake provider.
The assistant response streams back through SSE.
The UI displays response text, trace_id, token/cost estimate, and status.
Structured logs allow lifecycle reconstruction.
```

## 4. Success Criteria

- A local full-stack demo path works.
- Invalid inputs fail at the boundary.
- Persistence is migration-backed.
- SSE streaming works in the frontend.
- Provider access is isolated behind an adapter.
- AWS Bedrock is tested or documented as the representative cloud-provider experiment.
- Timeout and retry behavior is bounded and testable.
- Token usage and estimated cost are visible.
- `trace_id` connects browser/backend/provider or worker lifecycle.
- Tests cover the critical boundaries.
- The implementation can be defended in a system design or AI coding workflow interview.

## 5. Non-Goals

- Full OpenClaw port.
- Real plugin system.
- Real chat-channel integrations.
- Redis/Kafka/Celery production queue.
- LangGraph or multi-agent runtime.
- RAG.
- Full auth or user-management.
- Polished frontend product design.
- Kubernetes/cloud deployment.

