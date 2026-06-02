export type ArtifactKind = "harness" | "validation" | "code";

export interface ChangedFile {
  path: string;
  kind: ArtifactKind;
  status?: "added" | "modified" | "deleted" | "renamed" | "unknown";
}

export interface GroupedChangedFiles {
  harness: ChangedFile[];
  validation: ChangedFile[];
  code: ChangedFile[];
}

const HARNESS_FILENAMES = new Set([
  "AGENT.md",
  "AGENTS.md",
  "CLAUDE.md",
  "CONTRACT.md",
  "DESIGN.md",
  "GEMINI.md",
  "PRD.md",
  "RULES.md",
  "SPEC.md",
  "TASKS.md",
  "TEST_PLAN.md",
  ".cursorrules",
]);

const DIRECTIONAL_FORMATTING_MARKS = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g;

export function normalizePath(path: string): string {
  return path
    .replace(DIRECTIONAL_FORMATTING_MARKS, "")
    .replace(/\\/g, "/")
    .replace(/^\.\/+/, "");
}

export function classifyPath(path: string): ArtifactKind {
  const normalized = normalizePath(path);
  const filename = basename(normalized);
  const segments = normalized.split("/");

  if (HARNESS_FILENAMES.has(filename)) {
    return "harness";
  }

  if (
    hasSegmentPair(segments, ".cursor", "rules") ||
    segments.includes(".codex") ||
    endsWithSegments(segments, [".github", "copilot-instructions.md"]) ||
    hasSegmentPair(segments, "docs", "adr") ||
    hasSegmentPair(segments, "docs", "spec") ||
    segments.includes("prompts") ||
    segments.includes("harness")
  ) {
    return "harness";
  }

  if (
    normalized.startsWith(".github/workflows/") ||
    hasSegment(segments, "tests") ||
    hasSegment(segments, "__tests__") ||
    hasSegment(segments, "fixtures") ||
    hasSegment(segments, "test-fixtures") ||
    hasSegment(segments, "snapshots") ||
    hasSegment(segments, "__snapshots__") ||
    /\.(test|spec)\.[cm]?[jt]sx?$/.test(filename) ||
    /\.snap$/.test(filename)
  ) {
    return "validation";
  }

  return "code";
}

export function groupChangedFiles(
  files: Array<string | ChangedFile>,
): GroupedChangedFiles {
  const grouped: GroupedChangedFiles = {
    harness: [],
    validation: [],
    code: [],
  };

  for (const file of files) {
    const changedFile = normalizeChangedFile(file);
    grouped[changedFile.kind].push(changedFile);
  }

  return grouped;
}

function normalizeChangedFile(file: string | ChangedFile): ChangedFile {
  if (typeof file === "string") {
    const path = normalizePath(file);
    return {
      path,
      kind: classifyPath(path),
    };
  }

  return {
    ...file,
    path: normalizePath(file.path),
  };
}

function basename(path: string): string {
  const normalized = normalizePath(path);
  return normalized.slice(normalized.lastIndexOf("/") + 1);
}

function hasSegment(
  segments: readonly string[],
  expected: string,
): boolean {
  return segments.includes(expected);
}

function hasSegmentPair(
  segments: readonly string[],
  first: string,
  second: string,
): boolean {
  return segments.some(
    (segment, index) => segment === first && segments[index + 1] === second,
  );
}

function endsWithSegments(
  segments: readonly string[],
  expected: readonly string[],
): boolean {
  if (segments.length < expected.length) {
    return false;
  }

  const offset = segments.length - expected.length;
  return expected.every((segment, index) => segments[offset + index] === segment);
}
