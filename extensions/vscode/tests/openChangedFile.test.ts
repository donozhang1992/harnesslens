import { describe, expect, it, vi } from "vitest";

import { createOpenChangedFileCommands } from "../src/openChangedFile";

describe("createOpenChangedFileCommands", () => {
  it("opens a changed file through the native file-view seam", async () => {
    const nativeViews = {
      openFile: vi.fn().mockResolvedValue(undefined),
      openDiff: vi.fn().mockResolvedValue(undefined),
    };
    const commands = createOpenChangedFileCommands(nativeViews);
    const file = { path: "src/index.ts", status: "added" as const };

    await commands.openFile(file);

    expect(nativeViews.openFile).toHaveBeenCalledWith(file);
    expect(nativeViews.openDiff).not.toHaveBeenCalled();
  });

  it("opens a changed file diff through the native diff-view seam", async () => {
    const nativeViews = {
      openFile: vi.fn().mockResolvedValue(undefined),
      openDiff: vi.fn().mockResolvedValue(undefined),
    };
    const commands = createOpenChangedFileCommands(nativeViews);
    const file = { path: "src/index.ts", status: "modified" as const };

    await commands.openDiff(file);

    expect(nativeViews.openDiff).toHaveBeenCalledWith(file);
    expect(nativeViews.openFile).not.toHaveBeenCalled();
  });
});
