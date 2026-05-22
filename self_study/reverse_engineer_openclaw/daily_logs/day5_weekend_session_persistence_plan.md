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
