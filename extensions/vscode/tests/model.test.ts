import { describe, expect, it } from "vitest";

import { buildGroupedChangesModel } from "../src/model";

describe("buildGroupedChangesModel", () => {
  it("groups tree items under Harness, Validation, and Code with statuses", () => {
    const model = buildGroupedChangesModel([
      { path: ".codex/agents/reviewer.md", status: "modified" },
      { path: "src/index.test.ts", status: "added" },
      { path: "src/index.ts", status: "renamed" },
      { path: "docs/adr/001.md", status: "deleted" },
    ]);

    expect(model.groups).toEqual([
      {
        kind: "harness",
        label: "Harness",
        count: 2,
        items: [
          {
            kind: "harness",
            label: ".codex/agents/reviewer.md",
            path: ".codex/agents/reviewer.md",
            status: "modified",
          },
          {
            kind: "harness",
            label: "docs/adr/001.md",
            path: "docs/adr/001.md",
            status: "deleted",
          },
        ],
      },
      {
        kind: "validation",
        label: "Validation",
        count: 1,
        items: [
          {
            kind: "validation",
            label: "src/index.test.ts",
            path: "src/index.test.ts",
            status: "added",
          },
        ],
      },
      {
        kind: "code",
        label: "Code",
        count: 1,
        items: [
          {
            kind: "code",
            label: "src/index.ts",
            path: "src/index.ts",
            status: "renamed",
          },
        ],
      },
    ]);
  });

  it("builds a total, category counts, and status counts summary", () => {
    const model = buildGroupedChangesModel([
      { path: "AGENTS.md", status: "modified" },
      { path: "tests/model.test.ts", status: "added" },
      { path: "src/model.ts", status: "modified" },
      { path: "src/old.ts", status: "deleted" },
      { path: "src/no-status.ts" },
    ]);

    expect(model.summary).toEqual({
      total: 5,
      label: "5 changed files: 1 Harness, 1 Validation, 3 Code",
      byKind: { harness: 1, validation: 1, code: 3 },
      byStatus: { added: 1, modified: 2, deleted: 1, unknown: 1 },
    });
  });

  it("uses relative paths for labels and classification while preserving absolute paths", () => {
    const model = buildGroupedChangesModel([
      {
        path: "D:\\repo\\docs\\AGENTS.md",
        relativePath: "docs/AGENTS.md",
        status: "added",
      },
      {
        path: "D:\\repo\\src\\component.test.ts",
        relativePath: "src/component.test.ts",
        status: "modified",
      },
    ]);

    expect(model.groups[0]?.items).toEqual([
      {
        kind: "harness",
        label: "docs/AGENTS.md",
        path: "D:\\repo\\docs\\AGENTS.md",
        status: "added",
      },
    ]);
    expect(model.groups[1]?.items).toEqual([
      {
        kind: "validation",
        label: "src/component.test.ts",
        path: "D:\\repo\\src\\component.test.ts",
        status: "modified",
      },
    ]);
  });

  it("returns empty category groups and a readable zero-count summary", () => {
    const model = buildGroupedChangesModel([]);

    expect(model.groups.map(({ label, count }) => ({ label, count }))).toEqual([
      { label: "Harness", count: 0 },
      { label: "Validation", count: 0 },
      { label: "Code", count: 0 },
    ]);
    expect(model.summary).toEqual({
      total: 0,
      label: "No changed files",
      byKind: { harness: 0, validation: 0, code: 0 },
      byStatus: {},
    });
  });
});
