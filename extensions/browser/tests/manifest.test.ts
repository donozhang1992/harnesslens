import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface BrowserManifest {
  icons?: Record<string, string>;
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

  it("declares store-ready extension icons", () => {
    const manifest = JSON.parse(
      readFileSync(resolve(process.cwd(), "manifest.json"), "utf8"),
    ) as BrowserManifest;

    expect(manifest.icons).toEqual({
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png",
    });
  });
});
