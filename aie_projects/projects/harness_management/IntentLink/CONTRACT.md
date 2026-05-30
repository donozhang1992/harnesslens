# HarnessLens Contracts

## 0. Contract Status

- Version: `0.2`
- Status: `frozen-for-migration-phase`
- Owner: main agent

This contract supersedes the previous Git hook / trailer / relationship contract. Workers must treat trailer parsing, relationship mapping, and Git hook behavior as deprecated MVP concepts.

Contract change protocol:

1. A worker that finds a contract problem must stop the affected task and report a contract change request.
2. The main agent reviews the request and updates CONTRACT.md if needed.
3. TASKS.md status must be updated for affected tasks.
4. Work resumes only after the contract version/status is confirmed.

## 1. Core Types

```ts
export type ArtifactKind = "harness" | "validation" | "code";

export interface ChangedFile {
  path: string;
  kind: ArtifactKind;
  status?: "added" | "modified" | "deleted" | "renamed" | "unknown";
}

export interface GroupedChangedFiles {
  harness: ChangedFile[];
  validation: ChangedFile[];
  code: ChangedFile[];
}
```

## 2. Core API Contract

`normalizePath(path: string): string`

- Converts Windows separators to `/`.
- Removes leading `./`.
- Preserves dot-directories such as `.codex` and `.cursor`.
- Does not access filesystem.

`classifyPath(path: string): ArtifactKind`

- Detects harness files recursively.
- Detects validation files.
- Defaults unknown paths to `code`.
- Does not access filesystem or DOM.

`groupChangedFiles(files: Array<string | ChangedFile>): GroupedChangedFiles`

- Normalizes and classifies string inputs.
- Preserves explicit `status` when provided.
- Groups into `harness`, `validation`, and `code`.
- Preserves input order inside each group.

## 3. Browser Adapter Contract

The browser extension must isolate GitHub-specific DOM reads in adapter modules.

Adapter output:

```ts
export interface BrowserChangedFileBlock {
  path: string;
  element: HTMLElement;
  status?: ChangedFile["status"];
}
```

Rules:

- Prefer semantic attributes over generated class names.
- UI components consume adapter output, not raw GitHub selectors.
- Adapter failures produce an empty state, not a page crash.

## 4. VS Code Adapter Contract

The VS Code extension must isolate VS Code and Git APIs behind adapter modules.

Adapter output:

```ts
export interface VscodeChangedFile {
  path: string;
  status?: ChangedFile["status"];
}
```

Rules:

- VS Code APIs must not leak into `packages/core`.
- Git provider failures produce an empty or unavailable state.
- Commands should open native VS Code file/diff views.

## 5. Privacy Contract

- No telemetry.
- No backend.
- No remote logging.
- No external AI calls.
- Classification and grouping run locally.
