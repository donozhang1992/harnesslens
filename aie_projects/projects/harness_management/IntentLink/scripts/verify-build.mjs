import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const requiredFiles = [
  "extensions/browser/dist/manifest.json",
  "extensions/browser/dist/content.js",
  "extensions/browser/dist/content.css",
  "extensions/vscode/dist/extension.js",
];

for (const file of requiredFiles) {
  if (!existsSync(resolve(file))) {
    throw new Error(`Missing build artifact: ${file}`);
  }
}

const manifest = JSON.parse(
  readFileSync(resolve("extensions/browser/dist/manifest.json"), "utf8"),
);

if (manifest.name !== "HarnessLens") {
  throw new Error("Browser manifest must identify HarnessLens.");
}

const extensionEntry = readFileSync(
  resolve("extensions/vscode/dist/extension.js"),
  "utf8",
);

if (!extensionEntry.includes('from "./extensionController.js"')) {
  throw new Error("VS Code emitted entrypoint must use Node-compatible local imports.");
}

console.log("Build artifacts verified.");
