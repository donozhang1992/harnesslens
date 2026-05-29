# Kanban Harness Task Board

## Planning
- [ ] Review `AGENTS.md` and load task-specific docs according to its context loading rules.
- [ ] For orchestration work, review `PLAN.md`, `TASKS.md`, `CONTRACT.md`, and `TEST_PLAN.md`.
- [ ] Freeze API contract, DTO names, status codes, and error shapes.
- [ ] Choose SSE implementation: prefer `sse-starlette`, fallback to `StreamingResponse`.
- [ ] Choose frontend drag-and-drop library.
- [ ] Assign worker ownership by file path.
- [ ] Confirm loop-control rules: 3 repeated failures become a blocker, 2 stalled implementation attempts trigger handoff.

## Backend Tests First
- [ ] Add validation script or pytest coverage for `GET /api/columns` success.
- [ ] Add validation script or pytest coverage for `POST /api/tasks` success and invalid title failure.
- [ ] Add validation script or pytest coverage for `PATCH /api/tasks/{id}/move` success within a column.
- [ ] Add validation script or pytest coverage for `PATCH /api/tasks/{id}/move` success across columns.
- [ ] Add validation script or pytest coverage for invalid task/column move failures.
- [ ] Add SSE/audit-log smoke validation.
- [ ] Add at least one controlled backend failure validation if practical.
- [ ] Run backend tests before implementation and capture expected failures.

## Backend Implementation
- [ ] Create FastAPI app structure.
- [ ] Configure SQLAlchemy SQLite session lifecycle.
- [ ] Implement SQLAlchemy models for columns, tasks, and audit logs.
- [ ] Implement Pydantic v2 schemas for all requests and responses.
- [ ] Implement seed/demo data.
- [ ] Implement `GET /api/columns`.
- [ ] Implement `POST /api/tasks`.
- [ ] Implement transaction-safe `PATCH /api/tasks/{id}/move`.
- [ ] Implement audit log creation for mutations.
- [ ] Implement `GET /api/audit-logs` SSE stream.
- [ ] Run backend tests and fix failures.

## Frontend Tests and Validation
- [ ] Add executable smoke or unit validation for board render.
- [ ] Add executable smoke or unit validation for task creation.
- [ ] Add executable unit validation for optimistic drag reorder.
- [ ] Add executable unit validation for rollback on failed drag persistence.
- [ ] Add executable smoke or unit validation for audit panel updates.

## Frontend Implementation
- [ ] Create Next.js 15 app structure if missing.
- [ ] Configure Tailwind/shadcn-compatible styling.
- [ ] Implement high-end dark app shell.
- [ ] Implement board, column, and task card components.
- [ ] Implement frontend DTO types.
- [ ] Implement API client.
- [ ] Implement drag-and-drop.
- [ ] Implement optimistic state update and rollback.
- [ ] Implement destructive toast on persistence failure.
- [ ] Implement collapsible audit activity panel.
- [ ] Run frontend validation and fix failures.

## Integration
- [ ] Confirm frontend and backend route contracts match.
- [ ] Confirm CORS/local development setup works.
- [ ] Confirm sorted columns and tasks render correctly.
- [ ] Confirm task creation persists.
- [ ] Confirm drag within same column persists with stable positions.
- [ ] Confirm drag across columns persists with stable positions.
- [ ] Confirm audit logs are created and displayed.
- [ ] Run final backend validation.
- [ ] Run final frontend build or smoke validation.
- [ ] Document run commands and remaining gaps.
