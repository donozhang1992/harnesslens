# HarnessLens Pre-Release Manual

This manual is for local installation, usage, and manual acceptance testing
before a public release.

## 1. Prerequisites

Install:

- Node.js 20 or newer.
- npm 10 or newer.
- Git.
- Chrome or Edge.
- VS Code 1.100 or newer.

Use a Git repository that contains a mix of changed files:

- Harness: `AGENTS.md`, `PRD.md`, `SPEC.md`, or `.codex/**`.
- Validation: `tests/**`, `*.test.ts`, `.github/workflows/**`, or snapshots.
- Code: runtime source files or unknown files.

## 2. Initialize the Workspace

From the HarnessLens repository root:

```powershell
npm install
npm test
npm run typecheck
npm run build
```

Expected result:

- All tests pass.
- TypeScript type checking passes.
- The build finishes with `Build artifacts verified.`
- Browser artifacts exist under `extensions/browser/dist`.
- VS Code artifacts exist under `extensions/vscode/dist`.

Run `npm run build` again after changing source files.

For a full pre-release verification pass, run:

```powershell
npm run release:check
```

## 3. Browser Extension: Local Installation

Build the project first:

```powershell
npm run build
```

Chrome:

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose `extensions/browser/dist`.

Edge:

1. Open `edge://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose `extensions/browser/dist`.

After rebuilding, return to the extensions page and reload HarnessLens.

To create a zip for local distribution:

```powershell
npm run package:browser
```

The artifact is written to `dist/harnesslens-browser-0.1.0.zip`.

## 4. Browser Extension: Usage

1. Open a GitHub pull request.
2. Select the **Files changed** tab, or switch to it from another PR tab.
3. Find the HarnessLens panel above the native GitHub file diffs.
4. Review the counts for **All**, **Harness**, **Validation**, and **Code**.
5. Select a category to show only matching native GitHub diff blocks.
6. Use the file navigation panel to jump to any listed native diff. **All**
   shows grouped navigation; category tabs show matching files only.

HarnessLens does not replace GitHub diffs. GitHub comments, folding, and review
controls remain native.

## 5. Browser Extension: Manual Acceptance Test

Use a real GitHub PR containing at least one Harness file, one Validation file,
and one Code file.

Check:

- [ ] Opening a PR directly on **Files changed** shows the panel.
- [ ] Opening a PR on **Conversation** and switching to **Files changed**
      shows the panel without a page refresh.
- [ ] **All** shows every native file diff.
- [ ] **Harness** shows only Harness diffs.
- [ ] **Validation** shows only Validation diffs.
- [ ] **Code** shows only Code diffs.
- [ ] Counts match the visible changed files.
- [ ] **All** groups file navigation under Harness, Validation, and Code.
- [ ] Category tabs show matching file navigation and empty states.
- [ ] Clicking a listed filename scrolls to and highlights its native diff.
- [ ] Native GitHub comments still open and save normally.
- [ ] Native GitHub file folding still works.
- [ ] GitHub review controls remain usable.
- [ ] Light theme remains readable.
- [ ] Dark theme remains readable.
- [ ] Reloading the PR keeps HarnessLens functional.
- [ ] Navigating between PR tabs and returning to **Files changed** is checked.
- [ ] If GitHub loads additional file blocks asynchronously, counts refresh.

## 6. VS Code Extension: Local Installation

This pre-release workflow uses an Extension Development Host.

1. Open the HarnessLens repository root in VS Code.
2. Run:

```powershell
npm install
npm run build
```

3. Open the **Run and Debug** view.
4. Start the **HarnessLens Extension** launch configuration.
5. In the Extension Development Host window, open a Git repository containing
   mixed local changes.

If the launch configuration is unavailable, create a temporary VS Code
extension launch configuration with:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "HarnessLens Extension",
      "type": "extensionHost",
      "request": "launch",
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}/extensions/vscode"
      ]
    }
  ]
}
```

To create a VSIX for local distribution:

```powershell
npm run package:vscode
```

The artifact is written to `dist/harnesslens-vscode-0.1.0.vsix`.

If `@vscode/vsce` is not already cached, this command may download it through
`npx`.

## 7. VS Code Extension: Usage

1. Open **Explorer**.
2. Expand the **HarnessLens** view.
3. Review the **Harness**, **Validation**, and **Code** groups.
4. Check the HarnessLens status-bar summary.
5. Use **HarnessLens: Refresh Changed Files** from the Command Palette after
   changing or staging files if you want to force an immediate reload.
6. Select a file item to open the native Git diff.
7. Use **HarnessLens: Open File** from the Command Palette when you need the
   source file directly.

## 8. VS Code Extension: Manual Acceptance Test

Use a Git repository with working-tree and staged changes.

Check:

- [ ] The HarnessLens Explorer view appears.
- [ ] Harness files appear under **Harness**.
- [ ] Test, fixture, workflow, and snapshot files appear under **Validation**.
- [ ] Runtime source and unknown files appear under **Code**.
- [ ] Working-tree changes appear.
- [ ] Staged changes appear.
- [ ] A file changed in both working tree and index appears once.
- [ ] Adding, deleting, or staging a file updates the tree automatically.
- [ ] The status-bar count matches the tree.
- [ ] **HarnessLens: Refresh Changed Files** updates the tree and status bar.
- [ ] Selecting a file opens the native Git diff.
- [ ] **HarnessLens: Open File** opens the source file.
- [ ] Opening a non-Git folder produces a readable unavailable state.

## 9. Record the Manual Test Result

Record:

- Date.
- Operating system.
- Chrome or Edge version.
- VS Code version.
- Test repository or PR URL.
- Browser checklist result.
- VS Code checklist result.
- Screenshots for visual issues.
- Reproduction steps for failures.

Do not publish the extensions until both manual checklists pass.
