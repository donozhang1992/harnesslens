import { describe, expect, it, vi } from "vitest";

import { createExtensionController } from "../src/extensionController";
import type { VscodeChangedFile } from "../src/gitChangedFilesProvider";

type ProviderChangeListener = () => void;

function createHost() {
  const callbacks = new Map<string, (...args: unknown[]) => unknown>();
  const host = {
    registerCommand: vi.fn(
      (command: string, callback: (...args: unknown[]) => unknown) => {
        callbacks.set(command, callback);
      },
    ),
    publishTree: vi.fn(),
    publishStatus: vi.fn(),
    openFile: vi.fn().mockResolvedValue(undefined),
    openDiff: vi.fn().mockResolvedValue(undefined),
  };

  return { callbacks, host };
}

function createObservableProvider(initialFiles: VscodeChangedFile[]) {
  const listeners = new Set<ProviderChangeListener>();
  let files = initialFiles;

  return {
    provider: {
      getChangedFiles: vi.fn(async () => files),
      onDidChangeChangedFiles: vi.fn((listener: ProviderChangeListener) => {
        listeners.add(listener);
        return {
          dispose: vi.fn(() => listeners.delete(listener)),
        };
      }),
    },
    setFiles(nextFiles: VscodeChangedFile[]) {
      files = nextFiles;
    },
    fireChanged() {
      for (const listener of listeners) {
        listener();
      }
    },
  };
}

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe("createExtensionController", () => {
  it("retries a bounded number of times after startup Git unavailability", async () => {
    vi.useFakeTimers();

    try {
      const { host } = createHost();
      const provider = {
        getChangedFiles: vi
          .fn()
          .mockRejectedValueOnce(new Error("Git unavailable"))
          .mockResolvedValueOnce([{ path: "AGENT.md", status: "added" }]),
      };

      const controller = createExtensionController({ host, provider });
      await controller.activate();

      expect(host.publishStatus).toHaveBeenLastCalledWith(
        "Git changed files are unavailable.",
      );

      await vi.advanceTimersByTimeAsync(500);

      expect(provider.getChangedFiles).toHaveBeenCalledTimes(2);
      expect(host.publishStatus).toHaveBeenLastCalledWith(
        "1 changed files: 1 Harness, 0 Validation, 0 Code",
      );

      await vi.advanceTimersByTimeAsync(3000);

      expect(provider.getChangedFiles).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it("retries a bounded number of times after an initial empty Git result", async () => {
    vi.useFakeTimers();

    try {
      const { host } = createHost();
      const provider = {
        getChangedFiles: vi
          .fn()
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([{ path: "docs/PRD.md", status: "added" }]),
      };

      const controller = createExtensionController({ host, provider });
      await controller.activate();

      expect(host.publishStatus).toHaveBeenLastCalledWith("No changed files");

      await vi.advanceTimersByTimeAsync(500);

      expect(provider.getChangedFiles).toHaveBeenCalledTimes(2);
      expect(host.publishStatus).toHaveBeenLastCalledWith(
        "1 changed files: 1 Harness, 0 Validation, 0 Code",
      );

      await vi.advanceTimersByTimeAsync(3000);

      expect(provider.getChangedFiles).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it("registers refresh, open file, and open diff callbacks through injected host seams", async () => {
    const { callbacks, host } = createHost();
    const provider = {
      getChangedFiles: vi
        .fn()
        .mockResolvedValue([{ path: "src/index.ts", status: "modified" }]),
    };

    const controller = createExtensionController({ host, provider });
    await controller.activate();

    expect(host.registerCommand).toHaveBeenCalledTimes(3);
    expect([...callbacks.keys()]).toEqual([
      "harnesslens.refresh",
      "harnesslens.openFile",
      "harnesslens.openDiff",
    ]);
    expect(host.publishStatus).toHaveBeenCalledWith(
      "1 changed files: 0 Harness, 0 Validation, 1 Code",
    );

    const file = { path: "src/index.ts", status: "modified" };
    await callbacks.get("harnesslens.openFile")?.(file);
    await callbacks.get("harnesslens.openDiff")?.(file);
    expect(host.openFile).toHaveBeenCalledWith(file);
    expect(host.openDiff).toHaveBeenCalledWith(file);

    await callbacks.get("harnesslens.refresh")?.();
    expect(provider.getChangedFiles).toHaveBeenCalledTimes(2);
    expect(host.publishTree).toHaveBeenCalledTimes(2);
  });

  it("subscribes to provider change notifications and republishes tree and status", async () => {
    const { host } = createHost();
    const observable = createObservableProvider([
      { path: "src/index.ts", status: "modified" },
    ]);

    const controller = createExtensionController({
      host,
      provider: observable.provider,
    });
    await controller.activate();

    expect(observable.provider.onDidChangeChangedFiles).toHaveBeenCalledTimes(1);
    expect(host.publishStatus).toHaveBeenLastCalledWith(
      "1 changed files: 0 Harness, 0 Validation, 1 Code",
    );

    observable.setFiles([
      { path: "AGENTS.md", status: "modified" },
      { path: "src/index.test.ts", status: "added" },
      { path: "src/index.ts", status: "modified" },
    ]);
    observable.fireChanged();
    await flushMicrotasks();

    expect(observable.provider.getChangedFiles).toHaveBeenCalledTimes(2);
    expect(host.publishStatus).toHaveBeenLastCalledWith(
      "3 changed files: 1 Harness, 1 Validation, 1 Code",
    );
    expect(host.publishTree).toHaveBeenCalledTimes(2);
  });

  it("coalesces rapid provider change notifications without losing manual refresh", async () => {
    const { callbacks, host } = createHost();
    const observable = createObservableProvider([
      { path: "src/index.ts", status: "modified" },
    ]);

    const controller = createExtensionController({
      host,
      provider: observable.provider,
    });
    await controller.activate();

    observable.setFiles([{ path: "src/feature.ts", status: "modified" }]);
    observable.fireChanged();
    observable.fireChanged();
    observable.fireChanged();
    await flushMicrotasks();

    expect(observable.provider.getChangedFiles).toHaveBeenCalledTimes(2);
    expect(host.publishStatus).toHaveBeenLastCalledWith(
      "1 changed files: 0 Harness, 0 Validation, 1 Code",
    );

    await callbacks.get("harnesslens.refresh")?.();

    expect(observable.provider.getChangedFiles).toHaveBeenCalledTimes(3);
    expect(host.publishTree).toHaveBeenCalledTimes(3);
  });

  it("publishes the safe unavailable status when Git cannot load", async () => {
    const host = {
      registerCommand: vi.fn(),
      publishTree: vi.fn(),
      publishStatus: vi.fn(),
      openFile: vi.fn(),
      openDiff: vi.fn(),
    };
    const provider = {
      getChangedFiles: vi.fn().mockRejectedValue(new Error("Git unavailable")),
    };

    const controller = createExtensionController({ host, provider });
    await controller.activate();

    expect(host.publishStatus).toHaveBeenCalledWith(
      "Git changed files are unavailable.",
    );
    expect(host.publishTree).toHaveBeenCalledWith({
      statusText: "Git changed files are unavailable.",
      nodes: [
        {
          type: "unavailable",
          label: "Git changed files are unavailable.",
        },
      ],
    });
  });
});
