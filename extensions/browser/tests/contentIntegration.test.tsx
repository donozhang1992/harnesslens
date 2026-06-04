import { act, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { mountHarnessLens, startHarnessLens } from "../src/content/index";
import { progressiveDiffsListFixture } from "./fixtures/githubFilesPage";

describe("HarnessLens content integration", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("refreshes category counts when GitHub adds a native diff block", async () => {
    document.body.innerHTML = `
      <main>
        <div id="files_bucket">
          <div data-testid="file" data-file-name="AGENTS.md"></div>
        </div>
      </main>
    `;

    await act(async () => {
      mountHarnessLens(document);
    });

    await waitFor(() => {
      expect(document.body.textContent).toContain("Harness 1");
    });

    await act(async () => {
      document.getElementById("files_bucket")!.insertAdjacentHTML(
        "beforeend",
        `<div data-testid="file" data-file-name="src/index.ts"></div>`,
      );
    });

    await waitFor(() => {
      expect(document.body.textContent).toContain("All 2");
      expect(document.body.textContent).toContain("Code 1");
    });
  });

  it("filters native diff blocks and jumps to Harness files", async () => {
    document.body.innerHTML = `
      <main>
        <div id="files_bucket">
          <div data-testid="file" data-file-name="AGENTS.md"></div>
          <div data-testid="file" data-file-name="src/index.ts"></div>
        </div>
      </main>
    `;
    const harnessBlock = document.querySelector<HTMLElement>(
      "[data-file-name='AGENTS.md']",
    )!;
    const codeBlock = document.querySelector<HTMLElement>(
      "[data-file-name='src/index.ts']",
    )!;
    let didScroll = false;
    harnessBlock.scrollIntoView = () => {
      didScroll = true;
    };

    await act(async () => {
      mountHarnessLens(document);
    });

    await waitFor(() => {
      expect(document.body.textContent).toContain("All 2");
    });

    fireEvent.click(document.querySelector<HTMLButtonElement>(
      ".harnesslens-filter:nth-child(2)",
    )!);
    expect(harnessBlock.hidden).toBe(false);
    expect(codeBlock.hidden).toBe(true);

    fireEvent.click(
      Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent === "AGENTS.md",
      )!,
    );
    expect(didScroll).toBe(true);
    expect(harnessBlock.getAttribute("data-harnesslens-highlight")).toBe("true");
  });

  it("mounts above modern GitHub diff blocks without the legacy files bucket", async () => {
    document.body.innerHTML = `
      <main>
        <aside>
          <a data-file-path="AGENTS.md">AGENTS.md</a>
        </aside>
        <section aria-label="Changed files">
          <article data-testid="file-diff" data-file-path="AGENTS.md"></article>
          <article data-testid="file-diff" data-file-path="src/index.ts"></article>
        </section>
      </main>
    `;

    await act(async () => {
      mountHarnessLens(document);
    });

    await waitFor(() => {
      expect(document.body.textContent).toContain("All 2");
      expect(document.body.textContent).toContain("Harness 1");
      expect(document.body.textContent).toContain("Code 1");
    });

    const mountPoint = document.getElementById("harnesslens-root");
    expect(mountPoint?.nextElementSibling?.getAttribute("data-file-path")).toBe(
      "AGENTS.md",
    );
  });

  it("mounts after GitHub asynchronously renders modern diff blocks", async () => {
    document.body.innerHTML = `<main><section aria-label="Changed files"></section></main>`;

    await act(async () => {
      startHarnessLens(document);
    });
    expect(document.getElementById("harnesslens-root")).toBeNull();

    await act(async () => {
      document.querySelector("section")!.insertAdjacentHTML(
        "beforeend",
        `<article data-testid="file-diff" data-file-path="AGENTS.md"></article>`,
      );
    });

    await waitFor(() => {
      expect(document.body.textContent).toContain("All 1");
      expect(document.body.textContent).toContain("Harness 1");
    });
    expect(
      document.documentElement.getAttribute("data-harnesslens-status"),
    ).toBe("mounted");
  });

  it("mounts before the progressive diff list so native redraws cannot remove the panel", async () => {
    document.body.innerHTML = progressiveDiffsListFixture;

    await act(async () => {
      mountHarnessLens(document);
    });

    await waitFor(() => {
      expect(document.body.textContent).toContain("All 2");
      expect(document.body.textContent).toContain("Harness 1");
      expect(document.body.textContent).toContain("Code 1");
    });

    const mountPoint = document.getElementById("harnesslens-root");
    const progressiveList = document.querySelector<HTMLElement>(
      "[data-testid='progressive-diffs-list']",
    )!;

    await act(async () => {
      progressiveList.replaceChildren();
    });

    expect(document.getElementById("harnesslens-root")).toBe(mountPoint);
    expect(mountPoint?.nextElementSibling).toBe(progressiveList);
  });

  it("remounts after GitHub replaces the outer progressive diff region", async () => {
    document.body.innerHTML = progressiveDiffsListFixture;

    await act(async () => {
      startHarnessLens(document);
    });

    await waitFor(() => {
      expect(document.querySelectorAll("#harnesslens-root")).toHaveLength(1);
      expect(document.body.textContent).toContain("All 2");
      expect(document.body.textContent).toContain("Harness 1");
      expect(document.body.textContent).toContain("Code 1");
    });

    await act(async () => {
      document.querySelector("main")!.outerHTML = progressiveDiffsListFixture;
    });

    await waitFor(() => {
      expect(document.querySelectorAll("#harnesslens-root")).toHaveLength(1);
      expect(document.body.textContent).toContain("All 2");
      expect(document.body.textContent).toContain("Harness 1");
      expect(document.body.textContent).toContain("Code 1");
    });
  });
});
