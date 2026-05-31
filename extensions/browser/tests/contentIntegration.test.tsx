import { act, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { mountHarnessLens } from "../src/content/index";

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
});
