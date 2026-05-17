# Day 3 API Boundary Plan

Date: 2026-05-17

## Goal

Continue the low-pressure weekend pace. Move naturally from validated schema contracts into minimum API, service, and repository boundary design.

Today is not about maximizing code volume. The goal is to understand the backend layering well enough to independently sketch and build it.

## Minimum Goal: Finish Schema Test Closure

- Add valid payload tests for `SessionRead`.
- Add valid payload tests for `MessageRead`.
- Clean unused imports if needed.
- Run:

```powershell
python -m pytest -q
```

Current verification after the fix:

```text
10 passed, 1 warning
```

The remaining warning is the existing `.pytest_cache` permission warning and does not affect test validity.

## Standard Goal: Design Minimum API / Service Boundaries

Before writing full database logic, draw the minimum Session / Message request flow:

```text
FastAPI route
  -> Pydantic request schema
  -> service function
  -> repository / persistence placeholder
  -> Pydantic response schema
```

Minimum endpoints to plan:

```text
POST /sessions
GET /sessions/{session_id}
POST /sessions/{session_id}/messages
GET /sessions/{session_id}/messages
```

## Layer Responsibility Model

```text
route:
  HTTP boundary. Receives requests, validates schemas, handles path/body/query inputs,
  calls services, maps service results/errors into HTTP responses.

service:
  Business use-case boundary. Owns orchestration, state rules, and domain decisions.
  It should not depend directly on FastAPI request objects.

repository / db:
  Persistence boundary. Owns data access, storage, lookup, and listing behavior.
  It should not carry high-level business policy.
```

## Stretch Goal

Only if energy is sufficient:

- Create route file skeletons.
- Let handlers return fake data temporarily or call placeholder services.
- Start thinking about how SQLAlchemy models map to current Pydantic schemas.

Not required today:

- Alembic setup.
- Real database migration.
- Complete SQLAlchemy persistence.

## Day 3 Definition of Done

- Schema tests are green.
- The route / service / repository split can be explained in your own words.
- A minimum Session / Message API design sketch exists.
- Extra code is welcome, but not required for today's success.

