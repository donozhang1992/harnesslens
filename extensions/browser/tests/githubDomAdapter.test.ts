import { describe, expect, it } from "vitest";
import {
  changedGithubDomFixture,
  githubFilesPageFixture,
  progressiveDiffsListFixture
} from "./fixtures/githubFilesPage";
import {
  findGithubChangedFilesContainer,
  readGithubChangedFileBlocks
} from "../src/content/githubDomAdapter";

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

  it("returns only the native outer block when matching attributes are nested", () => {
    document.body.innerHTML = `
      <div data-testid="file" data-file-name="AGENTS.md">
        <span data-path="AGENTS.md">AGENTS.md</span>
      </div>
    `;

    expect(readGithubChangedFileBlocks(document)).toHaveLength(1);
  });

  it("prefers modern native diff blocks over matching file-tree links", () => {
    document.body.innerHTML = `
      <aside>
        <a data-file-path="AGENTS.md">AGENTS.md</a>
      </aside>
      <section>
        <article data-testid="file-diff" data-file-path="AGENTS.md"></article>
      </section>
    `;

    const blocks = readGithubChangedFileBlocks(document);
    expect(blocks).toHaveLength(1);
    expect(blocks[0]!.element.tagName).toBe("ARTICLE");
  });

  it("reads progressive diff entries from their region-labelled file headings", () => {
    document.body.innerHTML = progressiveDiffsListFixture;

    const blocks = readGithubChangedFileBlocks(document);

    expect(blocks.map((block) => block.path)).toEqual([
      "docs/AGENTS.md",
      "extensions/browser/src/content/index.tsx"
    ]);
    expect(blocks.map((block) => block.element.parentElement)).toEqual([
      document.querySelector("[data-testid='progressive-diffs-list']"),
      document.querySelector("[data-testid='progressive-diffs-list']")
    ]);
    expect(findGithubChangedFilesContainer(document, blocks)).toBe(
      document.querySelector("[data-testid='progressive-diffs-list']")
    );
  });
});
