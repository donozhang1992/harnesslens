import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(".");
const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const extensionPackageJson = JSON.parse(
  readFileSync(resolve(root, "extensions/vscode/package.json"), "utf8"),
);
const corePackageJson = JSON.parse(
  readFileSync(resolve(root, "packages/core/package.json"), "utf8"),
);
const outDir = resolve(root, "dist");
const outFile = resolve(outDir, `harnesslens-vscode-${packageJson.version}.vsix`);
const stagingDir = resolve(root, ".tmp/vscode-package");

mkdirSync(outDir, { recursive: true });
rmSync(stagingDir, { recursive: true, force: true });
mkdirSync(stagingDir, { recursive: true });

writeFileSync(
  resolve(stagingDir, "package.json"),
  `${JSON.stringify(toPublishPackage(extensionPackageJson), null, 2)}\n`,
);

copyRequired(resolve(root, "extensions/vscode/dist"), resolve(stagingDir, "dist"));
copyRequired(resolve(root, "extensions/vscode/media"), resolve(stagingDir, "media"));
copyReadme();
copyCoreDependency();

const result = spawnSync(...getVscePackageCommand(outFile), {
  cwd: stagingDir,
  stdio: "inherit",
});

if (result.error !== undefined) {
  throw result.error;
}

if (result.status !== 0) {
  throw new Error(
    "VS Code packaging failed. Install or allow @vscode/vsce, then rerun npm run package:vscode.",
  );
}

function toPublishPackage(source) {
  return {
    name: source.name,
    displayName: source.displayName,
    description: source.description,
    version: source.version,
    publisher: source.publisher,
    license: source.license,
    repository: source.repository,
    categories: source.categories,
    keywords: source.keywords,
    type: source.type,
    main: source.main,
    engines: source.engines,
    activationEvents: source.activationEvents,
    contributes: source.contributes,
    dependencies: source.dependencies,
    files: [
      "dist/**",
      "media/icon.png",
      "node_modules/@harnesslens/core/dist/**",
      "node_modules/@harnesslens/core/package.json",
      "README.md",
      "LICENSE.md",
    ],
  };
}

function copyRequired(from, to) {
  if (!existsSync(from)) {
    throw new Error(`Missing required package input: ${from}`);
  }

  cpSync(from, to, { recursive: true });
}

function copyReadme() {
  const extensionReadme = resolve(root, "extensions/vscode/README.md");
  const fallbackReadme = resolve(root, "README.md");
  const readme = existsSync(extensionReadme) ? extensionReadme : fallbackReadme;
  copyRequired(readme, resolve(stagingDir, "README.md"));
  copyRequired(resolve(root, "LICENSE.md"), resolve(stagingDir, "LICENSE.md"));
}

function copyCoreDependency() {
  const coreDir = resolve(stagingDir, "node_modules/@harnesslens/core");
  mkdirSync(coreDir, { recursive: true });
  writeFileSync(
    resolve(coreDir, "package.json"),
    `${JSON.stringify(toRuntimeCorePackage(corePackageJson), null, 2)}\n`,
  );
  copyRequired(resolve(root, "packages/core/dist"), resolve(coreDir, "dist"));
}

function toRuntimeCorePackage(source) {
  return {
    name: source.name,
    version: source.version,
    type: source.type,
    main: source.main,
    types: source.types,
    exports: source.exports,
  };
}

function getVscePackageCommand(outputPath) {
  const args = ["--yes", "@vscode/vsce", "package", "--out", outputPath];

  if (process.platform !== "win32") {
    return ["npx", args];
  }

  return [process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", "npx", ...args]];
}
