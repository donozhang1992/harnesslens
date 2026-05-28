# Day 5 Weekend Session Persistence Plan

Planned window: 2026-05-23 to 2026-05-24

Available time estimate: 1-3 hours total.

## Context For New Conversation

Day 4 was completed on 2026-05-22 after a busy week. The SQLAlchemy persistence foundation now exists:

- `app/db/base.py`
- `app/db/session.py`
- `app/models/session.py`
- `app/models/message.py`
- `openclaw.db` was created successfully.
- SQLite verification confirmed these tables exist:

```text
messages
sessions
```

The application still uses the in-memory repository:

- `app/repositories/sessions.py`

So API requests do not yet persist to `openclaw.db`.

## Weekend Goal

Build the first real database-backed API chain:

```text
POST /sessions
GET /sessions/{session_id}
```

The weekend goal is not full Phase 1 completion. The goal is a small, closed loop:

```text
create session through API
  -> write to SQLite
  -> restart process if needed
  -> read session from SQLite
```

## Recommended Scope

### If only 1 hour is available

- Understand how FastAPI dependency injection can provide an `AsyncSession`.
- Add a `get_db_session()` dependency in `app/db/session.py`.
- Sketch or partially implement database-backed `create_session`.

Definition of done:

- Can explain how `AsyncSession` flows from route/service to repository.

### If 2 hours are available

- Add `get_db_session()`.
- Convert `create_session` to write through SQLAlchemy.
- Convert `get_session` to read through SQLAlchemy.
- Update route/service function signatures as needed for async database access.
- Manually verify data is written to `openclaw.db`.

Definition of done:

- `POST /sessions` persists a row in the `sessions` table.
- `GET /sessions/{session_id}` reads that row from SQLite.
- Existing tests still pass.

### If 3 hours are available

- Complete the 2-hour goal.
- Add one focused repository or API happy-path test.
- Update the daily log with what changed and what remains.

Definition of done:

- Session create/get persistence works.
- At least one test covers the new persistence path.

## Out Of Scope For This Weekend

Keep these for later unless extra time is explicitly available:

- Full `Message` persistence.
- Alembic initialization and migration generation.
- Full repository rewrite.
- Full API integration test suite.
- Structlog configuration.

## Suggested Implementation Order

1. Review current files:

```text
app/db/session.py
app/models/session.py
app/repositories/sessions.py
app/services/sessions.py
app/api/routes/sessions.py
```

2. Add database dependency:

```text
get_db_session()
  -> async with AsyncSessionLocal() as session
  -> yield session
```

3. Convert only session operations first:

```text
repository.create_session(db, payload data)
repository.get_session(db, session_id)
```

4. Let `Message` operations continue using the current placeholder or defer them explicitly.

5. Verify manually:

```text
POST /sessions
GET /sessions/{session_id}
sqlite3 check or Python sqlite3 check
```

## Learning Focus

The main learning target is how one request flows through async persistence:

```text
FastAPI route
  -> Depends(get_db_session)
  -> service
  -> repository
  -> AsyncSession
  -> SQLAlchemy model
  -> SQLite row
```

Key concepts to review while coding:

- `AsyncSession`
- `db.add(...)`
- `await db.commit()`
- `await db.refresh(...)`
- `select(...)`
- `await db.execute(...)`
- mapping `SessionModel` back into `SessionRead`

## Success Sentence

By the end of the weekend, the desired outcome is:

```text
Session creation and lookup no longer depend on in-memory dictionaries; they persist through SQLite.
```

## 2026-05-23 Progress Update

Day 5's core persistence loop was completed.

Completed today:

- Reviewed Day 4's SQLAlchemy foundation:
  - `app/db/base.py`
  - `app/db/session.py`
  - `app/models/session.py`
  - `app/models/message.py`
- Added `get_db_session()` in `app/db/session.py`:

```text
AsyncSessionLocal()
  -> async with
  -> yield AsyncSession to FastAPI
```

- Converted `POST /sessions` and `GET /sessions/{session_id}` route handlers to async handlers.
- Injected `AsyncSession` into those route handlers via `Depends(get_db_session)`.
- Converted `session_service.create_session` and `session_service.get_session` to async functions that accept `db`.
- Converted repository session create/get operations to use SQLAlchemy instead of the in-memory `_sessions` dict:
  - `save_session(db, session)`
  - `get_session(db, session_id)`
- Added repository-local mapper helpers to isolate the `metadata` / `metadata_` naming mismatch:
  - `_session_dict_to_model(...)`
  - `_session_model_to_dict(...)`
- Imported `MessageModel` in the repository only to ensure SQLAlchemy can resolve the `SessionModel.messages` relationship target.

Verified today:

- Existing schema tests still pass:

```text
10 passed
```

- Direct service/repository persistence check succeeded:

```text
create_session(...)
  -> writes SessionModel through AsyncSession
get_session(...)
  -> reads the same row back from SQLite
```

- HTTP-level verification succeeded through FastAPI:

```text
POST /sessions
  -> returned id d33bf743-16ad-43bf-9f13-90256e72dc00

GET /sessions/d33bf743-16ad-43bf-9f13-90256e72dc00
  -> returned the same id, title, status, and metadata
```

- SQLite verification confirmed the row exists in `openclaw.db`.

Concepts clarified today:

- `AsyncSessionLocal` is an `AsyncSession` factory, not a generator factory.
- `get_db_session()` is the async generator dependency.
- `yield` allows FastAPI to return to the dependency after the request and close the session context.
- Request-scoped `AsyncSession` is an architectural choice and the common FastAPI + SQLAlchemy default, not an intrinsic property of `AsyncSession`.
- Engine / connection pool can be shared; `AsyncSession` should remain a short-lived unit of work.
- SQLite can have multiple connections to the same local file, but concurrent writes are still constrained by SQLite locking.
- `await db.refresh(model)` mutates the passed ORM object with database-loaded values and returns `None`.
- `scalar_one_or_none()` returns one model, `None`, or raises if more than one row is found.

Current caveats:

- `create_message` and `list_messages` still call the old repository shape and are not part of today's completed persistence loop.
- Message persistence remains out of scope.
- No focused repository/API persistence test has been added yet.
- Alembic initialization remains out of scope.
- Structlog remains out of scope.

Recommended starting point for the next session:

1. Read this progress update first.
2. Review these files:

```text
app/db/session.py
app/api/routes/sessions.py
app/services/sessions.py
app/repositories/sessions.py
```

3. Start with one of these next tasks:

```text
Option A:
  Add a focused test for POST /sessions + GET /sessions/{session_id}
  so today's persistence loop is protected.

Option B:
  Update create_message/list_messages so they do not call the old
  repository.get_session(session_id) signature.

Option C:
  Begin Message persistence after reviewing the Session persistence path.
```

Suggested prompt for tomorrow:

```text
请先带我复盘 Day 5 的 Session persistence 链路，然后从添加一个最小 persistence test 开始。
```

## Next Week Strategy

If roughly 2 hours per day are available next week, do not rush into Phase 2 yet.

The next major objective is:

```text
Finish Phase 1 as a reliable, testable, explainable small backend system.
```

The learning principle is:

```text
Go slower at the foundation so later phases can move faster.
```

Phase 1 should be considered truly learned only when the full request path can be explained clearly:

```text
FastAPI route
  -> Pydantic validation
  -> service use case
  -> repository
  -> AsyncSession
  -> SQLAlchemy model
  -> SQLite persistence
  -> response schema
  -> HTTP response
```

Recommended next-week focus:

- Make Session persistence reliable.
- Make Message persistence reliable.
- Add focused tests for repository/API behavior.
- Initialize Alembic only after the persistence path is understood.
- Add basic structured logging if time remains.
- Update docs and tracking as part of the definition of done.

Avoid these until Phase 1 is closed:

- LangGraph / Agent orchestration.
- SSE streaming.
- Kafka / Celery / Redis.
- RAG / plugin systems.

Methodology for future sessions:

- Prefer guided implementation over full delegation.
- Explain each boundary before coding it.
- Let the learner write core pieces when feasible.
- Use Codex for review, debugging, test running, and architecture checks.
- Treat "can explain the design in my own words" as part of the DoD.

Projected progress if next week gets about 10 focused hours:

```text
Phase 1: about 85%-95%
Overall project: about 22%-25%
```

The desired end-of-week state:

```text
Phase 1 closed as a reliable, persistent Session/Message backend,
ready to support Phase 2 Agent orchestration.
```
