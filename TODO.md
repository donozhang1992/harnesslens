# HarnessLens TODO

## Completed Migration Cleanup

### Commit Current Core Slice

- Done: committed the core migration checkpoint.

### Rename Project for the Reset MVP

- Done: renamed the product to HarnessLens.

### Clean Up Deprecated Names and Logic

- Done: removed active deprecated metadata tooling and relationship UI.
- Keep only the classification model: Harness / Validation / Code.

### No-Regression Requirement

- Verified: active workspace `test`, `typecheck`, and `build` commands pass.

## Deferred / Not MVP

- Commit-message metadata.
- Relationship mapping or causality claims.

## Future Enhancements

- User-configurable classification via `.harnesslens.yml`.
- User-configurable classification shared by Core, Browser, and VS Code:
  keep built-in Harness / Validation / Code defaults, then allow repo-level
  include/exclude patterns and category overrides.
- Firefox support.
- Safari support.
- Browser extension packaging for store release.
- VS Code marketplace packaging.

## Browser UI Features

- Done: make file navigation follow the active All / Harness /
  Validation / Code category. Keep All grouped and allow every listed file to
  jump to its native GitHub diff.

## Browser Resilience After Feature Details

Implement after the pending Browser feature requirements are clarified. Use
TDD with separate Browser test and implementation workers.

- Add a semantic fallback chain for GitHub changed-file discovery and native
  diff targeting.
- Add explicit diagnostic states such as `waiting-for-diffs`, `mounted`,
  `remounting`, and `unsupported-layout`.
- Record the active GitHub DOM adapter mode for troubleshooting.
- Preserve anonymized real GitHub DOM fixtures for each supported layout.
- Add safe degraded behavior when GitHub changes its DOM: keep a readable
  status instead of silently disappearing.
- Evaluate an optional GitHub API changed-files source while keeping DOM access
  only for native diff filtering and jump behavior.
