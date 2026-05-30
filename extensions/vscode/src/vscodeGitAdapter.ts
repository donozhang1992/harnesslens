import type { ChangedFile } from "@harnesslens/core";

import type {
  GitChangedFilesProvider,
  VscodeChangedFile,
} from "./gitChangedFilesProvider.js";

type ChangedFileStatus = NonNullable<ChangedFile["status"]>;

export interface VscodeGitResource {
  uri: {
    fsPath?: string;
    path?: string;
  };
  status?: ChangedFileStatus | number;
}

export interface VscodeGitRepository {
  state: {
    workingTreeChanges?: readonly VscodeGitResource[];
    indexChanges?: readonly VscodeGitResource[];
  };
}

export interface VscodeGitApi {
  repositories: readonly VscodeGitRepository[];
}

export function createVscodeGitChangedFilesProvider(
  gitApi: VscodeGitApi | undefined,
): GitChangedFilesProvider {
  return {
    async getChangedFiles() {
      if (gitApi === undefined) {
        throw new Error("VS Code Git API is unavailable.");
      }

      const files = new Map<string, VscodeChangedFile>();

      for (const repository of gitApi.repositories) {
        addResources(files, repository.state.workingTreeChanges);
        addResources(files, repository.state.indexChanges);
      }

      return [...files.values()];
    },
  };
}

function addResources(
  files: Map<string, VscodeChangedFile>,
  resources: readonly VscodeGitResource[] | undefined,
): void {
  for (const resource of resources ?? []) {
    const path = resource.uri.fsPath ?? resource.uri.path;

    if (path === undefined || path.length === 0) {
      continue;
    }

    const existing = files.get(path);

    if (existing === undefined) {
      files.set(path, toChangedFile(path, mapStatus(resource.status)));
      continue;
    }

    const status = mapStatus(resource.status);
    if (existing.status !== status) {
      files.set(path, { path, status: "unknown" });
    }
  }
}

function mapStatus(status: ChangedFileStatus | number | undefined): ChangedFileStatus | undefined {
  if (typeof status !== "number") {
    return status;
  }

  switch (status) {
    case 1:
    case 7:
    case 9:
      return "added";
    case 2:
    case 6:
      return "deleted";
    case 3:
    case 10:
      return "renamed";
    case 0:
    case 5:
    case 11:
      return "modified";
    default:
      return "unknown";
  }
}

function toChangedFile(
  path: string,
  status: ChangedFileStatus | undefined,
): VscodeChangedFile {
  return status === undefined ? { path } : { path, status };
}
