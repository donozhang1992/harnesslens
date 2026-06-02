# HarnessLens

HarnessLens is a review aid for projects where important changes are spread
across implementation, tests, specs, prompts, agent instructions, and operating
rules.

It classifies changed files into three review lanes:

- **Harness**: product intent, specs, contracts, design notes, agent
  instructions, prompts, ADRs, and project operating rules.
- **Validation**: tests, fixtures, CI workflows, snapshots, and other
  verification assets.
- **Code**: runtime source and files that do not match Harness or Validation
  rules.

The goal is not to replace GitHub, Git, or VS Code. HarnessLens keeps native
diffs and review tools in place, then adds a small lens that helps reviewers
decide what kind of change they are looking at.

## Product Positioning

HarnessLens is for review workflows where the "harness" around code matters:

- AI-assisted coding projects with `AGENTS.md`, `.codex/**`, prompts, and
  specs.
- Product or design-heavy projects where PRDs, contracts, and rules change
  alongside implementation.
- Teams that want to inspect tests and validation separately from runtime code.

HarnessLens deliberately does not:

- install Git hooks;
- parse commit-message trailers;
- infer causality;
- model linked, scoped, or grouped file relationships;
- send repository contents to a remote service.

## MVP Surfaces

The current MVP includes:

- **Browser extension**: adds Harness / Validation / Code filtering and file
  navigation to GitHub pull request changed files.
- **VS Code extension**: adds a HarnessLens Explorer view for local Git working
  tree and staged changes.
- **Shared Core package**: provides the classification rules used by both
  extensions.

## Requirements

- Node.js 20 or newer.
- npm 10 or newer.
- Git.
- Chrome or Edge for Browser extension testing.
- VS Code 1.100 or newer for VS Code extension testing.

## Install Dependencies

```powershell
npm install
```

## Build And Verify

```powershell
npm test
npm run typecheck
npm run build
```

Expected result:

- Core, Browser, and VS Code tests pass.
- TypeScript checks pass.
- Browser artifacts are written to `extensions/browser/dist`.
- VS Code artifacts are written to `extensions/vscode/dist`.
- Build verification prints `Build artifacts verified.`

## Browser Extension: Local Install

```powershell
npm run build:browser
```

Then in Chrome:

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose `extensions/browser/dist`.

Open a GitHub pull request and go to **Files changed**. HarnessLens appears
above the native GitHub diff list with All / Harness / Validation / Code tabs.

## Browser Extension: Usage

On a GitHub pull request:

1. Open **Files changed**.
2. Use **All** to see every changed file grouped by category.
3. Use **Harness**, **Validation**, or **Code** to isolate one category.
4. Click a listed file path to jump to the native GitHub diff.
5. Continue using native GitHub comments, review controls, and file folding.

HarnessLens may briefly wait for GitHub's progressive diff list to finish
rendering. If GitHub changes its DOM, HarnessLens should degrade to a readable
state rather than hiding GitHub's native UI.

## VS Code Extension: Local Install

For development testing:

1. Open this repository in VS Code.
2. Run `npm run build`.
3. Open **Run and Debug**.
4. Start the **HarnessLens Extension** launch configuration.
5. In the Extension Development Host, open a Git repository with local changes.

HarnessLens appears in Explorer. Selecting a file opens the native Git diff.
Right-click a file for **Open Diff** or **Open File**.

## VS Code Extension: Usage

In a Git repository with local changes:

1. Open Explorer.
2. Expand **HarnessLens**.
3. Review the **Harness**, **Validation**, and **Code** groups.
4. Select a file to open the native Git diff.
5. Right-click a file for **Open Diff** or **Open File**.
6. Use **HarnessLens: Refresh Changed Files** if you want an immediate manual
   refresh.

HarnessLens listens to VS Code Git repository lifecycle and Git state events so
the tree updates when repositories open, close, or change.

## Default Classification Rules

HarnessLens currently uses built-in shared defaults.

Examples classified as **Harness**:

- `AGENT.md`, `AGENTS.md`
- `PRD.md`, `SPEC.md`, `CONTRACT.md`, `DESIGN.md`
- `RULES.md`, `TASKS.md`, `TEST_PLAN.md`
- `.codex/**`
- `.cursor/rules/**`
- `.github/copilot-instructions.md`
- `docs/adr/**`
- `docs/spec/**`
- `prompts/**`
- `harness/**`

Examples classified as **Validation**:

- `.github/workflows/**`
- `tests/**`
- `__tests__/**`
- `fixtures/**`
- `test-fixtures/**`
- `snapshots/**`
- `__snapshots__/**`
- `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`
- `*.snap`

Everything else defaults to **Code**.

## Configuration

User-configurable classification is planned but not implemented in `0.1.0`.

The intended design is a repo-level config file such as `.harnesslens.yml`
that overlays the built-in defaults:

```yaml
harness:
  include:
    - "docs/decision-records/**"
    - "ai/prompts/**"
  exclude:
    - "docs/spec/generated/**"

validation:
  include:
    - "quality/**"

code:
  include:
    - "tools/runtime/**"
```

Planned semantics:

- Built-in defaults run first.
- Project config can add include and exclude patterns.
- Browser and VS Code consume the same shared Core config behavior.
- Config errors should be shown as readable diagnostics, not silent
  misclassification.

Until config support lands, update the shared Core classifier and tests when
changing defaults.

## Package Local Artifacts

Browser zip:

```powershell
npm run package:browser
```

This writes `dist/harnesslens-browser-0.1.0.zip`.

VS Code VSIX:

```powershell
npm run package:vscode
```

This command uses `@vscode/vsce` through `npx` and writes
`dist/harnesslens-vscode-0.1.0.vsix`. It may download `@vscode/vsce` if it is
not already available.

Package both:

```powershell
npm run package
```

Release readiness check:

```powershell
npm run release:check
```

## Manual Test Checklist

Use [PRE_RELEASE_MANUAL.md](PRE_RELEASE_MANUAL.md) before publishing. It covers
Browser and VS Code local installation, category checks, navigation, refresh,
and regression cases.

Use [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) for packaging and release
approval.

## Privacy

See [PRIVACY.md](PRIVACY.md). HarnessLens does not collect telemetry and does
not send repository contents to a remote service.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, test expectations, and
the current MVP boundaries. See [SECURITY.md](SECURITY.md) for vulnerability
reporting.

## License

HarnessLens is released under the [MIT License](LICENSE.md).

## Release Notes

See [CHANGELOG.md](CHANGELOG.md).

## Development Plan

Near-term before public release:

- Produce `0.1.0` Browser zip and VS Code VSIX artifacts.
- Complete manual Browser and VS Code smoke tests.
- Add screenshots or short demo media for the repository and extension pages.
- Decide whether Browser release starts as GitHub Release only or Chrome Web
  Store submission.

Planned after `0.1.0`:

- Shared configurable classification rules.
- Browser diagnostics for unsupported GitHub DOM layouts.
- Optional richer VS Code commands such as copy relative path.
- Packaged marketplace release flow for VS Code.
- Browser store release flow and store listing assets.

Out of scope for this MVP:

- Git hooks.
- Commit trailer protocols.
- Causality inference.
- Relationship graphs.
