# One-Hour Vibe Coding Plan

## Operating Model
Use contract-first TDD with parallel frontend/backend execution after the API shape is stable.

The main agent coordinates the work, assigns file ownership, integrates results, and performs final verification. Worker agents should be scoped to independent modules and must report changed files and test results.

## Phase 0: Read and Freeze Scope (0-5 min)
- Read `AGENTS.md`, then load the smallest additional document set required by the current role.
- For orchestration, read `PLAN.md`, `TASKS.md`, `CONTRACT.md`, and `TEST_PLAN.md`; read `PRD.md` or `SPEC.md` only when scope or implementation details are unclear.
- Confirm the minimal demo scope.
- Freeze DTO names, API routes, status codes, error shapes, and response shapes before frontend/backend workers begin.
- Confirm dependency choices: prefer `sse-starlette` for SSE and choose one drag-and-drop library before implementation.

## Phase 1: Tests and Contract First (5-15 min)
- Backend test agent writes API validation tests/scripts for success and failure cases.
- Move logic test agent writes reorder edge-case tests.
- Frontend validation agent writes executable smoke or unit validation for render, drag, rollback, and audit panel behavior.
- Main agent confirms tests fail for expected reasons before production implementation proceeds.

## Phase 2: Parallel Implementation (15-40 min)
Backend workstreams:
- Database/session/models.
- Pydantic schemas and route contracts.
- Columns/tasks endpoints.
- Move transaction service.
- Audit log and SSE stream.

Frontend workstreams:
- App shell and dark board layout.
- Board, column, and card components.
- Reorder/optimistic state logic.
- API client and DTO types.
- Audit panel and stream client.

## Phase 3: Integration and Fixes (40-55 min)
- Wire frontend to backend contract.
- Run backend tests/validation scripts.
- Run frontend lint/build/smoke checks.
- Fix contract mismatches, CORS issues, ordering bugs, and optimistic rollback issues.
- Keep fixes scoped; avoid new features.

## Phase 4: Demo Readout (55-60 min)
- Confirm local run commands.
- Summarize what works.
- List remaining gaps honestly.
- Record any major decisions in `DECISIONS.md`.

Note: phase times are planning budgets for the one-hour training exercise, not hard runtime guarantees.

## Suggested Agent Topology
- Main agent: orchestration, integration, final verification.
- Contract/test agent: backend API tests and DTO contract.
- Backend DB agent: SQLAlchemy models and session setup.
- Backend API agent: columns/tasks routes.
- Backend move agent: transaction-safe reorder logic.
- Backend audit agent: audit log persistence and SSE.
- Frontend shell agent: layout and visual system.
- Frontend board agent: board/column/card components.
- Frontend state agent: reorder and optimistic rollback logic.
- Frontend API agent: client/types/audit stream.
- QA agent: independent test runner and integration review.

## Coordination Rules
- Do not let multiple workers edit the same file unless the main agent explicitly serializes them.
- Assign ownership by file path, not by vague feature name.
- Run local validation within each workstream before integration.
- Main agent performs the final test run and resolves conflicts.
- Workers should return compact handoffs instead of long implementation narratives.
- Follow `AGENTS.md` loop-control rules: repeated failures should become blockers with evidence, not endless retry loops.
- Main agent should give checkpoint updates after major phase transitions, contract changes, or failed integration attempts.
- Stop for human review only when blocked, when the contract must change, or when the work would expand beyond the agreed demo scope.

## Worker Handoff Template
Each worker should finish with:

```text
Changed files:
- path/to/file

Tests/validation run:
- command or "not run" with reason

Contract assumptions:
- relevant DTO/status/error behavior used

Risks/gaps:
- remaining issue or "none known"

Retry/blocker status:
- attempts made, if any, or "none"

Next suggested step:
- one concrete follow-up
```

## Default File Ownership
- Backend tests: `backend/tests/*` or `backend/scripts/*`.
- Backend schemas: `backend/app/schemas.py`.
- Backend database: `backend/app/models.py`, `backend/app/database.py`.
- Backend services: `backend/app/services/*`.
- Backend routes: `backend/app/routes/*`.
- Backend wiring: `backend/app/main.py`, owned by main/backend lead.
- Frontend shell: `frontend/app/page.tsx`, `frontend/app/globals.css`, owned by main/frontend lead.
- Frontend board UI: `frontend/components/board/*`.
- Frontend state logic: `frontend/lib/reorder.ts`, `frontend/lib/board-state.ts`.
- Frontend API/types: `frontend/lib/api.ts`, `frontend/lib/types.ts`, `frontend/lib/audit-stream.ts`.
- Frontend audit UI: `frontend/components/audit/*`.

## Target Levels
Minimum demo target:
- Load columns/tasks.
- Create a task.
- Move tasks with optimistic UI and backend persistence.
- Run backend validation and frontend build or smoke validation.

Training full target:
- Everything in the minimum demo.
- SSE audit stream and collapsible frontend audit panel.
- Independent QA agent review.
