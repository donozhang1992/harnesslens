import { describe, expect, it } from "vitest";

import { createTreeViewModel } from "../src/treeViewModel";

describe("createTreeViewModel", () => {
  it("exposes Harness, Validation, and Code group nodes with file children", () => {
    const view = createTreeViewModel({
      availability: "available",
      files: [
        { path: "AGENTS.md", status: "modified" },
        { path: "src/index.test.ts", status: "added" },
        { path: "src/index.ts", status: "deleted" },
      ],
    });

    expect(view.statusText).toBe(
      "3 changed files: 1 Harness, 1 Validation, 1 Code",
    );
    expect(view.nodes).toEqual([
      {
        type: "group",
        kind: "harness",
        label: "Harness",
        count: 1,
        children: [
          {
            type: "file",
            kind: "harness",
            label: "AGENTS.md",
            path: "AGENTS.md",
            status: "modified",
          },
        ],
      },
      {
        type: "group",
        kind: "validation",
        label: "Validation",
        count: 1,
        children: [
          {
            type: "file",
            kind: "validation",
            label: "src/index.test.ts",
            path: "src/index.test.ts",
            status: "added",
          },
        ],
      },
      {
        type: "group",
        kind: "code",
        label: "Code",
        count: 1,
        children: [
          {
            type: "file",
            kind: "code",
            label: "src/index.ts",
            path: "src/index.ts",
            status: "deleted",
          },
        ],
      },
    ]);
  });

  it("exposes a readable unavailable node and status text", () => {
    const view = createTreeViewModel({
      availability: "unavailable",
      files: [],
      message: "Git changed files are unavailable.",
    });

    expect(view).toEqual({
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
