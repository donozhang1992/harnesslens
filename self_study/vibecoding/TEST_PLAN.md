# Test Plan

## Principles
- Tests or validation scripts must exist before production implementation.
- Endpoint validation must include successful and failure cases.
- Backend responses must be validated against Pydantic response models.
- SSE payloads must be generated from Pydantic event models before serialization.
- Frontend validation must cover the behaviors users can feel: render, drag latency, rollback, and audit visibility.
- Validation should follow `CONTRACT.md`; if implementation schemas diverge, update the contract, schemas, frontend types, and tests together.

## Backend API Validation

### `GET /api/columns`
Success:
- Returns HTTP 200.
- Returns a list of columns sorted by `position`.
- Each column contains tasks sorted by `position`.
- Each task includes `id`, `column_id`, `title`, `description`, `priority`, `position`, and `updated_at`.

Failure:
- Database/session failure returns a controlled error response.
- Response shape violations are caught by tests.

### `POST /api/tasks`
Success:
- Returns HTTP 201.
- Creates a task in the first column when `column_id` is omitted.
- Assigns the task to the lowest available position in that column.
- Returns a Pydantic-validated task response.
- Creates an audit log entry.

Failure:
- Empty title returns HTTP 400 or 422.
- Invalid priority returns HTTP 400 or 422.
- Invalid target column returns HTTP 404.

### `PATCH /api/tasks/{id}/move`
Success:
- Moving within the same column produces contiguous zero-based positions.
- Moving across columns decrements trailing positions in the old column.
- Moving across columns increments trailing positions in the target column.
- The moved task receives the requested `target_column_id` and `new_position`.
- Creates an audit log entry.

Failure:
- Unknown task id returns HTTP 404.
- Unknown target column returns HTTP 404.
- Negative `new_position` returns HTTP 422.
- Failed transaction does not leave partial position updates.

Position boundary:
- `new_position` greater than the target column length is clamped to the end.

### `GET /api/audit-logs`
Success:
- Opens an SSE stream.
- Emits audit events after task creation and movement.
- Event payloads are parseable JSON.
- Event payloads match the audit event contract.

Failure:
- Stream setup errors are logged with standard logging.
- The endpoint does not use raw `print` statements.

## Frontend Validation

### Board Render
- Loads columns from the backend or local mock during isolated validation.
- Renders columns left-to-right by `position`.
- Renders tasks top-to-bottom by `position`.
- Uses dark mode styling with subtle borders and transitions.

### Task Creation
- Submitting a valid task calls the backend and updates the board.
- Empty title is rejected in the UI or by API response handling.
- Failure path displays a destructive toast or equivalent error state.

### Drag-and-Drop Optimistic Update
- On drag end, local state updates before the network response resolves.
- Reordering within a column recalculates positions.
- Moving across columns recalculates source and target positions.
- The PATCH request is sent asynchronously with `target_column_id` and `new_position`.

### Rollback
- If the PATCH request fails, board state returns to its previous layout.
- A destructive toast or visible error is shown.
- No duplicate tasks or position gaps are introduced.

### Audit Panel
- Panel can be collapsed and expanded.
- New audit entries appear at the top.
- New entries briefly highlight without re-rendering the whole page.

## Final Verification Checklist
- Backend validation passes.
- Frontend build or smoke validation passes.
- No raw Python `print` statements exist in backend code.
- All backend JSON route responses use Pydantic response models.
- All SSE payloads are serialized from Pydantic event models.
- Local run commands are known and documented.
