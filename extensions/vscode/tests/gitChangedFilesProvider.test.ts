import { describe, expect, it, vi } from "vitest";

import { loadChangedFiles } from "../src/gitChangedFilesProvider";

describe("loadChangedFiles", () => {
  it("returns files from a mocked Git changed-files provider", async () => {
    const provider = {
      getChangedFiles: vi.fn().mockResolvedValue([
        { path: "AGENTS.md", status: "modified" },
        { path: "src/index.ts", status: "added" },
      ]),
    };

    await expect(loadChangedFiles(provider)).resolves.toEqual({
      availability: "available",
      files: [
        { path: "AGENTS.md", status: "modified" },
        { path: "src/index.ts", status: "added" },
      ],
    });
    expect(provider.getChangedFiles).toHaveBeenCalledOnce();
  });

  it("returns a readable safe state when the Git provider is unavailable", async () => {
    const provider = {
      getChangedFiles: vi.fn().mockRejectedValue(new Error("Git extension unavailable")),
    };

    await expect(loadChangedFiles(provider)).resolves.toEqual({
      availability: "unavailable",
      files: [],
      message: "Git changed files are unavailable.",
    });
  });
});
