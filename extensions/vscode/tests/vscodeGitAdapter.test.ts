import { describe, expect, it } from "vitest";

import { createVscodeGitChangedFilesProvider } from "../src/vscodeGitAdapter";
import { loadChangedFiles } from "../src/gitChangedFilesProvider";

describe("createVscodeGitChangedFilesProvider", () => {
  it("maps injected Git resource groups to changed files", async () => {
    const provider = createVscodeGitChangedFilesProvider({
      repositories: [
        {
          state: {
            workingTreeChanges: [
              { uri: { fsPath: "src/index.ts" }, status: "modified" },
              { uri: { path: ".codex/agents/reviewer.md" }, status: "added" },
            ],
            indexChanges: [
              { uri: { fsPath: "tests/index.test.ts" }, status: "deleted" },
            ],
          },
        },
      ],
    });

    await expect(provider.getChangedFiles()).resolves.toEqual([
      { path: "src/index.ts", status: "modified" },
      { path: ".codex/agents/reviewer.md", status: "added" },
      { path: "tests/index.test.ts", status: "deleted" },
    ]);
  });

  it("dedupes staged and working-tree paths conservatively", async () => {
    const provider = createVscodeGitChangedFilesProvider({
      repositories: [
        {
          state: {
            workingTreeChanges: [
              { uri: { fsPath: "src/index.ts" }, status: "modified" },
            ],
            indexChanges: [
              { uri: { fsPath: "src/index.ts" }, status: "added" },
            ],
          },
        },
      ],
    });

    await expect(provider.getChangedFiles()).resolves.toEqual([
      { path: "src/index.ts", status: "unknown" },
    ]);
  });

  it("maps native VS Code Git status enum values to contract statuses", async () => {
    const provider = createVscodeGitChangedFilesProvider({
      repositories: [
        {
          state: {
            workingTreeChanges: [
              { uri: { fsPath: "src/index.ts" }, status: 5 },
              { uri: { fsPath: "src/new.ts" }, status: 7 },
            ],
          },
        },
      ],
    });

    await expect(provider.getChangedFiles()).resolves.toEqual([
      { path: "src/index.ts", status: "modified" },
      { path: "src/new.ts", status: "added" },
    ]);
  });

  it("stays compatible with loadChangedFiles when Git is unavailable", async () => {
    const provider = createVscodeGitChangedFilesProvider(undefined);

    await expect(loadChangedFiles(provider)).resolves.toEqual({
      availability: "unavailable",
      files: [],
      message: "Git changed files are unavailable.",
    });
  });
});
