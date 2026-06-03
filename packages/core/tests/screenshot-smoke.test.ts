import { describe, expect, it } from "vitest";
import { classifyPath } from "../src/index";

describe("screenshot smoke fixture", () => {
  it("keeps test files in the Validation lane", () => {
    expect(classifyPath("packages/core/tests/screenshot-smoke.test.ts")).toBe(
      "validation",
    );
  });
});
