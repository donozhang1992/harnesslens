# HarnessLens VS Code Extension

HarnessLens adds a local review view for Git working tree and staged changes.

It classifies changed files into:

- **Harness**: specs, PRDs, prompts, agent instructions, docs, rules, ADRs, and
  other project intent files.
- **Validation**: tests, fixtures, CI workflows, snapshots, and verification
  assets.
- **Code**: runtime source and everything that does not match Harness or
  Validation rules.

## Usage

Open a Git repository in VS Code. The HarnessLens view appears in Explorer and
updates as files are added, modified, deleted, staged, or unstaged.

Select a file to open the native Git diff. Right-click a file to open either
the source file or diff.

Use `HarnessLens: Refresh Changed Files` from the Command Palette if you want
to force a refresh.

## Privacy

HarnessLens reads changed-file paths from the built-in VS Code Git extension
API. It does not send repository contents, paths, or workspace metadata to a
remote service.

## Current Limitations

Classification uses built-in defaults in `0.1.0`. Project-level configurable
classification is planned for a later release.
