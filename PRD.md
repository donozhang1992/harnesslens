# Product Requirement Document (PRD) - Project: HarnessLens (MVP Reset)

## 1. Product Reset

HarnessLens's MVP is being reset.

The previous prototype explored Git hook metadata, Git trailers, and intent-to-code relationship mapping. That direction is no longer the MVP because commit boundaries are unreliable as intent/code boundaries and the product should not claim causality between harness changes and code changes.

The new MVP is a local-first developer review tool that separates changed files into:

- **Harness**: files that define requirements, specs, rules, prompts, agent behavior, tasks, contracts, or quality expectations.
- **Validation**: tests, fixtures, CI workflows, snapshots, and verification assets.
- **Code**: runtime product code, UI, configuration, build setup, and unknown files.

HarnessLens helps developers and reviewers see harness evolution clearly. It does not prove which harness change caused which code change.

## 2. Product Vision

HarnessLens provides the same classification model in two surfaces:

- **Browser Extension**: On GitHub PR Files Changed pages, reviewers can filter and navigate Harness / Validation / Code changes.
- **VS Code Extension**: In local development, developers can inspect working tree or staged changes grouped as Harness / Validation / Code.

The product should feel like a native review aid: quiet, fast, trustworthy, and explicit about what it knows. It should not infer or display causal relationships in the MVP.

## 3. Core User Value

HarnessLens answers:

1. Which harness files changed?
2. Which validation files changed?
3. Which code files changed?
4. Can I quickly filter or jump between those categories?
5. Can I see harness evolution without being buried in code diff noise?

## 4. Artifact Classification Model

HarnessLens classifies changed files by their role in the development feedback loop, not only by file extension.

### 4.1 Harness

Harness artifacts define intent, behavior, process, or quality expectations.

Examples:

- `PRD.md`
- `SPEC.md`
- `RULES.md`
- `AGENTS.md`
- `CONTRACT.md`
- `TEST_PLAN.md`
- `TASKS.md`
- `DESIGN.md`
- `CLAUDE.md`
- `GEMINI.md`
- `.cursorrules`
- `.cursor/rules/**`
- `.codex/**`
- `.github/copilot-instructions.md`
- `docs/adr/**`
- `docs/spec/**`
- `prompts/**`
- `harness/**`

Harness files may exist at any depth in the repository. A nested `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, or rule folder is still harness and may govern a subtree.

### 4.2 Validation

Validation artifacts verify behavior but are not runtime product code.

Examples:

- `tests/**`
- `test-fixtures/**`
- `fixtures/**`
- `*.test.ts`
- `*.spec.ts`
- `.github/workflows/**`

### 4.3 Code

Code artifacts implement runtime behavior, UI, build configuration, packages, and extension behavior.

Unknown files default to Code unless a future user configuration says otherwise.

## 5. MVP Scope

### Browser Extension

Target: `github.com/*/*/pull/*/files`.

MVP behavior:

- Read changed files from the GitHub PR Files Changed page.
- Classify each file as Harness, Validation, or Code.
- Show category counts.
- Provide filters: All / Harness / Validation / Code.
- Provide a Harness panel listing changed harness files.
- Clicking a listed file scrolls to the native GitHub diff.
- Preserve GitHub's native diff, comments, folding, and review controls.

### VS Code Extension

MVP behavior:

- Read local Git working tree and staged changed files.
- Classify changed files as Harness, Validation, or Code.
- Show an HarnessLens tree view with grouped changes.
- Show a status/count summary.
- Clicking a file opens the file or diff using VS Code APIs.

### Shared Core

The Browser and VS Code extensions must share the same core package for:

- Path normalization.
- Artifact classification.
- Grouping changed files by category.
- Shared types.

## 6. Explicit Non-Goals

- No Git hook in MVP.
- No Git trailer parsing in MVP.
- No commit message dependency in MVP.
- No Linked / Scoped / Grouped relationship model in MVP.
- No causality claims.
- No backend.
- No telemetry.
- No authenticated scraping.
- No support for Git providers other than GitHub in the browser extension MVP.
- No mobile browser workflow.

## 7. Compatibility

Browser extension MVP targets modern desktop Chromium browsers:

- Latest stable Chrome.
- Latest stable Edge.
- Other Chromium browsers on a best-effort basis.

VS Code extension MVP targets current stable VS Code desktop.

Implementation constraints:

- Do not override major GitHub layout containers with `display: flex` or `display: grid`.
- Use layout only inside HarnessLens-owned containers.
- Use scoped styles or Shadow DOM where practical.
- Support GitHub light and dark themes.
- Use a DOM adapter for GitHub page reads.
- Do not duplicate or fully re-render large GitHub diffs in MVP.
