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
  it("renders category counts and groups all changed-file navigation", () => {
    render(
      <BrowserIsolationView
        blocks={blocks}
        activeFilter="all"
        onFilterChange={() => undefined}
        onRevealFile={() => undefined}
      />,
    );

    expect(screen.getByRole("button", { name: "All 3" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Harness 1" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Validation 1" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Code 1" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Changed files" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Harness files" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Validation files" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Code files" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "AGENTS.md" })).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "extensions/browser/tests/browserIsolationView.test.tsx",
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "extensions/browser/src/content/index.tsx",
      }),
    ).toBeTruthy();
  });

  it("shows only Validation file navigation for the Validation filter", () => {
    render(
      <BrowserIsolationView
        blocks={blocks}
        activeFilter="validation"
        onFilterChange={() => undefined}
        onRevealFile={() => undefined}
      />,
    );

    expect(screen.getByRole("heading", { name: "Validation files" })).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "extensions/browser/tests/browserIsolationView.test.tsx",
      }),
    ).toBeTruthy();
    expect(screen.queryByRole("button", { name: "AGENTS.md" })).toBeNull();
    expect(
      screen.queryByRole("button", {
        name: "extensions/browser/src/content/index.tsx",
      }),
    ).toBeNull();
  });

  it("shows only Code file navigation for the Code filter", () => {
    render(
      <BrowserIsolationView
        blocks={blocks}
        activeFilter="code"
        onFilterChange={() => undefined}
        onRevealFile={() => undefined}
      />,
    );

    expect(screen.getByRole("heading", { name: "Code files" })).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "extensions/browser/src/content/index.tsx",
      }),
    ).toBeTruthy();
    expect(screen.queryByRole("button", { name: "AGENTS.md" })).toBeNull();
    expect(
      screen.queryByRole("button", {
        name: "extensions/browser/tests/browserIsolationView.test.tsx",
      }),
    ).toBeNull();
  });

  it("renders a dynamic Harness empty state when no Harness files changed", () => {
    render(
      <BrowserIsolationView
        blocks={blocks.filter((item) => item.path !== "AGENTS.md")}
        activeFilter="harness"
        onFilterChange={() => undefined}
        onRevealFile={() => undefined}
      />,
    );

    expect(screen.getByRole("heading", { name: "Harness files" })).toBeTruthy();
    expect(screen.getByText("No Harness files changed.")).toBeTruthy();
    expect(
      screen.queryByRole("button", {
        name: "extensions/browser/src/content/index.tsx",
      }),
    ).toBeNull();
  });

  it("delegates filters and listed-file native-diff jumps", () => {
    const onFilterChange = vi.fn();
    const onRevealFile = vi.fn();
    render(
      <BrowserIsolationView
        blocks={blocks}
        activeFilter="all"
        onFilterChange={onFilterChange}
        onRevealFile={onRevealFile}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Harness 1" }));
    fireEvent.click(screen.getByRole("button", { name: "AGENTS.md" }));
    fireEvent.click(
      screen.getByRole("button", {
        name: "extensions/browser/src/content/index.tsx",
      }),
    );
    expect(onFilterChange).toHaveBeenCalledWith("harness");
    expect(onRevealFile).toHaveBeenCalledWith("AGENTS.md");
    expect(onRevealFile).toHaveBeenCalledWith(
      "extensions/browser/src/content/index.tsx",
    );
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
