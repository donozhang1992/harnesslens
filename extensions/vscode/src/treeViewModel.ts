import type { ArtifactKind, ChangedFile } from "@harnesslens/core";

import type { ChangedFilesLoadResult } from "./gitChangedFilesProvider.js";
import { buildGroupedChangesModel } from "./model.js";

export interface TreeViewFileNode {
  type: "file";
  kind: ArtifactKind;
  label: string;
  path: string;
  status?: ChangedFile["status"];
}

export interface TreeViewGroupNode {
  type: "group";
  kind: ArtifactKind;
  label: string;
  count: number;
  children: TreeViewFileNode[];
}

export interface TreeViewUnavailableNode {
  type: "unavailable";
  label: string;
}

export interface TreeViewModel {
  statusText: string;
  nodes: Array<TreeViewGroupNode | TreeViewUnavailableNode>;
}

export function createTreeViewModel(
  result: ChangedFilesLoadResult,
): TreeViewModel {
  if (result.availability === "unavailable") {
    return {
      statusText: result.message,
      nodes: [{ type: "unavailable", label: result.message }],
    };
  }

  const model = buildGroupedChangesModel(result.files);

  return {
    statusText: model.summary.label,
    nodes: model.groups.map((group) => ({
      type: "group",
      kind: group.kind,
      label: group.label,
      count: group.count,
      children: group.items.map((item) => ({
        type: "file",
        ...item,
      })),
    })),
  };
}
