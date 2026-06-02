import { classifyPath, type ArtifactKind } from "@harnesslens/core";
import type { GithubChangedFileBlock } from "./githubDomAdapter";

export interface GroupedGithubChangedFileBlocks {
  harness: GithubChangedFileBlock[];
  validation: GithubChangedFileBlock[];
  code: GithubChangedFileBlock[];
}

export function groupChangedFilesByArtifactKind(
  blocks: GithubChangedFileBlock[],
): GroupedGithubChangedFileBlocks {
  const grouped: GroupedGithubChangedFileBlocks = {
    harness: [],
    validation: [],
    code: [],
  };

  for (const block of blocks) {
    const kind = classifyPath(block.path);
    grouped[kind].push(block);
  }

  return grouped;
}

export function filterChangedFileBlocks(
  blocks: GithubChangedFileBlock[],
  kind: ArtifactKind | "all",
): void {
  for (const block of blocks) {
    block.element.hidden = kind !== "all" && classifyPath(block.path) !== kind;
  }
}
