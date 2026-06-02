import type { ChangedFile } from "@harnesslens/core";

import type {
  DisposableLike,
  GitChangedFilesProvider,
  VscodeChangedFile,
} from "./gitChangedFilesProvider.js";

type ChangedFileStatus = NonNullable<ChangedFile["status"]>;
type VscodeEvent<T> = (listener: (event: T) => unknown) => DisposableLike;

export interface VscodeGitResource {
  uri?: {
    fsPath?: string;
    path?: string;
  };
  resourceUri?: {
    fsPath?: string;
    path?: string;
  };
  status?: ChangedFileStatus | number;
}

export interface VscodeGitRepository {
  rootUri?: {
    fsPath?: string;
    path?: string;
  };
  state: {
    workingTreeChanges?: readonly VscodeGitResource[];
    indexChanges?: readonly VscodeGitResource[];
    onDidChange?: VscodeEvent<void>;
  };
}

export interface VscodeGitApi {
  repositories: readonly VscodeGitRepository[];
  onDidOpenRepository?: VscodeEvent<VscodeGitRepository>;
  onDidCloseRepository?: VscodeEvent<VscodeGitRepository>;
}

export interface VscodeGitExports {
  getAPI(version: 1): VscodeGitApi;
}

export interface VscodeGitExtensionHandle {
  exports?: VscodeGitExports;
  activate(): PromiseLike<VscodeGitExports>;
}

export type VscodeGitApiResolver = () => Promise<VscodeGitApi | undefined>;

export async function resolveVscodeGitApi(
  gitExtension: VscodeGitExtensionHandle | undefined,
): Promise<VscodeGitApi | undefined> {
  try {
    if (gitExtension === undefined) {
      return undefined;
    }

    const extensionExports = gitExtension.exports ?? (await gitExtension.activate());
    return extensionExports.getAPI(1);
  } catch {
    return undefined;
  }
}

export function createVscodeGitChangedFilesProvider(
  gitApiOrResolver: VscodeGitApi | VscodeGitApiResolver | undefined,
): GitChangedFilesProvider {
  let gitApi =
    typeof gitApiOrResolver === "function" ? undefined : gitApiOrResolver;
  const resolveGitApi =
    typeof gitApiOrResolver === "function" ? gitApiOrResolver : undefined;
  const listeners = new Set<() => void>();
  const openedRepositories = new Set<VscodeGitRepository>();
  const repositorySubscriptions = new Map<VscodeGitRepository, DisposableLike>();
  let apiSubscriptions: DisposableLike[] = [];
  let subscribedGitApi: VscodeGitApi | undefined;

  function subscribeRepositories(api: VscodeGitApi): void {
    if (subscribedGitApi === api) {
      for (const repository of api.repositories) {
        subscribeRepository(repository);
      }
      return;
    }

    for (const subscription of apiSubscriptions) {
      subscription.dispose();
    }
    for (const subscription of repositorySubscriptions.values()) {
      subscription.dispose();
    }

    subscribedGitApi = api;
    openedRepositories.clear();
    repositorySubscriptions.clear();
    apiSubscriptions = [
      api.onDidOpenRepository?.((repository) => {
        openedRepositories.add(repository);
        subscribeRepository(repository);
        notifyChanged();
      }),
      api.onDidCloseRepository?.((repository) => {
        openedRepositories.delete(repository);
        repositorySubscriptions.get(repository)?.dispose();
        repositorySubscriptions.delete(repository);
        notifyChanged();
      }),
    ].filter((subscription): subscription is DisposableLike => subscription !== undefined);

    for (const repository of api.repositories) {
      subscribeRepository(repository);
    }
  }

  function subscribeRepository(repository: VscodeGitRepository): void {
    if (repositorySubscriptions.has(repository)) {
      return;
    }

    const subscription = repository.state.onDidChange?.(notifyChanged);
    if (subscription !== undefined) {
      repositorySubscriptions.set(repository, subscription);
    }
  }

  function notifyChanged(): void {
    for (const listener of listeners) {
      listener();
    }
  }

  function getKnownRepositories(api: VscodeGitApi): VscodeGitRepository[] {
    return [...new Set([...api.repositories, ...openedRepositories])];
  }

  async function getGitApi(): Promise<VscodeGitApi | undefined> {
    if (gitApi !== undefined) {
      subscribeRepositories(gitApi);
      return gitApi;
    }

    gitApi = await resolveGitApi?.();
    if (gitApi !== undefined) {
      subscribeRepositories(gitApi);
    }
    return gitApi;
  }

  return {
    async getChangedFiles() {
      const gitApi = await getGitApi();

      if (gitApi === undefined) {
        throw new Error("VS Code Git API is unavailable.");
      }

      const files = new Map<string, VscodeChangedFile>();

      for (const repository of getKnownRepositories(gitApi)) {
        const rootPath = getUriPath(repository.rootUri);
        addResources(files, repository.state.workingTreeChanges, rootPath);
        addResources(files, repository.state.indexChanges, rootPath);
      }

      return [...files.values()];
    },
    onDidChangeChangedFiles(listener) {
      listeners.add(listener);
      if (gitApi !== undefined) {
        subscribeRepositories(gitApi);
      }

      return {
        dispose() {
          listeners.delete(listener);
        },
      };
    },
  };
}

function addResources(
  files: Map<string, VscodeChangedFile>,
  resources: readonly VscodeGitResource[] | undefined,
  rootPath: string | undefined,
): void {
  for (const resource of resources ?? []) {
    const path = getResourcePath(resource);

    if (path === undefined || path.length === 0) {
      continue;
    }

    const existing = files.get(path);

    if (existing === undefined) {
      files.set(path, toChangedFile(path, mapStatus(resource.status), rootPath));
      continue;
    }

    const status = mapStatus(resource.status);
    if (existing.status !== status) {
      files.set(path, toChangedFile(path, "unknown", rootPath));
    }
  }
}

function getResourcePath(resource: VscodeGitResource): string | undefined {
  return getUriPath(resource.resourceUri) ?? getUriPath(resource.uri);
}

function getUriPath(uri: VscodeGitResource["resourceUri"]): string | undefined {
  return uri?.fsPath ?? uri?.path;
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
  rootPath: string | undefined,
): VscodeChangedFile {
  const relativePath = toRelativePath(path, rootPath);
  return {
    path,
    ...(relativePath === undefined ? {} : { relativePath }),
    ...(status === undefined ? {} : { status }),
  };
}

function toRelativePath(path: string, rootPath: string | undefined): string | undefined {
  if (rootPath === undefined) {
    return undefined;
  }

  const normalizedPath = normalizePath(path);
  const normalizedRoot = normalizePath(rootPath).replace(/\/$/, "");
  const normalizedPathLower = normalizedPath.toLowerCase();
  const normalizedRootLower = normalizedRoot.toLowerCase();

  if (normalizedPathLower === normalizedRootLower) {
    return undefined;
  }

  if (!normalizedPathLower.startsWith(`${normalizedRootLower}/`)) {
    return undefined;
  }

  return normalizedPath.slice(normalizedRoot.length + 1);
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/");
}
