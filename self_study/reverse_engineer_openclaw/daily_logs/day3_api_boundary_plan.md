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

## Completed Today

- Finished schema test closure:
  - added valid payload coverage for `SessionRead`
  - added valid payload coverage for `MessageRead`
  - confirmed `SessionStatus` is used
- Verified tests:

```text
10 passed, 1 warning
```

- Designed the minimum request flows for:
  - `POST /sessions`
  - `GET /sessions/{session_id}`
  - `POST /sessions/{session_id}/messages`
  - `GET /sessions/{session_id}/messages`
- Built the first route / service / repository skeleton:
  - `app/api/routes/sessions.py`
  - `app/services/sessions.py`
  - `app/repositories/sessions.py`
- Added the FastAPI app composition in `app/main.py`.
- Verified the registered routes with the project virtual environment:

```text
POST /sessions
GET /sessions/{session_id}
POST /sessions/{session_id}/messages
GET /sessions/{session_id}/messages
```

## Dev Server Decision

Keep production dependencies light:

```toml
dependencies = [
    "fastapi>=0.110",
    "pydantic>=2",
    "structlog>=24",
]
```

Use `uvicorn[standard]` as a development dependency:

```toml
dev = [
    "pytest>=8",
    "uvicorn[standard]>=0.30",
]
```

Development startup command:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Reasoning:

```text
FastAPI defines the application and routes.
Uvicorn is the ASGI server that listens for HTTP requests and serves app.main:app.
Keeping uvicorn in dev avoids making the base runtime dependency set heavier than necessary.
```

## Day 3 Definition of Done

- [x] Schema tests are green.
- [x] The route / service / repository split can be explained in your own words.
- [x] A minimum Session / Message API design sketch exists.
- [x] Route / service / repository code skeleton exists.
- [x] FastAPI app registers the Session / Message endpoints.

## Remaining Notes

- `.pytest_cache` still emits a permission warning, but it does not affect test validity.
- Current repository storage is in-memory only; data is cleared when the process restarts.
- SQLAlchemy, Alembic, and real persistence remain intentionally out of scope for Day 3.
