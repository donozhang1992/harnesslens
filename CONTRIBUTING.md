# Contributing To HarnessLens

Thanks for taking a look at HarnessLens.

HarnessLens is currently focused on one MVP: classify changed files as
Harness, Validation, or Code across GitHub pull requests and VS Code local Git
changes.

## Project Boundaries

Please keep contributions inside the active MVP:

- Browser extension for GitHub pull request changed files.
- VS Code extension for local Git changed files.
- Shared Core classifier.

Do not add or restore:

- Git hooks.
- Commit-message trailers.
- Causality inference.
- Linked, scoped, or grouped relationship modeling.
- UI copy that implies one file caused another file to change.

Read `MIGRATION_PLAN.md`, `CONTRACT.md`, and `TEST_PLAN.md` before changing
classification or extension behavior.

## Local Setup

```powershell
npm install
npm run release:check
```

The release check runs Core, Browser, and VS Code tests, TypeScript checks, and
production builds.

## Development Workflow

- Prefer small, focused changes.
- Add or update tests before changing behavior.
- Keep Browser, VS Code, and Core behavior aligned.
- Keep manual smoke fixtures out of commits unless they are intentional docs or
  tests.
- Do not commit `dist/`, `.tmp/`, `node_modules/`, or local extension packages.

Useful commands:

```powershell
npm test
npm run typecheck
npm run build
npm run package:browser
npm run package:vscode
```

## Manual Testing

Use `PRE_RELEASE_MANUAL.md` for local Browser and VS Code extension checks.

At minimum, verify:

- GitHub PR direct Files changed load.
- GitHub PR tab navigation into Files changed.
- Browser category filtering and native diff navigation.
- VS Code working tree and staged changes.
- VS Code add, modify, delete, stage, and unstage refresh behavior.

## Pull Request Checklist

- Tests added or updated when behavior changes.
- `npm run release:check` passes.
- Browser and VS Code behavior remain consistent.
- No deprecated Git hook, trailer, causality, or relationship behavior is
  restored.
- Privacy notice remains accurate.
