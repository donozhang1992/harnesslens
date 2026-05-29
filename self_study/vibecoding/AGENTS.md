# Kanban Harness Project Rules

## Project Intent
- This project is a vibe-coding practice harness, not a production SaaS.
- Optimize for clear agent coordination, test-first execution, and a working end-to-end demo within a tight timebox.
- Keep scope disciplined: do not add authentication, multi-user permissions, deployment, billing, or unrelated product features unless explicitly requested.

## Tech Stack
- Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Backend: Python FastAPI, Pydantic v2, SQLite (SQLAlchemy)

## Karpathy-Inspired Agent Discipline
- Think before coding: identify assumptions, constraints, and verification before editing.
- Simplicity first: choose the smallest implementation that satisfies the current spec.
- Surgical changes: touch only files required by the assigned task.
- Goal-driven execution: every implementation task must end with a concrete validation result.

## Context Loading Rules
- Always read this `AGENTS.md` before non-trivial work.
- Read `CONTRACT.md` before implementing or testing frontend/backend API behavior.
- Read `TEST_PLAN.md` before adding or changing tests, validation scripts, or endpoint behavior.
- Read `PLAN.md` only when orchestrating multi-agent work or deciding execution order.
- Read `TASKS.md` when choosing the next implementation task or reporting progress.
- Read `SPEC.md` when implementation details are unclear after reading `CONTRACT.md`.
- Read `PRD.md` only when scope, user value, or product tradeoffs are unclear.
- Read `DECISIONS.md` before changing architecture, contracts, dependencies, or previously recorded choices.
- Do not load every project document by default; load the smallest set needed for the current task.
- If documents conflict, prefer this order: `CONTRACT.md` for API shape, `AGENTS.md` for process rules, `TEST_PLAN.md` for validation expectations, then `SPEC.md`, then `PRD.md`.

## Context Management
- Main agent owns global context: project goal, API contract, task status, integration state, and final verification.
- Worker agents own local context: assigned files, local tests, implementation notes, and known gaps.
- QA/review agents should receive enough context to verify behavior independently, not the full implementation history.
- Sub-agents should receive only the documents, file paths, and contract excerpts required for their assigned task.
- Do not ask every sub-agent to read every project document.
- Do not create long-lived memory files unless they help future implementation or review.
- Use `DECISIONS.md` for durable architecture, product, dependency, or contract decisions only; do not use it for routine progress notes.
- Use `TASKS.md` for task status when persistent progress tracking is useful.
- Worker handoffs must be compact and include changed files, tests/validation run, contract assumptions, risks/gaps, and next suggested step.
- Main agent should consolidate worker handoffs into task updates or final summaries when useful.
- Do not preserve detailed reasoning traces in project files; preserve decisions, outcomes, and validation evidence.

## Execution Guardrails
- NEVER use raw print Statements. Use python standard logging.
- All backend JSON responses MUST be strictly validated via Pydantic models.
- SSE event payloads MUST be created from Pydantic models before serialization.
- Frontend must implement Optimistic Updates for Drag-and-Drop to ensure 0ms latency feeling.
- Visual Design Goal: High-end dark mode aesthetic inspired by Linear/Vercel. Use proper subtle borders, grid textures, and smooth transitions.
- Always write a unit test or validation script before declaring a feature complete.

## Loop Control
- If the same command, test, or validation fails 3 times for the same apparent root cause, stop that branch and report a blocker with the commands run, observed failures, and the next recommended move.
- If an agent cannot make progress after 2 focused implementation attempts, hand off findings instead of continuing to churn.
- If fixing a failure requires expanding product scope, changing the API contract, changing the tech stack, or touching files outside the assigned ownership, stop and escalate to the main agent.
- Main agent may retry integration fixes, but each retry must change the strategy based on new evidence rather than repeating the same edit/run cycle.
- Long-running commands, dev servers, and watch processes should have an explicit purpose and must not be left running unless they are needed for user verification.

## TDD Guardrails
- MUST implement Test-Driven Development. 
- NEVER write production code before its corresponding test file exists.
- Every endpoint must have success validation before implementation.
- Every mutating endpoint must have client-error validation before implementation.
- At least one backend validation should cover controlled server/database failure if practical.
- Initial validation should be executed before implementation and fail for the expected reason.

## Multi-Agent Coordination
- Main agent owns architecture, task assignment, integration, conflict resolution, and final verification.
- Use sub-agents only for clearly scoped, parallelizable work with explicit file ownership.
- Prefer contract-first execution before spawning frontend/backend implementation workers.
- Backend and frontend work may run in parallel after `CONTRACT.md` is frozen.
- Workers must not revert or overwrite changes made by others; they must adapt to the current workspace state.
- Each worker must report changed files, tests run, and known gaps.
- Use independent QA/review agents for final validation rather than relying only on the implementation agents.
- Do not use 10+ agents in normal production mode unless the task is intentionally a coordination exercise or has naturally independent workstreams.

## File Ownership Defaults
- Main/backend lead owns backend app wiring such as `backend/app/main.py`.
- Backend test workers own `backend/tests/*` or `backend/scripts/*`.
- Backend schema workers own `backend/app/schemas.py`.
- Backend database workers own `backend/app/models.py` and `backend/app/database.py`.
- Backend service workers own `backend/app/services/*`.
- Backend route workers own `backend/app/routes/*`.
- Main/frontend lead owns frontend app wiring such as `frontend/app/page.tsx` and `frontend/app/globals.css`.
- Frontend board workers own `frontend/components/board/*`.
- Frontend state workers own `frontend/lib/reorder.ts` and `frontend/lib/board-state.ts`.
- Frontend API workers own `frontend/lib/api.ts`, `frontend/lib/types.ts`, and `frontend/lib/audit-stream.ts`.
- Frontend audit workers own `frontend/components/audit/*`.
