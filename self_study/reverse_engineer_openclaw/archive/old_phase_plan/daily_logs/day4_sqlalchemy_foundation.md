# Day 4 SQLAlchemy Foundation

Date: 2026-05-22

## Schedule Note

This was the next project day after Day 3, but the actual execution date moved to 2026-05-22 because the week was busy.

The focus was intentionally narrow: build the SQLAlchemy persistence foundation without replacing the existing in-memory repository yet.

## Goal

Move from the Day 3 route / service / repository skeleton toward real persistence by defining the first SQLAlchemy database layer:

```text
Pydantic schema
  -> service use case
  -> repository boundary
  -> SQLAlchemy model / database session
```

Today was about understanding the persistence boundary, not maximizing code volume.

## Completed Today

- Reviewed the current API layering:
  - `app/api/routes/sessions.py`
  - `app/services/sessions.py`
  - `app/repositories/sessions.py`
  - `app/schemas/session.py`
  - `app/schemas/message.py`
- Clarified the responsibility split:

```text
route:
  HTTP boundary and error translation.

service:
  Business rules and use-case orchestration.

repository:
  Persistence boundary.

schema:
  API request/response contract.

model:
  Database table mapping.
```

- Designed the first persistence model:

```text
sessions 1 ---- * messages
```

- Created the database/model directories:
  - `app/db/`
  - `app/models/`
- Added SQLAlchemy base:
  - `app/db/base.py`
- Added SQLAlchemy models:
  - `app/models/session.py`
  - `app/models/message.py`
- Added async database session foundation:
  - `app/db/session.py`
- Added persistence dependencies:
  - `sqlalchemy>=2`
  - `aiosqlite>=0.19`
  - `alembic>=1.13`
- Installed project dependencies into the existing virtual environment.
- Created `openclaw.db` using the SQLAlchemy metadata sanity script.
- Verified SQLite contains the expected tables:

```text
messages
sessions
```

- Ran existing tests successfully.

## Concepts Learned

### SQLAlchemy Base

`Base` is the ORM model registry. Models inherit from it so SQLAlchemy can collect their table metadata.

### `Mapped`

`Mapped[...]` marks a class attribute as managed by SQLAlchemy ORM. It can represent either a database column or a relationship.

### `mapped_column`

`mapped_column(...)` defines a real database column.

### `ForeignKey`

`ForeignKey("sessions.id")` defines the database-level relationship from `messages.session_id` to `sessions.id`.

### `relationship`

`relationship(...)` defines Python object navigation. It does not create a database column by itself.

### `back_populates`

`back_populates` tells SQLAlchemy that two relationship attributes are the two sides of the same relationship:

```text
SessionModel.messages <-> MessageModel.session
```

### Database URL

```text
sqlite+aiosqlite:///./openclaw.db
```

Means:

```text
sqlite:
  Use SQLite.

aiosqlite:
  Use the async SQLite driver.

./openclaw.db:
  Store the database file in the current working directory.
```

### Async / Await

`await` pauses the current coroutine and gives control back to the event loop. It does not automatically make blocking synchronous code non-blocking.

## Current Verification

Existing tests remain green. This only proves the previous schema/API behavior was not broken; it does not yet test the new SQLAlchemy models.

SQLite table verification was done with Python's built-in `sqlite3` module by querying `sqlite_master`.

## Day 4 Definition of Done

- [x] Explain why route, service, repository, schema, and model are separate layers.
- [x] Explain why `Message` belongs to `Session`.
- [x] Define `SessionModel` and `MessageModel`.
- [x] Explain `ForeignKey`, `relationship`, and `back_populates`.
- [x] Add SQLAlchemy async engine and sessionmaker foundation.
- [x] Create `openclaw.db`.
- [x] Confirm `sessions` and `messages` tables exist.
- [x] Run existing tests and keep them green.

## Remaining Notes

- The application still uses the in-memory repository.
- Alembic has been installed but not initialized.
- The SQLAlchemy models do not yet have dedicated tests.
- The repository has not yet been converted to `AsyncSession`.
- API requests do not yet persist to `openclaw.db`.

## Next Suggested Day

Use the SQLAlchemy foundation to begin replacing the in-memory repository:

```text
FastAPI dependency
  -> AsyncSession
  -> repository methods
  -> service orchestration
  -> real SQLite persistence
```

Suggested next steps:

- Add a `get_db_session` dependency.
- Write a small model/repository test.
- Implement database-backed `create_session`.
- Implement database-backed `get_session`.
- Keep message persistence as the stretch goal.
