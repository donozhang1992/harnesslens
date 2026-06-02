# HarnessLens Migration Plan

## 1. Product Reset Statement

The earlier Git metadata and relationship prototype has been removed from the
active workspace. Do not restore it.

The new MVP is Harness / Validation / Code isolation across:

- Browser extension for GitHub PR review.
- VS Code extension for local working tree review.
- Shared core classification package.

Do not continue Git hook or causality work.

## 2. Keep / Delete / Refactor / Add Matrix

### Keep

- `packages/core` package location.
- Existing harness path classification knowledge.
- Tests that verify recursive harness classification, after renaming `execution` to `code`.
- Browser DOM adapter concept.
- Scoped styling and GitHub DOM safety rules.
- TDD and multi-agent harness process.

### Delete From MVP

- Deprecated Git metadata tools and tests.
- Commit-message metadata parsing or formatting.
- Relationship UI and tests.
- Any UI copy implying causality.

### Refactor

- Browser prototype to `extensions/browser`.
- `ComparisonSurface` to a category isolation UI such as `CategoryFilterBar`, `HarnessPanel`, or `BrowserIsolationView`.
- `ArtifactKind` value `execution` to `code`.
- Relationship model to simple grouped changed files.
- `TASKS.md`, `TEST_PLAN.md`, `.codex/agents/**` from hook/chrome workers to browser/vscode workers.

### Add

- `extensions/vscode` implementation.
- VS Code changed-files adapter.
- VS Code Tree View grouped by Harness / Validation / Code.
- VS Code status/count display.
- Browser category filter UI: All / Harness / Validation / Code.
- Browser Harness panel with native diff jump links.

## 3. File-Level Migration Instructions

`packages/core/src/index.ts`

- Keep path normalization and classifier logic.
- Remove or quarantine trailer parser/formatter and relationship builder from MVP exports.
- Rename `execution` to `code`.
- Add `groupChangedFiles`.

`packages/core/tests/**`

- Keep classifier coverage.
- Remove trailer and relationship tests.
- Add grouping tests.
- Update all expected artifact kinds from `execution` to `code`.

`extensions/browser/**`

- Treat as existing browser-extension prototype.
- Refactor toward category filters and Harness panel.
- Do not add relationship badges, metadata readers, or causality language.

`extensions/vscode/**`

- No longer a placeholder.
- Implement MVP VS Code grouped changed-files view.

`package.json`

- Remove Git hook workspace and scripts.
- Add VS Code extension workspace/scripts.
- Keep core and browser extension scripts.

## 4. Forbidden Continuations

Do not:

- Restore removed Git metadata behavior.
- Add commit-message metadata support.
- Add relationship modeling.
- Infer causality.
- Depend on commit message quality.
- Present any UI as "caused by", "linked to", or "relationship".

## 5. Migration Task Order

1. Update harness docs and agent roles to the new MVP.
2. Simplify core contract, tests, and implementation.
3. Remove deprecated metadata tooling from the active build/test path.
4. Refactor browser extension from relationship rows to category isolation.
5. Implement VS Code extension scaffold and tests.
6. Implement VS Code grouped changed-files view.
7. Run QA to verify no MVP Git hook / causality behavior remains.

## 6. Success Criteria

- `npm test`, `npm run typecheck`, and `npm run build` pass for active MVP workspaces.
- No active MVP test depends on Git trailers or commit hooks.
- Browser extension can classify and filter GitHub changed files.
- VS Code extension can show local changed files grouped by category.
- UI copy uses Harness / Validation / Code language only.
