import { describe, expect, it } from "vitest";
import {
  changedGithubDomFixture,
  githubFilesPageFixture
} from "./fixtures/githubFilesPage";
import { readGithubChangedFileBlocks } from "../src/content/githubDomAdapter";

describe("GitHub DOM adapter", () => {
  it("reads changed file paths and source elements from fixture HTML", () => {
    document.body.innerHTML = githubFilesPageFixture;

    const blocks = readGithubChangedFileBlocks(document);

    expect(blocks.map((block) => block.path)).toEqual([
      "docs/AGENTS.md",
      "extensions/browser/src/content/index.tsx",
      "extensions/browser/tests/browserIsolationView.test.tsx"
    ]);
    expect(blocks[0]!.element).toBeInstanceOf(HTMLElement);
  });

  it("returns a safe empty state when GitHub markup is missing or changed", () => {
    document.body.innerHTML = changedGithubDomFixture;

    expect(() => readGithubChangedFileBlocks(document)).not.toThrow();
    expect(readGithubChangedFileBlocks(document)).toEqual([]);
  });
});
