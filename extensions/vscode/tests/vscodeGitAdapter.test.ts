import { describe, expect, it, vi } from "vitest";

import {
  createVscodeGitChangedFilesProvider,
  resolveVscodeGitApi,
  type VscodeGitRepository,
} from "../src/vscodeGitAdapter";
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

  it("maps real VS Code Git resourceUri resources to changed files", async () => {
    const provider = createVscodeGitChangedFilesProvider({
      repositories: [
        {
          rootUri: { fsPath: "C:\\repo" },
          state: {
            workingTreeChanges: [
              {
                resourceUri: { fsPath: "C:\\repo\\src\\extension.ts" },
                status: "modified",
              },
              {
                resourceUri: { path: ".github/copilot-instructions.md" },
                status: "added",
              },
            ],
          },
        },
      ],
    } as Parameters<typeof createVscodeGitChangedFilesProvider>[0]);

    await expect(provider.getChangedFiles()).resolves.toEqual([
      {
        path: "C:\\repo\\src\\extension.ts",
        relativePath: "src/extension.ts",
        status: "modified",
      },
      { path: ".github/copilot-instructions.md", status: "added" },
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

  it("retries Git API resolution when the first read happens before Git is ready", async () => {
    const gitApi = {
      repositories: [
        {
          state: {
            workingTreeChanges: [
              { resourceUri: { fsPath: "src/ready.ts" }, status: 5 },
            ],
          },
        },
      ],
    };
    const resolveGitApi = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(gitApi);
    const provider = createVscodeGitChangedFilesProvider(resolveGitApi);

    await expect(loadChangedFiles(provider)).resolves.toMatchObject({
      availability: "unavailable",
    });
    await expect(provider.getChangedFiles()).resolves.toEqual([
      { path: "src/ready.ts", status: "modified" },
    ]);
    expect(resolveGitApi).toHaveBeenCalledTimes(2);
  });

  it("subscribes to repository changes after lazy Git API recovery", async () => {
    let gitListener: (() => void) | undefined;
    const providerListener = vi.fn();
    const provider = createVscodeGitChangedFilesProvider(
      vi.fn().mockResolvedValue({
        repositories: [
          {
            state: {
              workingTreeChanges: [],
              onDidChange: (listener: () => void) => {
                gitListener = listener;
                return { dispose: vi.fn() };
              },
            },
          },
        ],
      }),
    );

    provider.onDidChangeChangedFiles?.(providerListener);
    await provider.getChangedFiles();
    gitListener?.();

    expect(providerListener).toHaveBeenCalledTimes(1);
  });

  it("notifies when Git opens a repository after an initial empty repository list", async () => {
    let openRepositoryListener: ((repository: VscodeGitRepository) => void) | undefined;
    const openedRepository: VscodeGitRepository = {
      state: {
        workingTreeChanges: [
          { resourceUri: { fsPath: "C:\\repo\\AGENT.md" }, status: 7 },
        ],
      },
      rootUri: { fsPath: "C:\\repo" },
    };
    const gitApi = {
      repositories: [],
      onDidOpenRepository: vi.fn((listener) => {
        openRepositoryListener = listener;
        return { dispose: vi.fn() };
      }),
    };
    const provider = createVscodeGitChangedFilesProvider(gitApi);
    const providerListener = vi.fn();

    provider.onDidChangeChangedFiles?.(providerListener);
    await expect(provider.getChangedFiles()).resolves.toEqual([]);
    openRepositoryListener?.(openedRepository);

    expect(providerListener).toHaveBeenCalledTimes(1);
    await expect(provider.getChangedFiles()).resolves.toEqual([
      {
        path: "C:\\repo\\AGENT.md",
        relativePath: "AGENT.md",
        status: "added",
      },
    ]);
  });

  it("notifies and drops late-opened repositories when Git closes them", async () => {
    let openRepositoryListener: ((repository: VscodeGitRepository) => void) | undefined;
    let closeRepositoryListener: ((repository: VscodeGitRepository) => void) | undefined;
    const openedRepository: VscodeGitRepository = {
      state: {
        workingTreeChanges: [
          { resourceUri: { fsPath: "C:\\repo\\TASKS.md" }, status: 5 },
        ],
      },
      rootUri: { fsPath: "C:\\repo" },
    };
    const gitApi = {
      repositories: [],
      onDidOpenRepository: vi.fn((listener) => {
        openRepositoryListener = listener;
        return { dispose: vi.fn() };
      }),
      onDidCloseRepository: vi.fn((listener) => {
        closeRepositoryListener = listener;
        return { dispose: vi.fn() };
      }),
    };
    const provider = createVscodeGitChangedFilesProvider(gitApi);
    const providerListener = vi.fn();

    provider.onDidChangeChangedFiles?.(providerListener);
    await provider.getChangedFiles();
    openRepositoryListener?.(openedRepository);
    closeRepositoryListener?.(openedRepository);

    expect(providerListener).toHaveBeenCalledTimes(2);
    await expect(provider.getChangedFiles()).resolves.toEqual([]);
  });

  it("activates the VS Code Git extension before reading its API", async () => {
    const gitApi = { repositories: [] };
    const gitExtension = {
      activate: vi.fn().mockResolvedValue({
        getAPI: vi.fn().mockReturnValue(gitApi),
      }),
    };

    await expect(resolveVscodeGitApi(gitExtension)).resolves.toBe(gitApi);
    expect(gitExtension.activate).toHaveBeenCalledTimes(1);
  });

  it("uses already-available VS Code Git exports without activating again", async () => {
    const gitApi = { repositories: [] };
    const gitExtension = {
      exports: {
        getAPI: vi.fn().mockReturnValue(gitApi),
      },
      activate: vi.fn(),
    };

    await expect(resolveVscodeGitApi(gitExtension)).resolves.toBe(gitApi);
    expect(gitExtension.activate).not.toHaveBeenCalled();
  });

  it("returns unavailable when the VS Code Git extension cannot activate", async () => {
    const gitExtension = {
      activate: vi.fn().mockRejectedValue(new Error("Git extension failed")),
    };

    await expect(resolveVscodeGitApi(gitExtension)).resolves.toBeUndefined();
  });
});
