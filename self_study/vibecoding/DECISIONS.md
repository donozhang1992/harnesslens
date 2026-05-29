# Decision Log

## 2026-05-29: Use `AGENTS.md` as the Project Rule Mechanism
Codex project-level behavior belongs in `AGENTS.md`. Karpathy-inspired coding discipline is summarized there rather than copied wholesale into a separate Cursor-style rule file.

## 2026-05-29: Treat This as a Learning Harness
The app should be complete enough to exercise a real full-stack workflow, but scope must stay smaller than a production project. Authentication, deployment, billing, and complex collaboration are out of scope.

## 2026-05-29: Use Contract-First Parallelization
Frontend and backend can run in parallel only after DTOs and route contracts are stable. This reduces agent conflicts and keeps integration concrete.

## 2026-05-29: Use TDD With Independent Verification
Implementation agents may run their own local tests, but final validation should be performed by the main agent or an independent QA agent. This avoids relying only on the worker that wrote the implementation.

## 2026-05-29: Assign Agents by File Ownership
Multi-agent work should be split by module/file ownership rather than broad feature labels. This lowers merge conflicts and makes accountability clearer.

## 2026-05-29: Freeze API Behavior in `CONTRACT.md`
The frontend, backend, tests, and agents should treat `CONTRACT.md` as the source of truth for DTOs, status codes, error shapes, timestamp format, and move-position behavior.

## 2026-05-29: Separate JSON Response Validation From SSE Event Validation
Normal backend JSON endpoints must use Pydantic response models. SSE endpoints stream events, so each event payload must be created from a Pydantic model before serialization instead of using a normal JSON response model.
