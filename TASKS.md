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

`CORE-TEST-03` - GitHub directional-mark path normalization regression

- Owner: core test worker.
- Status: done.
- Depends on: CORE-IMPL-02.
- Own files: `packages/core/tests/**`.
- Acceptance: failing tests reproduce GitHub-labelled paths wrapped in Unicode directional formatting marks and require nested `AGENTS.md` to remain Harness.

`CORE-IMPL-03` - Normalize directional formatting marks in paths

- Owner: core implementation worker.
- Status: done.
- Depends on: CORE-TEST-03.
- Own files: `packages/core/src/**`.
- Acceptance: shared core normalizes invisible directional formatting marks conservatively, nested Harness files classify correctly, and existing Core tests remain green.

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

`BROWSER-TEST-02` - Modern GitHub progressive diff DOM regression

- Owner: browser test worker.
- Status: done.
- Depends on: BROWSER-IMPL-01.
- Own files: `extensions/browser/tests/**`.
- Acceptance: failing tests reproduce GitHub `/pull/*/changes` progressive diff entries whose file paths are exposed through region-labelled headings rather than legacy `data-file-path` attributes.

`BROWSER-IMPL-02` - Modern GitHub progressive diff DOM adapter

- Owner: browser implementation worker.
- Status: done.
- Depends on: BROWSER-TEST-02.
- Own files: `extensions/browser/src/content/**`.
- Acceptance: Browser panel mounts for modern GitHub progressive diff entries without depending on generated CSS module names; existing Browser tests remain green.

`BROWSER-TEST-03` - Stable mount outside GitHub-managed diff lists

- Owner: browser test worker.
- Status: done.
- Depends on: BROWSER-IMPL-02.
- Own files: `extensions/browser/tests/**`.
- Acceptance: failing integration tests reproduce GitHub progressive list redraws and require the HarnessLens panel to remain mounted outside the native list.

`BROWSER-IMPL-03` - Stabilize Browser panel mount placement

- Owner: browser implementation worker.
- Status: done.
- Depends on: BROWSER-TEST-03.
- Own files: `extensions/browser/src/content/**`.
- Acceptance: HarnessLens mounts before GitHub-managed diff containers, remains visible across native list redraws, and existing Browser tests remain green.

`BROWSER-TEST-04` - Remount after GitHub outer-container replacement

- Owner: browser test worker.
- Status: done.
- Depends on: BROWSER-IMPL-03.
- Own files: `extensions/browser/tests/**`.
- Acceptance: failing integration tests reproduce GitHub replacing the progressive diff region after an initial mount and require HarnessLens to remount automatically.

`BROWSER-IMPL-04` - Keep Browser remount supervision active

- Owner: browser implementation worker.
- Status: done.
- Depends on: BROWSER-TEST-04.
- Own files: `extensions/browser/src/content/**`.
- Acceptance: HarnessLens automatically remounts after GitHub outer-container replacement without duplicate panels or unbounded retry loops; existing Browser tests remain green.

`BROWSER-TEST-05` - Category-aware Browser file navigation tests

- Owner: browser test worker.
- Status: done.
- Depends on: BROWSER-IMPL-04.
- Own files: `extensions/browser/tests/**`.
- Acceptance: failing UI tests require All to show grouped changed-file navigation and category tabs to show matching file lists, headings, empty states, and native diff jumps.

`BROWSER-IMPL-05` - Category-aware Browser file navigation

- Owner: browser implementation worker.
- Status: done.
- Depends on: BROWSER-TEST-05.
- Own files: `extensions/browser/src/**`.
- Acceptance: Browser panel navigation follows the active category, All remains grouped, every listed file jumps to its native diff, and existing Browser tests remain green.

`BROWSER-TEST-06` - Inject on GitHub PR tab navigation

- Owner: browser test worker.
- Status: done.
- Depends on: BROWSER-IMPL-05.
- Own files: `extensions/browser/tests/**`.
- Acceptance: failing manifest coverage requires HarnessLens injection on the PR page family so GitHub SPA navigation from Conversation to Files changed can mount the panel.

`BROWSER-IMPL-06` - Expand PR-page content-script injection

- Owner: browser implementation worker.
- Status: done.
- Depends on: BROWSER-TEST-06.
- Own files: `extensions/browser/manifest.json`, `scripts/verify-build.mjs`.
- Acceptance: content script injects on GitHub PR pages before SPA tab navigation, build verification enforces the route, and existing Browser behavior remains green.

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

`VSCODE-TEST-03` - VS Code Git resourceUri regression

- Owner: VS Code test worker.
- Status: done.
- Depends on: VSCODE-IMPL-02.
- Own files: `extensions/vscode/tests/**`.
- Acceptance: failing tests reproduce real VS Code Git resources that expose changed file paths through `resourceUri` instead of the test-only `uri` field.

`VSCODE-IMPL-03` - Read real VS Code Git resourceUri paths

- Owner: VS Code implementation worker.
- Status: done.
- Depends on: VSCODE-TEST-03.
- Own files: `extensions/vscode/src/**`.
- Acceptance: VS Code adapter reads real `resourceUri` changed files, keeps legacy seam compatibility, and VS Code tests remain green.

`VSCODE-TEST-04` - Automatic refresh on Git state changes

- Owner: VS Code test worker.
- Status: done.
- Depends on: VSCODE-IMPL-03.
- Own files: `extensions/vscode/tests/**`.
- Acceptance: failing tests require HarnessLens to refresh when the injected Git provider reports changed state, without scanning ignored filesystem paths.

`VSCODE-IMPL-04` - Subscribe to Git changed-files updates

- Owner: VS Code implementation worker.
- Status: done.
- Depends on: VSCODE-TEST-04.
- Own files: `extensions/vscode/src/**`.
- Acceptance: VS Code extension refreshes automatically from Git provider state events, debounces duplicate notifications, and preserves manual refresh.

`VSCODE-TEST-05` - Initial Git API readiness retry tests

- Owner: VS Code test worker.
- Status: done.
- Depends on: VSCODE-IMPL-04.
- Own files: `extensions/vscode/tests/**`.
- Acceptance: failing tests require HarnessLens to retry a bounded number of times after an initial unavailable Git state and stop retrying once changed files load.

`VSCODE-IMPL-05` - Initial Git API readiness retry

- Owner: VS Code implementation worker.
- Status: done.
- Depends on: VSCODE-TEST-05.
- Own files: `extensions/vscode/src/**`.
- Acceptance: VS Code extension recovers from startup ordering where Source Control becomes ready after HarnessLens activation, without unbounded retry loops.

`CORE-TEST-04` - Expanded default Harness filename tests

- Owner: core test worker.
- Status: done.
- Depends on: CORE-IMPL-03.
- Own files: `packages/core/tests/**`, Browser/VS Code tests that consume shared classification.
- Acceptance: failing tests require singular `AGENT.md` to classify as Harness while generic Markdown such as README remains Code.

`CORE-IMPL-04` - Expand default Harness filename set

- Owner: core implementation worker.
- Status: done.
- Depends on: CORE-TEST-04.
- Own files: `packages/core/src/**`.
- Acceptance: shared core classifies common AI/harness instruction filenames consistently for Browser and VS Code without treating all Markdown as Harness.

`VSCODE-TEST-06` - Initial empty Git result retry tests

- Owner: VS Code test worker.
- Status: done.
- Depends on: VSCODE-IMPL-05.
- Own files: `extensions/vscode/tests/**`.
- Acceptance: failing tests require HarnessLens to retry a bounded number of times when startup initially reports zero changed files but later Git state contains changes.

`VSCODE-IMPL-06` - Retry initial empty Git result

- Owner: VS Code implementation worker.
- Status: done.
- Depends on: VSCODE-TEST-06.
- Own files: `extensions/vscode/src/**`.
- Acceptance: VS Code extension recovers when initial Git reads return an empty changed-file list before Source Control finishes loading, without unbounded polling.

`VSCODE-TEST-07` - Git repository-open event tests

- Owner: VS Code test worker.
- Status: done.
- Depends on: VSCODE-IMPL-06.
- Own files: `extensions/vscode/tests/**`.
- Acceptance: failing tests reproduce VS Code Git API starting with zero repositories and later opening a repository, requiring HarnessLens to refresh from the repository-open event.

`VSCODE-IMPL-07` - Subscribe to Git repository-open events

- Owner: VS Code implementation worker.
- Status: done.
- Depends on: VSCODE-TEST-07.
- Own files: `extensions/vscode/src/**`.
- Acceptance: VS Code adapter subscribes to Git API repository lifecycle events, refreshes when repositories open/close, and still subscribes to repository state changes.

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
