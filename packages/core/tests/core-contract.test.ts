import { describe, expect, it } from "vitest";

import {
  classifyPath,
  groupChangedFiles,
  normalizePath,
  type ChangedFile,
} from "../src/index";

describe("normalizePath", () => {
  it("converts Windows separators and removes a leading current-directory segment", () => {
    expect(normalizePath(String.raw`.\packages\core\src\index.ts`)).toBe(
      "packages/core/src/index.ts",
    );
    expect(normalizePath("./packages/core/tests/core-contract.test.ts")).toBe(
      "packages/core/tests/core-contract.test.ts",
    );
  });

  it("preserves dot-directories", () => {
    expect(normalizePath(String.raw`.\.codex\agents\core-test.md`)).toBe(
      ".codex/agents/core-test.md",
    );
    expect(normalizePath(String.raw`.cursor\rules\frontend.md`)).toBe(
      ".cursor/rules/frontend.md",
    );
  });

  it("removes GitHub label left-to-right marks", () => {
    expect(normalizePath("\u200emanual-test/browser-smoke/AGENTS.md\u200e")).toBe(
      "manual-test/browser-smoke/AGENTS.md",
    );
  });
});

describe("classifyPath", () => {
  it("detects root and nested harness files recursively", () => {
    expect(classifyPath("PRD.md")).toBe("harness");
    expect(classifyPath("SPEC.md")).toBe("harness");
    expect(classifyPath("RULES.md")).toBe("harness");
    expect(classifyPath("CONTRACT.md")).toBe("harness");
    expect(classifyPath("TEST_PLAN.md")).toBe("harness");
    expect(classifyPath("DESIGN.md")).toBe("harness");
    expect(classifyPath("TASKS.md")).toBe("harness");
    expect(classifyPath("AGENTS.md")).toBe("harness");
    expect(classifyPath("AGENT.md")).toBe("harness");
    expect(classifyPath("features/search/SPEC.md")).toBe("harness");
    expect(classifyPath("packages/app/docs/phase-1/CONTRACT.md")).toBe(
      "harness",
    );
  });

  it("detects harness instruction paths and harness content directories", () => {
    expect(classifyPath(".cursor/rules/frontend.md")).toBe("harness");
    expect(classifyPath("packages/app/.cursor/rules/local-style.md")).toBe(
      "harness",
    );
    expect(classifyPath(".codex/agents/core-test.md")).toBe("harness");
    expect(classifyPath("packages/app/.codex/config.toml")).toBe("harness");
    expect(classifyPath(".github/copilot-instructions.md")).toBe("harness");
    expect(classifyPath("packages/app/.github/copilot-instructions.md")).toBe(
      "harness",
    );
    expect(classifyPath("docs/adr/0001-intent-model.md")).toBe("harness");
    expect(classifyPath("packages/app/docs/adr/0002-ui-contract.md")).toBe(
      "harness",
    );
    expect(classifyPath("docs/spec/browser-extension.md")).toBe("harness");
    expect(classifyPath("packages/app/docs/spec/core-contract.md")).toBe(
      "harness",
    );
    expect(classifyPath("prompts/review.md")).toBe("harness");
    expect(classifyPath("packages/app/prompts/codegen/system.md")).toBe(
      "harness",
    );
    expect(classifyPath("harness/release-checklist.md")).toBe("harness");
    expect(classifyPath("packages/app/harness/phase-2/TASKS.md")).toBe(
      "harness",
    );
  });

  it("detects validation files", () => {
    expect(classifyPath("packages/core/tests/core-contract.test.ts")).toBe(
      "validation",
    );
    expect(classifyPath("packages/core/__tests__/index.spec.ts")).toBe(
      "validation",
    );
    expect(classifyPath("packages/core/fixtures/sample.diff")).toBe(
      "validation",
    );
    expect(classifyPath("packages/core/test-fixtures/sample.diff")).toBe(
      "validation",
    );
    expect(classifyPath("packages/core/__snapshots__/view.snap")).toBe(
      "validation",
    );
    expect(classifyPath("packages/ui/view.snap")).toBe("validation");
    expect(classifyPath(".github/workflows/ci.yml")).toBe("validation");
    expect(classifyPath("extensions/browser/src/filter.test.ts")).toBe(
      "validation",
    );
  });

  it("defaults unknown files to code", () => {
    expect(classifyPath("packages/core/src/index.ts")).toBe("code");
    expect(classifyPath("extensions/browser/src/content.ts")).toBe("code");
    expect(classifyPath("README.md")).toBe("code");
  });

  it("detects nested harness files wrapped in GitHub label left-to-right marks", () => {
    expect(classifyPath("\u200emanual-test/browser-smoke/AGENTS.md\u200e")).toBe(
      "harness",
    );
  });
});

describe("groupChangedFiles", () => {
  it("normalizes and classifies string inputs into contract groups", () => {
    expect(
      groupChangedFiles([
        String.raw`.\CONTRACT.md`,
        String.raw`packages\core\tests\core-contract.test.ts`,
        "./packages/core/src/index.ts",
      ]),
    ).toEqual({
      harness: [{ path: "CONTRACT.md", kind: "harness" }],
      validation: [
        {
          path: "packages/core/tests/core-contract.test.ts",
          kind: "validation",
        },
      ],
      code: [{ path: "packages/core/src/index.ts", kind: "code" }],
    });
  });

  it("normalizes ChangedFile inputs and preserves explicit status", () => {
    const files: ChangedFile[] = [
      {
        path: String.raw`.\packages\core\src\index.ts`,
        kind: "code",
        status: "modified",
      },
      {
        path: String.raw`.\docs\adr\0001-intent-model.md`,
        kind: "harness",
        status: "added",
      },
      {
        path: String.raw`.\packages\core\fixtures\sample.diff`,
        kind: "validation",
        status: "deleted",
      },
    ];

    expect(groupChangedFiles(files)).toEqual({
      harness: [
        {
          path: "docs/adr/0001-intent-model.md",
          kind: "harness",
          status: "added",
        },
      ],
      validation: [
        {
          path: "packages/core/fixtures/sample.diff",
          kind: "validation",
          status: "deleted",
        },
      ],
      code: [
        {
          path: "packages/core/src/index.ts",
          kind: "code",
          status: "modified",
        },
      ],
    });
  });

  it("preserves input order inside each group for mixed inputs", () => {
    expect(
      groupChangedFiles([
        "packages/core/src/index.ts",
        { path: "TASKS.md", kind: "harness", status: "modified" },
        "extensions/browser/src/content.ts",
        { path: "docs/spec/core.md", kind: "harness", status: "renamed" },
        "packages/core/tests/core-contract.test.ts",
        {
          path: "extensions/browser/src/filter.spec.ts",
          kind: "validation",
          status: "unknown",
        },
      ]),
    ).toEqual({
      harness: [
        { path: "TASKS.md", kind: "harness", status: "modified" },
        { path: "docs/spec/core.md", kind: "harness", status: "renamed" },
      ],
      validation: [
        {
          path: "packages/core/tests/core-contract.test.ts",
          kind: "validation",
        },
        {
          path: "extensions/browser/src/filter.spec.ts",
          kind: "validation",
          status: "unknown",
        },
      ],
      code: [
        { path: "packages/core/src/index.ts", kind: "code" },
        { path: "extensions/browser/src/content.ts", kind: "code" },
      ],
    });
  });
});
