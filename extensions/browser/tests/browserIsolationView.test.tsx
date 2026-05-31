import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrowserIsolationView } from "../src/components/BrowserIsolationView";
import { filterChangedFileBlocks } from "../src/content/artifactGrouping";
import type { GithubChangedFileBlock } from "../src/content/githubDomAdapter";

const block = (path: string): GithubChangedFileBlock => ({
  path,
  element: document.createElement("div"),
});

const blocks = [
  block("AGENTS.md"),
  block("extensions/browser/tests/browserIsolationView.test.tsx"),
  block("extensions/browser/src/content/index.tsx"),
];

describe("BrowserIsolationView", () => {
  it("renders category counts and Harness panel files", () => {
    render(
      <BrowserIsolationView
        blocks={blocks}
        activeFilter="all"
        onFilterChange={() => undefined}
        onRevealHarnessFile={() => undefined}
      />,
    );

    expect(screen.getByRole("button", { name: "All 3" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Harness 1" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Validation 1" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Code 1" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "AGENTS.md" })).toBeTruthy();
  });

  it("delegates filters and Harness native-diff jumps", () => {
    const onFilterChange = vi.fn();
    const onRevealHarnessFile = vi.fn();
    render(
      <BrowserIsolationView
        blocks={blocks}
        activeFilter="all"
        onFilterChange={onFilterChange}
        onRevealHarnessFile={onRevealHarnessFile}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Harness 1" }));
    fireEvent.click(screen.getByRole("button", { name: "AGENTS.md" }));
    expect(onFilterChange).toHaveBeenCalledWith("harness");
    expect(onRevealHarnessFile).toHaveBeenCalledWith("AGENTS.md");
  });

  it.each([
    ["all", [false, false, false]],
    ["harness", [false, true, true]],
    ["validation", [true, false, true]],
    ["code", [true, true, false]],
  ] as const)("shows only %s native blocks", (filter, expected) => {
    filterChangedFileBlocks(blocks, filter);
    expect(blocks.map((item) => item.element.hidden)).toEqual(expected);
  });
});
