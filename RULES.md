# HarnessLens Project Development Rules for Codex Agents

## 1. First Rule

Read `MIGRATION_PLAN.md` before changing code.

The active workspace has removed the deprecated metadata and relationship prototype. Do not restore it.

## 2. MVP Tech Stack

- Shared core: TypeScript package in `packages/core`.
- Browser extension: Manifest V3 + Vite + React + TypeScript.
- VS Code extension: TypeScript using VS Code extension APIs.
- Tests: Vitest for core/browser logic; VS Code extension tests may use mocked adapters first.
- No backend, telemetry, remote logging, or external AI calls.

## 3. Target Directory Structure

```text
harnesslens/
  packages/
    core/

  extensions/
    browser/
    vscode/
```

The browser workspace is `extensions/browser`. The deprecated metadata tool is not an active workspace.

## 4. Dependency Direction

- `packages/core` must be pure and reusable.
- `extensions/browser` may depend on `packages/core`.
- `extensions/vscode` may depend on `packages/core`.
- `packages/core` must not depend on React, DOM APIs, Chrome APIs, VS Code APIs, filesystem access, or Git command execution.

## 5. Deprecated MVP Work

Do not implement or improve:

- Commit-message metadata behavior.
- Relationship inference or relationship UI.
- Causality UI.

## 6. Browser DOM Safety

- Do not override major GitHub layout containers with `display: flex` or `display: grid`.
- Use layout only inside HarnessLens-owned containers.
- Prefer scoped styles or Shadow DOM.
- Use a GitHub DOM adapter module.
- Prefer semantic attributes and stable DOM signals over generated class names.

## 7. TDD Requirement

- Contract first.
- Tests second.
- Implementation third.
- QA independently validates.
- Test author and implementation worker must differ for Core, Browser, and VS Code tasks unless the user explicitly overrides.

## 8. Loop Control

- Each worker handles one bounded task and exits after handoff.
- Stop after two failed attempts for the same failure class.
- Stop if editing outside owned scope is required.
- Do not keep refactoring after acceptance criteria are met.
