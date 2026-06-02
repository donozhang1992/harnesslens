import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface BrowserManifest {
  content_scripts?: Array<{
    matches?: string[];
  }>;
}

describe("browser extension manifest", () => {
  it("injects on the GitHub PR page family before Files changed SPA navigation", () => {
    const manifest = JSON.parse(
      readFileSync(resolve(process.cwd(), "manifest.json"), "utf8"),
    ) as BrowserManifest;

    expect(
      manifest.content_scripts?.some((script) =>
        script.matches?.includes("https://github.com/*/*/pull/*"),
      ),
    ).toBe(true);
  });
});
