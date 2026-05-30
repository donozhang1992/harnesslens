# HarnessLens Migration Task Plan

## Task Status Lifecycle

- `pending`: task is defined but dependencies are not ready.
- `ready-for-tests`: contract is ready and a test author may start.
- `tests-in-progress`: a test author owns the scope.
- `tests-authored`: tests exist and implementation may start.
- `ready-for-impl`: implementation dependencies are satisfied.
- `impl-in-progress`: implementation worker owns the scope.
- `blocked`: worker needs main-agent decision.
- `done`: acceptance criteria are satisfied.
- `qa-reviewed`: QA independently reviewed the slice.

## Lock Protocol

- Main agent must mark task status and owner before dispatch.
- One task may have only one active owner.
- One write scope may have only one active writer.
- Workers must stop if they need to edit outside scope.
- Workers must read `MIGRATION_PLAN.md` first.

## Phase 0: Harness Reset

`MIGRATION-HARNESS-01` - Freeze new direction

- Owner: main agent.
- Status: done.
- Files: PRD.md, SPEC.md, CONTRACT.md, RULES.md, AGENTS.md, TEST_PLAN.md, DESIGN.md, TASKS.md, TODO.md, MIGRATION_PLAN.md, `.codex/agents/**`.
- Acceptance: new agent can identify Keep / Delete / Refactor / Add instructions without prior chat context.

## Phase 1: Core Reset

`CORE-TEST-02` - Simplified core tests

- Owner: core test worker.
- Status: done.
- Depends on: CONTRACT.md v0.2 and MIGRATION_PLAN.md.
- Own files: `packages/core/tests/**`.
- Acceptance: tests cover `normalizePath`, `classifyPath`, `groupChangedFiles`, recursive harness, validation, and unknown-to-code behavior. Tests do not cover trailers or relationships.

`CORE-IMPL-02` - Simplify core implementation

- Owner: core implementation worker.
- Status: done.
- Depends on: CORE-TEST-02.
- Own files: `packages/core/src/**`, `packages/core/package.json` if needed.
- Acceptance: core tests pass, active exports match CONTRACT.md v0.2, no active trailer/relationship exports remain.

## Phase 2: Remove Git Hook From Active MVP

`RESET-REMOVE-HOOK-01` - Remove deprecated metadata tool

- Owner: migration worker.
- Status: done.
- Depends on: CORE-IMPL-02.
- Own files: `tools/git-hook/**`, root package scripts, package lock updates.
- Acceptance: active workspace test/build no longer depends on deprecated metadata tooling.

## Phase 3: Browser Extension Reset

`BROWSER-TEST-01` - Browser category isolation tests

- Owner: browser test worker.
- Status: done.
- Depends on: CORE-IMPL-02.
- Own files: browser extension tests/fixtures.
- Acceptance: tests cover changed-file DOM adapter, category counts, All/Harness/Validation/Code filters, Harness panel, and jump-to-native-diff behavior. Tests do not mention Linked/Scoped/Grouped.

`BROWSER-IMPL-01` - Browser category isolation implementation

- Owner: browser implementation worker.
- Status: done.
- Depends on: BROWSER-TEST-01.
- Own files: `extensions/browser/**`.
- Acceptance: browser tests pass, GitHub native diff remains intact, UI uses Harness / Validation / Code language only.

## Phase 4: VS Code Extension MVP

`VSCODE-TEST-01` - VS Code grouped changes tests

- Owner: VS Code test worker.
- Status: done.
- Depends on: CORE-IMPL-02.
- Own files: `extensions/vscode/tests/**` and test fixtures.
- Acceptance: tests cover mocked changed-files provider, grouping, tree items, count summary, and open file/diff command seams.

`VSCODE-IMPL-01` - VS Code grouped changes implementation

- Owner: VS Code implementation worker.
- Status: done.
- Depends on: VSCODE-TEST-01.
- Own files: `extensions/vscode/**`.
- Acceptance: VS Code extension builds and grouped changed-files tests pass.

`VSCODE-TEST-02` - VS Code activation and native adapter tests

- Owner: VS Code test worker.
- Status: done.
- Depends on: VSCODE-IMPL-01.
- Own files: `extensions/vscode/tests/**`.
- Acceptance: tests cover Git resource mapping, conservative dedupe, grouped tree nodes, readable unavailable state, refresh registration, native open file/diff commands, and status summary publication.

`VSCODE-IMPL-02` - VS Code activation and native adapter seams

- Owner: VS Code implementation worker.
- Status: done.
- Depends on: VSCODE-TEST-02.
- Own files: `extensions/vscode/src/**`.
- Acceptance: VS Code activation seam tests pass without leaking VS Code APIs into core.

## Phase 5: Integration and QA

`INTEGRATION-02` - Active workspace integration

- Owner: main agent or integration worker.
- Status: done.
- Depends on: CORE-IMPL-02, RESET-REMOVE-HOOK-01, BROWSER-IMPL-01, VSCODE-IMPL-01.
- Acceptance: root scripts test/build/typecheck active MVP workspaces only.

`QA-02` - Migration QA

- Owner: QA agent.
- Status: qa-reviewed.
- Depends on: INTEGRATION-02.
- Do not edit files.
- Acceptance: findings-first report confirms no active MVP Git hook, trailer, relationship, or causality behavior remains.
