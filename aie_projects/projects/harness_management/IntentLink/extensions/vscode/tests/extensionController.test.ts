import { describe, expect, it, vi } from "vitest";

import { createExtensionController } from "../src/extensionController";

describe("createExtensionController", () => {
  it("registers refresh, open file, and open diff callbacks through injected host seams", async () => {
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
