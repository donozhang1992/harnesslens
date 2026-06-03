# Changelog

## 0.1.0 - Pre-release Manual Preview

Initial HarnessLens MVP.

### Added

- Shared Core classifier for Harness / Validation / Code changed files.
- Browser extension for GitHub pull request Files changed review.
- Browser category tabs for All, Harness, Validation, and Code.
- Browser grouped file navigation with native GitHub diff jumps.
- Browser resilience for modern GitHub progressive diff DOM and PR tab
  navigation.
- VS Code extension Explorer view grouped by Harness, Validation, and Code.
- VS Code changed-file loading through the native VS Code Git extension API.
- VS Code refresh command, status-bar summary, native diff opening, and
  right-click file actions.
- VS Code refresh handling for Git state changes and repository open/close
  lifecycle events.
- Local pre-release manual test guide.
- Privacy notice.
- Local Browser zip packaging script and VS Code VSIX packaging command.

### Not Included

- Git hooks.
- Intent-Source trailers.
- Linked / Scoped / Grouped relationship UI.
- Causality inference.
- Remote telemetry or hosted services.

### Known Limitations

- Browser support is focused on Chromium-based local testing before store
  release.
- VS Code packaging depends on `@vscode/vsce`.
- Classification customization is planned but not implemented yet.
