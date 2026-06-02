import { describe, expect, it } from "vitest";
import { groupChangedFilesByArtifactKind } from "../src/content/artifactGrouping";
import type { GithubChangedFileBlock } from "../src/content/githubDomAdapter";

const block = (path: string): GithubChangedFileBlock => ({
  path,
  element: document.createElement("div"),
});

describe("browser artifact grouping", () => {
  it("separates harness, validation, and code file blocks", () => {
    const grouped = groupChangedFilesByArtifactKind([
      block("AGENTS.md"),
      block("docs/AGENT.md"),
      block("extensions/browser/tests/browserIsolationView.test.tsx"),
      block("extensions/browser/src/content/index.tsx")
    ]);

    expect(grouped.harness.map((file) => file.path)).toEqual([
      "AGENTS.md",
      "docs/AGENT.md"
    ]);
    expect(grouped.validation.map((file) => file.path)).toEqual([
      "extensions/browser/tests/browserIsolationView.test.tsx"
    ]);
    expect(grouped.code.map((file) => file.path)).toEqual([
      "extensions/browser/src/content/index.tsx"
    ]);
  });
});
