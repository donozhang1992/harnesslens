# API Contract

## Contract Rules
- All JSON endpoints live under `/api`.
- All JSON endpoint responses must be validated by Pydantic response models.
- SSE event payloads must be created from Pydantic event models before JSON serialization.
- JSON field names use snake_case to match backend models and reduce translation overhead.
- Timestamps are ISO 8601 strings in UTC.
- UUIDs are serialized as strings.
- This file is the planning-time source of truth. After backend schemas and OpenAPI exist, keep this file, Pydantic schemas, frontend types, and tests in sync.

## Shared DTOs

### `TaskDTO`

```json
{
  "id": "uuid-string",
  "column_id": "uuid-string",
  "title": "Task title",
  "description": null,
  "priority": "Medium",
  "position": 0,
  "updated_at": "2026-05-29T00:00:00Z"
}
```

Rules:
- `title` is a non-empty string.
- `description` is `string | null`.
- `priority` is one of `Low`, `Medium`, or `High`.
- `position` is a zero-based integer.

### `ColumnDTO`

```json
{
  "id": "uuid-string",
  "title": "Todo",
  "position": 0,
  "tasks": []
}
```

Rules:
- `title` is a non-empty string.
- `position` is a zero-based integer.
- `tasks` is always present and sorted by `position`.

### `AuditLogDTO`

```json
{
  "id": 1,
  "task_id": "uuid-string",
  "action": "TASK_CREATED",
  "details": {
    "title": "Task title"
  },
  "timestamp": "2026-05-29T00:00:00Z"
}
```

Rules:
- `action` is one of `TASK_CREATED`, `MOVED_LANE`, or `POSITION_REORDERED`.
- `details` is an object at the API boundary, even if stored as JSON text in SQLite.

### `ErrorDTO`

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message"
  }
}
```

Rules:
- Controlled application errors should use this shape.
- Framework-generated 422 validation errors are acceptable for malformed request bodies.
- Raw tracebacks must never be returned to the frontend.

## Endpoints

### `GET /api/columns`
Returns all columns with nested tasks.

Status:
- `200 OK`

Response:

```json
{
  "columns": [
    {
      "id": "uuid-string",
      "title": "Todo",
      "position": 0,
      "tasks": []
    }
  ]
}
```

Rules:
- Columns are sorted left-to-right by `position`.
- Tasks are sorted top-to-bottom by `position`.

### `POST /api/tasks`
Creates a task.

Request:

```json
{
  "title": "Task title",
  "description": null,
  "priority": "Medium",
  "column_id": null
}
```

Status:
- `201 Created` on success.
- `400 Bad Request` or `422 Unprocessable Entity` for invalid input.
- `404 Not Found` if a provided `column_id` does not exist.

Response:

```json
{
  "task": {
    "id": "uuid-string",
    "column_id": "uuid-string",
    "title": "Task title",
    "description": null,
    "priority": "Medium",
    "position": 0,
    "updated_at": "2026-05-29T00:00:00Z"
  }
}
```

Rules:
- If `column_id` is omitted or null, the task is created in the first column by `position`.
- The new task is appended at the end of the target column.
- Task creation writes a `TASK_CREATED` audit log.

### `PATCH /api/tasks/{id}/move`
Moves or reorders a task.

Request:

```json
{
  "target_column_id": "uuid-string",
  "new_position": 0
}
```

Status:
- `200 OK` on success.
- `404 Not Found` if the task or target column does not exist.
- `422 Unprocessable Entity` if `new_position` is negative or not an integer.

Response:

```json
{
  "task": {
    "id": "uuid-string",
    "column_id": "uuid-string",
    "title": "Task title",
    "description": null,
    "priority": "Medium",
    "position": 0,
    "updated_at": "2026-05-29T00:00:00Z"
  },
  "columns": [
    {
      "id": "uuid-string",
      "title": "Todo",
      "position": 0,
      "tasks": []
    }
  ]
}
```

Position rules:
- `new_position < 0` is invalid.
- `new_position` beyond the target column length is clamped to the end.
- After every move, affected columns must have contiguous zero-based task positions.
- The `columns` response contains the full current board after the move.
- Within-column moves create `POSITION_REORDERED`.
- Cross-column moves create `MOVED_LANE`.

### `GET /api/audit-logs`
Streams audit log events using Server-Sent Events.

Status:
- `200 OK` stream response.

Event payload:

```json
{
  "id": 1,
  "task_id": "uuid-string",
  "action": "TASK_CREATED",
  "details": {
    "title": "Task title"
  },
  "timestamp": "2026-05-29T00:00:00Z"
}
```

Rules:
- Prefer `sse-starlette` `EventSourceResponse`.
- If dependency installation is blocked, use FastAPI `StreamingResponse` with valid SSE formatting.
- Event data must be serialized from `AuditLogDTO`.
