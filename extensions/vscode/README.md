# HarnessLens

HarnessLens is a small review tool for the vibe coding era.

Vibe coding changes often mix the harness that guides AI-assisted work with the
tests that validate it and the code that ships it. Prompts, specs, agent
instructions, PRDs, ADRs, CI, tests, and runtime source can all change before
you even open a pull request.

HarnessLens adds a local VS Code review view so you can inspect changed files
by review intent before committing or publishing your work.

![HarnessLens VS Code extension demo](https://raw.githubusercontent.com/donozhang1992/harnesslens/main/docs/assets/vscode-extension-demo.gif)

## What It Shows

HarnessLens classifies local Git changes into three review lanes:

- **Harness**: specs, PRDs, prompts, agent instructions, docs, rules, ADRs, and
  other project intent files.
- **Validation**: tests, fixtures, CI workflows, snapshots, and verification
  assets.
- **Code**: runtime source and everything that does not match Harness or
  Validation rules.

## How It Helps

- Start with Harness files to confirm the intent behind a change.
- Review Validation files separately from runtime implementation.
- Isolate Code files when you only need implementation focus.
- See changed-file counts by category.
- Open native VS Code Git diffs without leaving Explorer.
- Review staged and unstaged changes before you create a pull request.

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

Classification uses built-in defaults in the current release. Project-level configurable
classification is planned for a later release.
