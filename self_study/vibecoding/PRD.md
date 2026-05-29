# Product Requirements Document: Kanban Harness

## Purpose
Build a small but realistic Kanban board to practice Codex-driven vibe coding, especially contract-first planning, TDD, multi-agent delegation, and final integration discipline.

This is a learning harness. The goal is not to create a perfect commercial product; the goal is to complete a coherent full-stack system under a tight timebox while keeping agent work coordinated and verifiable.

## Target User
- Primary user: the project owner learning vibe coding.
- Secondary user: future agents using this repo as a repeatable coordination exercise.

## Core User Stories
- As a user, I can see a board with ordered columns and ordered tasks.
- As a user, I can create a task and see it appear in the first column.
- As a user, I can drag a task within a column or across columns and see the UI update instantly.
- As a user, I can see activity updates for board mutations.
- As an agent orchestrator, I can split the project into backend, frontend, and verification work without ambiguous ownership.

## In Scope
- FastAPI backend with SQLite persistence.
- Pydantic v2 request/response validation.
- SQLAlchemy models for columns, tasks, and audit logs.
- API routes for reading columns, creating tasks, moving tasks, and streaming audit logs.
- Next.js 15 frontend using TypeScript, Tailwind CSS, and shadcn/ui-style components.
- Optimistic drag-and-drop with rollback on failure.
- Validation scripts or tests for backend API behavior and frontend critical paths.
- Seed/demo data sufficient for local use.

## Out of Scope
- Authentication and authorization.
- Multi-user collaboration semantics beyond a local audit stream.
- Cloud deployment.
- Billing, teams, notifications, or integrations.
- Complex custom workflow automation.
- Perfect mobile UX.

## Success Criteria
- The app runs locally with separate frontend and backend processes.
- The board loads columns and nested tasks from the backend.
- Creating a task persists and returns a validated response.
- Dragging a task feels instant in the frontend and persists through the backend move endpoint.
- Failed drag persistence rolls back local state and surfaces an error.
- Audit log events are visible or streamable from the frontend.
- Backend endpoint tests or validation scripts cover success and failure cases.
- Final verification commands are documented and executed before declaring completion.

## Learning Goals
- Practice writing project rules before implementation.
- Practice contract-first frontend/backend parallelization.
- Practice TDD with validation scripts before production code.
- Practice safe multi-agent delegation with disjoint ownership.
- Practice independent QA instead of trusting implementation agents alone.
