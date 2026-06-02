import {
  classifyPath,
  groupChangedFiles,
  type ArtifactKind,
  type ChangedFile,
} from "@harnesslens/core";

import type { VscodeChangedFile } from "./gitChangedFilesProvider.js";

export interface ChangedFileTreeItem {
  kind: ArtifactKind;
  label: string;
  path: string;
  status?: ChangedFile["status"];
}

export interface ChangedFileTreeGroup {
  kind: ArtifactKind;
  label: string;
  count: number;
  items: ChangedFileTreeItem[];
}

export interface GroupedChangesSummary {
  total: number;
  label: string;
  byKind: Record<ArtifactKind, number>;
  byStatus: Partial<Record<NonNullable<ChangedFile["status"]>, number>>;
}

export interface GroupedChangesModel {
  groups: ChangedFileTreeGroup[];
  summary: GroupedChangesSummary;
}

const GROUPS: ReadonlyArray<{ kind: ArtifactKind; label: string }> = [
  { kind: "harness", label: "Harness" },
  { kind: "validation", label: "Validation" },
  { kind: "code", label: "Code" },
];

export function buildGroupedChangesModel(
  files: VscodeChangedFile[],
): GroupedChangesModel {
  const grouped = groupChangedFiles(
    files.map((file) => ({
      ...file,
      path: file.relativePath ?? file.path,
      originalPath: file.path,
      kind: classifyPath(file.relativePath ?? file.path),
    })),
  );

  const groups = GROUPS.map(({ kind, label }) => ({
    kind,
    label,
    count: grouped[kind].length,
    items: grouped[kind].map(toTreeItem),
  }));
  const byKind = {
    harness: grouped.harness.length,
    validation: grouped.validation.length,
    code: grouped.code.length,
  };
  const total = files.length;

  return {
    groups,
    summary: {
      total,
      label:
        total === 0
          ? "No changed files"
          : `${total} changed files: ${byKind.harness} Harness, ${byKind.validation} Validation, ${byKind.code} Code`,
      byKind,
      byStatus: countStatuses(groups),
    },
  };
}

function toTreeItem(file: ChangedFile & { originalPath?: string }): ChangedFileTreeItem {
  return {
    kind: file.kind,
    label: file.path,
    path: file.originalPath ?? file.path,
    ...(file.status === undefined ? {} : { status: file.status }),
  };
}

function countStatuses(
  groups: ChangedFileTreeGroup[],
): GroupedChangesSummary["byStatus"] {
  const byStatus: GroupedChangesSummary["byStatus"] = {};

  for (const group of groups) {
    for (const item of group.items) {
      const status = item.status ?? "unknown";
      byStatus[status] = (byStatus[status] ?? 0) + 1;
    }
  }

  return byStatus;
}
