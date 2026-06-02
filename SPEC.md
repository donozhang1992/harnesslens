# HarnessLens MVP Technical Specification

## 1. Current Direction

The MVP is a two-surface classification product:

- Browser extension for GitHub PR review.
- VS Code extension for local working tree review.
- Shared core package for classification and grouping.

Read `MIGRATION_PLAN.md` before changing code. Removed metadata and relationship behavior must not be restored.

## 2. Architecture

```text
packages/core
  Pure classification and grouping logic.

extensions/browser
  Browser extension for GitHub PR Files Changed pages.

extensions/vscode
  VS Code extension for local Git changed files.
```

The browser workspace has been migrated to `extensions/browser`.

## 3. Core Package

`packages/core` must be pure and reusable by both extensions.

Required responsibilities:

- `normalizePath(path)`
- `classifyPath(path)`
- `groupChangedFiles(files)`
- shared `ArtifactKind` and `ChangedFile` types

Core must not depend on:

- React
- DOM APIs
- Chrome extension APIs
- VS Code APIs
- Node Git command execution

## 4. Browser Extension

The browser extension targets GitHub PR Files Changed pages.

Required modules:

- GitHub DOM adapter: reads changed file blocks and native diff elements.
- Category model adapter: converts DOM file blocks to core `ChangedFile` records.
- Category filter UI: All / Harness / Validation / Code.
- Harness panel: lists changed harness files and jumps to native diffs.
- Scoped styling: does not leak into GitHub.

Behavior:

- Extension works without commit-message metadata.
- The native GitHub diff remains the source of truth.
- Filtering may hide/show native file blocks or apply HarnessLens-owned visibility classes.
- The UI must not say "caused by", "linked to", or imply causality.

## 5. VS Code Extension

The VS Code extension targets local development.

Required modules:

- Git changed-files provider using VS Code or Git extension APIs.
- Tree View grouped by Harness / Validation / Code.
- Status/count display.
- Open file/diff command.

Behavior:

- Works for working tree and staged changes when available.
- Uses `packages/core` for all classification.
- Does not depend on browser extension code.
- Does not implement commit-message metadata.

## 6. Deprecated Prototype Concepts

These are not MVP:

- Commit-message metadata injection or parsing.
- Commit-message parsing.
- Relationship modeling.
- Causality highlighting.

Do not fix, extend, or polish these unless a migration task explicitly asks you to delete or quarantine them.

## 7. Browser Compatibility

Browser extension MVP supports modern desktop Chromium browsers.

Firefox, Safari, and mobile browser support are out of scope.

## 8. VS Code Compatibility

VS Code extension MVP supports current stable VS Code desktop.

Remote development, web VS Code, and marketplace packaging are not required for the first implementation slice.
