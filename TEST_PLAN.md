# HarnessLens Test Plan

## 1. TDD Policy

HarnessLens uses test-first development.

Default sequence:

1. Confirm `MIGRATION_PLAN.md` and CONTRACT.md.
2. Write failing tests.
3. Implement code to pass tests.
4. Run independent QA.

Test author and implementation worker must differ for Core, Browser, and VS Code tasks unless the user explicitly overrides.

## 2. Core Tests

Required tests:

- `normalizePath` handles Windows separators and leading `./`.
- `classifyPath` detects root and nested harness files.
- `classifyPath` detects `.cursor/rules/**`, `.codex/**`, `.github/copilot-instructions.md`, `docs/adr/**`, `docs/spec/**`, `prompts/**`, `harness/**`.
- `classifyPath` detects validation files.
- `classifyPath` defaults unknown files to `code`.
- `groupChangedFiles` groups strings and ChangedFile objects.
- `groupChangedFiles` preserves input order and status.

Forbidden MVP tests:

- Git trailers.
- Commit hooks.
- Linked / Scoped / Grouped relationships.

## 3. Browser Extension Tests

Required tests:

- GitHub DOM adapter reads changed file paths and source elements.
- Category counts render for Harness / Validation / Code.
- All / Harness / Validation / Code filters update visible native file blocks or HarnessLens-owned wrappers.
- Harness panel lists changed harness files.
- Clicking a harness file jumps to native GitHub diff.
- Empty or changed GitHub DOM produces a safe empty state.
- UI copy does not imply causality.

## 4. VS Code Extension Tests

Required tests:

- Mocked Git changed-files provider returns changed files.
- Tree View groups Harness / Validation / Code.
- Count/status summary updates from grouped data.
- Open command calls VS Code file/diff APIs through a seam.
- Git provider unavailable state is safe and readable.

## 5. Integration Tests

Required flows:

- Core grouping feeds Browser UI.
- Core grouping feeds VS Code tree view.
- Browser build includes manifest and assets.
- VS Code extension package builds.

## 6. Manual Smoke

Browser:

- Load unpacked browser extension in Chrome/Edge.
- Open a real GitHub PR Files Changed page.
- Verify category counts, filters, and harness panel.

VS Code:

- Launch Extension Development Host.
- Open a Git repo with mixed changed files.
- Verify HarnessLens grouped view and open commands.

## 7. QA Independence

QA should:

- Read `MIGRATION_PLAN.md` first.
- Read PRD, SPEC, RULES, CONTRACT, TASKS, TEST_PLAN, and DESIGN as needed.
- Report findings first.
- Include commands run and residual risks.
- Confirm no active MVP path depends on Git hook/trailer/causality behavior.
