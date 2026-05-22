# Phase 1 Learning Map: Backend Foundations

This note organizes the Phase 1 learning material by conceptual layers, difficulty, and dependency relationships.

It is not a daily log. It is a study map for reviewing what has been learned and for continuing the project in a new conversation.

## How To Update This Note

Use this file as a stable learning map, not as a progress diary.

Update it when a concept becomes reusable across days or when the structure of the learner's mental model changes.

Good updates include:

- adding a new conceptual layer;
- clarifying the responsibility of an existing layer;
- recording a durable distinction, such as schema vs model or engine vs session;
- adding a new dependency relationship between concepts;
- updating the current project state after a meaningful milestone;
- adding a new next learning target when the old one is completed.

Avoid using this note for:

- daily task checklists;
- raw command outputs;
- temporary debugging notes;
- one-off implementation details;
- incomplete ideas that have not yet been tested or explained.

Where information should go:

```text
daily_logs/:
  daily plan, execution notes, blockers, completion status

03_TRACKING.md:
  short index, current phase, next planned work

docs/phase1_learning_map.md:
  stable concepts, layered understanding, learning principles, durable project state
```

When updating this note, preserve the dependency order:

```text
boundary thinking
  -> contracts
  -> routes
  -> services
  -> repositories
  -> models
  -> database sessions
  -> tests
  -> migrations
  -> later phases
```

## 0. Core Mental Model

Phase 1 is about turning a backend from a collection of files into a system with clear boundaries.

The central request path is:

```text
HTTP request
  -> FastAPI route
  -> Pydantic validation
  -> service use case
  -> repository boundary
  -> AsyncSession
  -> SQLAlchemy model
  -> SQLite table
  -> response schema
  -> HTTP response
```

The main discipline is:

```text
Before writing code, decide which layer owns the responsibility.
```

## 1. Level One: System Boundary Thinking

### What To Learn

Understand that backend architecture is mostly about boundaries:

- where outside input enters;
- where data is validated;
- where business decisions happen;
- where persistence happens;
- where infrastructure details are isolated.

### Key Ideas

```text
Route is not business logic.
Service is not HTTP.
Repository is not policy.
Schema is not database storage.
Model is not API contract.
```

### What To Internalize

Do not ask first:

```text
Where can I put this code so it works?
```

Ask:

```text
Which layer should own this responsibility?
```

This is the foundation for every later phase.

## 2. Level Two: API Contracts With Pydantic

### Role In The System

Pydantic schemas define the system's external data contract.

They answer:

- What can the client send?
- What will the server return?
- Which invalid inputs are rejected before business logic runs?

### Current Schema Concepts

```text
SessionCreate:
  input contract for creating a session

SessionRead:
  output contract for returning a session

MessageCreate:
  input contract for creating a message

MessageRead:
  output contract for returning a message
```

### Important Validation Examples

- invalid UUID should be rejected;
- invalid message role should be rejected;
- empty or whitespace-only content should be rejected;
- invalid metadata type should be rejected.

### What To Internalize

Bad data should be stopped at the boundary.

Pydantic schemas protect the service layer from having to defend against every malformed input manually.

## 3. Level Three: HTTP Boundary With FastAPI Routes

### Role In The System

Routes are HTTP translators.

They own:

- path/body/query inputs;
- dependency injection;
- response models;
- HTTP status codes;
- mapping service errors into HTTP errors.

They should not own:

- database logic;
- business rules;
- persistence decisions.

### Current Endpoints

```text
POST /sessions
GET /sessions/{session_id}
POST /sessions/{session_id}/messages
GET /sessions/{session_id}/messages
```

### What To Internalize

Route code should be thin.

If the route starts to know too much about database tables or business rules, the boundary is leaking.

## 4. Level Four: Service Layer As Use-Case Boundary

### Role In The System

The service layer owns business use cases.

For the current project, examples include:

- create a session with default status;
- look up a session or raise `SessionNotFoundError`;
- create a message only if the parent session exists;
- list messages only for an existing session.

### Key Business Rule

```text
Message cannot exist independently of Session.
```

This is not just a database rule. It is a domain rule.

### What To Internalize

The service layer decides what should happen.

The repository decides how data is stored or fetched.

## 5. Level Five: Repository As Persistence Boundary

### Role In The System

The repository is the storage boundary.

It hides the storage implementation from the service layer.

Current state:

```text
repository uses in-memory dictionaries
```

Target state:

```text
repository uses SQLAlchemy AsyncSession and SQLite
```

### Why This Layer Matters

The repository allows this migration:

```text
in-memory dict
  -> SQLite
  -> PostgreSQL later
```

without making the route layer understand database details.

### What To Internalize

The repository is where persistence details belong.

If storage changes from SQLite to PostgreSQL, service and route code should change as little as possible.

## 6. Level Six: Database Modeling With SQLAlchemy

### Role In The System

SQLAlchemy models describe database tables and relationships.

They are not API schemas.

### Current Models

```text
SessionModel
  -> sessions table

MessageModel
  -> messages table
```

Relationship:

```text
Session 1 ---- * Message
```

### Important Concepts

#### `Base`

The ORM model registry.

Models inherit from `Base` so SQLAlchemy can collect table metadata.

#### `Mapped[...]`

Marks an attribute as managed by SQLAlchemy ORM.

It can represent either:

- a database column;
- a relationship attribute.

#### `mapped_column(...)`

Defines a real database column.

#### `ForeignKey`

Defines database-level referential integrity.

Example:

```text
messages.session_id -> sessions.id
```

This prevents orphan messages at the database level.

#### `relationship(...)`

Defines Python object navigation.

It does not create a database column by itself.

Example:

```text
session.messages
message.session
```

#### `back_populates`

Tells SQLAlchemy that two relationship attributes are the two sides of the same relationship:

```text
SessionModel.messages <-> MessageModel.session
```

### Most Important Sentence

```text
ForeignKey protects database integrity.
relationship provides Python object navigation.
back_populates synchronizes the two relationship ends.
```

### What To Internalize

`SessionRead` and `SessionModel` are different on purpose:

```text
SessionRead:
  API response contract

SessionModel:
  database table mapping
```

Do not collapse API contracts and persistence models into one object just because the fields look similar.

## 7. Level Seven: Database Infrastructure

### Database URL

Current database URL:

```text
sqlite+aiosqlite:///./openclaw.db
```

Meaning:

```text
sqlite:
  database type

aiosqlite:
  async driver

./openclaw.db:
  local SQLite database file
```

### Driver

The URL says where and how to connect.

The driver is the Python library that actually talks to the database.

Mental model:

```text
SQLAlchemy
  -> driver
  -> database
```

### Engine

The engine is long-lived database infrastructure.

It is used for:

- creating connections;
- creating tables in development sanity checks;
- migration setup;
- low-level database access.

### AsyncSession

The session is a short-lived unit of database work.

It is used for:

- add;
- query;
- commit;
- rollback;
- refresh.

### Rule Of Thumb

```text
engine:
  infrastructure and schema-level operations

session:
  business CRUD operations
```

## 8. Level Eight: Async Understanding

### Core Idea

`await` does not mean "block everything until done."

It means:

```text
Pause this coroutine and give control back to the event loop.
Resume this coroutine when the awaited work is ready.
```

### Important Distinction

This is cooperative async:

```python
await asyncio.sleep(5)
```

This blocks the event loop:

```python
time.sleep(5)
```

Even if `time.sleep(5)` appears inside an `async def`, it is still blocking.

### What To Internalize

Async does not make a single slow operation disappear.

It lets multiple waiting operations overlap.

For backend APIs, this matters because many requests may be waiting on I/O at the same time:

```text
database I/O
network I/O
LLM streaming
message queue operations
```

## 9. Level Nine: Testing Mindset

### What Current Tests Prove

Current tests mainly prove schema validation behavior.

They verify things like:

- valid schema payloads are accepted;
- invalid fields are rejected;
- message content is normalized or rejected.

### What Current Tests Do Not Yet Prove

They do not yet prove:

- SQLAlchemy models work correctly;
- repository writes to SQLite;
- API requests persist data;
- process restart preserves data;
- Alembic migrations create the correct schema.

### What To Internalize

A green test suite only proves what it actually tests.

When a new layer is added, add tests that exercise that layer.

## 10. Concept Dependency Ladder

Learn and review in this order:

```text
1. Boundary ownership
2. Pydantic contracts
3. FastAPI routes
4. Service use cases
5. Repository boundary
6. SQLAlchemy models
7. Engine and AsyncSession
8. Repository-backed persistence
9. API tests
10. Alembic migrations
11. Structured logging
12. Phase 2 agent orchestration
```

Do not jump to Phase 2 until the first eight items feel explainable.

## 11. Current Project State

Completed foundation:

- FastAPI app skeleton exists.
- Pydantic Session/Message schemas exist.
- Schema tests exist and pass.
- Route/service/repository skeleton exists.
- Repository is still in-memory.
- SQLAlchemy Base exists.
- Session/Message SQLAlchemy models exist.
- Async engine/sessionmaker foundation exists.
- `openclaw.db` was created.
- SQLite contains `sessions` and `messages` tables.

Not yet complete:

- API does not yet write to SQLite.
- Repository has not yet been converted to `AsyncSession`.
- Message persistence is not database-backed yet.
- Alembic is installed but not initialized.
- SQLAlchemy model/repository/API persistence tests are not yet added.
- Structlog is installed but not configured.

## 12. Next Learning Target

The next target is the smallest real persistence loop:

```text
POST /sessions
  -> route
  -> service
  -> repository
  -> AsyncSession
  -> SessionModel
  -> SQLite row

GET /sessions/{session_id}
  -> route
  -> service
  -> repository
  -> AsyncSession
  -> SessionModel
  -> SessionRead
```

Success sentence:

```text
Session creation and lookup no longer depend on in-memory dictionaries; they persist through SQLite.
```

## 13. Learning Principles

Use these principles for the rest of Phase 1:

- Prefer understanding boundaries before coding.
- Prefer small closed loops over broad unfinished changes.
- Let the learner write core pieces when feasible.
- Use Codex for review, debugging, test running, and architecture checks.
- Treat "I can explain this in my own words" as part of the definition of done.
- Keep Phase 2 out of scope until Phase 1 is reliable, testable, and explainable.
