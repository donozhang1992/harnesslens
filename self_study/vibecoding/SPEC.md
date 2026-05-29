# System Specification: Industrial Kanban Board

## 1. System Architecture and Directory Structure
The project must use a decoupled monorepo-style structure:

```text
vibecoding/
  backend/   # FastAPI data and transaction layer
  frontend/  # Next.js 15 presentation layer
```

## 2. Backend Data Model
Use SQLite via SQLAlchemy. All request and response payloads must be validated with Pydantic v2 models.
The frozen API surface is defined in `CONTRACT.md`; this specification describes implementation requirements.

### Column
Represents a Kanban lane such as Todo, In Progress, Review, or Done.

- `id`: UUID string primary key.
- `title`: non-empty string.
- `position`: integer, zero-based left-to-right order.

### Task
Represents an individual card.

- `id`: UUID string primary key.
- `column_id`: UUID string foreign key linking to Column.
- `title`: non-empty string.
- `description`: optional text.
- `priority`: enum string: `Low`, `Medium`, or `High`.
- `position`: integer, zero-based top-to-bottom order within a column.
- `updated_at`: datetime updated on mutation.

### Audit Log
Tracks board mutations for the activity stream.

- `id`: integer primary key, auto-increment.
- `task_id`: UUID string.
- `action`: string such as `TASK_CREATED`, `MOVED_LANE`, or `POSITION_REORDERED`.
- `details`: JSON string containing the state delta.
- `timestamp`: datetime defaulting to current UTC time.

## 3. API Contract
All endpoints live under the `/api` prefix.

### `GET /api/columns`
Fetch all columns and nested tasks.

Requirements:
- Columns are sorted by `position`.
- Tasks inside each column are sorted by `position`.
- Response is validated by a Pydantic response model.

### `POST /api/tasks`
Create a task.

Request:
- `title`: required non-empty string.
- `description`: optional string.
- `priority`: optional enum, defaults to `Medium`.
- `column_id`: optional UUID string.

Requirements:
- If `column_id` is omitted, the task targets the first column by position.
- New task position is `max(position) + 1` in the target column.
- A task creation audit log entry is created.
- Successful creation returns `201 Created`.
- Response is validated by a Pydantic response model.

### `PATCH /api/tasks/{id}/move`
Move or reorder a task.

Request:

```json
{
  "target_column_id": "UUID",
  "new_position": 0
}
```

Requirements:
- Execute inside a database transaction.
- If moving within the same column, reorder adjacent tasks without position gaps.
- If moving across columns, decrement trailing tasks in the old column and increment trailing tasks in the target column.
- Reject negative positions with `422`.
- Clamp positions beyond the target column length to the end.
- Create an audit log entry.
- Response is validated by a Pydantic response model.

### `GET /api/audit-logs`
Stream audit log updates to the frontend.

Requirements:
- Use Server-Sent Events via `EventSourceResponse` or an equivalent FastAPI-compatible SSE response.
- Emit parseable JSON event payloads.
- Create event payloads from Pydantic models before serialization.
- Log stream setup/errors with standard Python logging.

## 4. Frontend Requirements
Use Next.js 15 App Router, TypeScript, Tailwind CSS, and shadcn/ui-style primitives.

### Visual Identity
- High-end dark workspace inspired by Linear and Vercel.
- Subtle borders, restrained contrast, and smooth transitions.
- Background may use a low-opacity grid texture.
- Cards should be compact, scannable, and work-focused.

### Board Rendering
- Fetch columns from the backend.
- Render columns left-to-right by position.
- Render tasks top-to-bottom by position.
- Support loading and error states.

### Drag-and-Drop
Use `@hello-pangea/dnd`, `@dnd-kit/core`, or another established drag-and-drop library.

Optimistic update requirements:
- On drag end, immediately update React local state before awaiting the network response.
- Fire `PATCH /api/tasks/{id}/move` asynchronously.
- If the request fails, restore the pre-drag state.
- Show a destructive toast or equivalent visible error on rollback.

### Task Creation
- Provide a simple task creation flow.
- Validate non-empty title.
- Update UI after successful creation.
- Show a visible error on failure.

### Live Activity Stream
- Provide a collapsible activity panel.
- Connect to `/api/audit-logs` using `EventSource`.
- Insert new logs at the top.
- Briefly highlight newly received logs without forcing a full-page re-render.

## 5. Non-Functional Requirements
- No raw Python `print` statements; use standard logging.
- Keep implementation small and understandable.
- Favor focused unit tests and validation scripts over broad unverified behavior.
- Keep frontend interactions fast and responsive.
- Document local run and validation commands once implementation exists.
