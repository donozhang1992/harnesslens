# HarnessLens Release Checklist

Use this checklist before publishing a pre-release or public release.

## 1. Version

- [ ] Confirm release license is still correct.
- [ ] Confirm root `package.json` version.
- [ ] Confirm `extensions/browser/manifest.json` version.
- [ ] Confirm `extensions/browser/package.json` version.
- [ ] Confirm `extensions/vscode/package.json` version.
- [ ] Confirm `CHANGELOG.md` has an entry for the version.

Current planned release: `0.1.0`.

Current license: MIT.

## 2. Clean Build

Run:

```powershell
npm install
npm run release:check
```

Expected:

- [ ] Core tests pass.
- [ ] Browser tests pass.
- [ ] VS Code tests pass.
- [ ] TypeScript checks pass.
- [ ] Build artifacts verify successfully.

## 3. Package Artifacts

Browser:

```powershell
npm run package:browser
```

Expected:

- [ ] `dist/harnesslens-browser-0.1.0.zip` exists.
- [ ] Zip contains `manifest.json`, `content.js`, and `content.css`.

VS Code:

```powershell
npm run package:vscode
```

Expected:

- [ ] `dist/harnesslens-vscode-0.1.0.vsix` exists.
- [ ] VSIX installs locally with `code --install-extension`.

## 4. Browser Manual Test

Use `PRE_RELEASE_MANUAL.md`.

Minimum pass:

- [ ] Direct GitHub PR Files changed load works.
- [ ] GitHub PR tab navigation from Conversation to Files changed works.
- [ ] All / Harness / Validation / Code filters work.
- [ ] File navigation jumps to native GitHub diffs.
- [ ] Native GitHub review controls still work.
- [ ] Dark theme is readable.
- [ ] Light theme is readable.

## 5. VS Code Manual Test

Use `PRE_RELEASE_MANUAL.md`.

Minimum pass:

- [ ] Extension Development Host starts.
- [ ] HarnessLens Explorer view appears.
- [ ] Working-tree changes are grouped.
- [ ] Staged changes are grouped.
- [ ] Repository open timing is handled without manual refresh.
- [ ] Adding, modifying, deleting, staging, and unstaging update the tree.
- [ ] File selection opens native Git diff.
- [ ] Right-click Open File and Open Diff work.

## 6. Privacy And Permissions

Browser:

- [ ] Manifest host permissions are limited to GitHub pull request pages as much
      as the MVP supports.
- [ ] No analytics or telemetry code is present.
- [ ] `PRIVACY.md` accurately describes behavior.

VS Code:

- [ ] Extension uses VS Code Git API only for changed-file paths.
- [ ] No network calls are introduced.
- [ ] `PRIVACY.md` accurately describes behavior.

## 7. Release Notes

- [ ] Summarize MVP scope.
- [ ] Mention known limitations.
- [ ] Mention that configurable classification is planned.
- [ ] Mention no Git hooks, trailers, causality, or relationship inference.

## 8. Approval

- [ ] Browser manual test approved.
- [ ] VS Code manual test approved.
- [ ] Release artifacts approved.
- [ ] GitHub Release draft reviewed.
- [ ] Store submission deferred or approved.
