import type {
  GitChangedFilesProvider,
  VscodeChangedFile,
} from "./gitChangedFilesProvider.js";
import { loadChangedFiles } from "./gitChangedFilesProvider.js";
import { createOpenChangedFileCommands } from "./openChangedFile.js";
import { createTreeViewModel, type TreeViewModel } from "./treeViewModel.js";

export interface ExtensionControllerHost {
  registerCommand(
    command: string,
    callback: (...args: unknown[]) => unknown,
  ): unknown;
  publishTree(model: TreeViewModel): void;
  publishStatus(statusText: string): void;
  openFile(file: VscodeChangedFile): Promise<void>;
  openDiff(file: VscodeChangedFile): Promise<void>;
}

export interface ExtensionController {
  activate(): Promise<void>;
  refresh(): Promise<void>;
}

const STARTUP_RETRY_DELAY_MS = 500;
const STARTUP_RETRY_LIMIT = 6;
const UNAVAILABLE_STATUS_TEXT = "Git changed files are unavailable.";
const EMPTY_STATUS_TEXT = "No changed files";

export function createExtensionController({
  host,
  provider,
}: {
  host: ExtensionControllerHost;
  provider: GitChangedFilesProvider;
}): ExtensionController {
  const openCommands = createOpenChangedFileCommands(host);
  let refreshScheduled = false;
  let startupRetryAttempts = 0;
  let startupRetryHandle: ReturnType<typeof setTimeout> | undefined;

  async function refresh(): Promise<void> {
    const view = createTreeViewModel(await loadChangedFiles(provider));
    host.publishTree(view);
    host.publishStatus(view.statusText);
    updateStartupRetry(view);
  }

  function scheduleRefresh(): void {
    if (refreshScheduled) {
      return;
    }

    refreshScheduled = true;
    void Promise.resolve().then(async () => {
      refreshScheduled = false;
      await refresh();
    });
  }

  function updateStartupRetry(view: TreeViewModel): void {
    if (!isStartupRetryStatus(view.statusText)) {
      startupRetryAttempts = STARTUP_RETRY_LIMIT;
      clearStartupRetry();
      return;
    }

    if (startupRetryAttempts >= STARTUP_RETRY_LIMIT || startupRetryHandle !== undefined) {
      return;
    }

    startupRetryAttempts += 1;
    startupRetryHandle = setTimeout(() => {
      startupRetryHandle = undefined;
      scheduleRefresh();
    }, STARTUP_RETRY_DELAY_MS);
  }

  function clearStartupRetry(): void {
    if (startupRetryHandle === undefined) {
      return;
    }

    clearTimeout(startupRetryHandle);
    startupRetryHandle = undefined;
  }

  function isStartupRetryStatus(statusText: string): boolean {
    return statusText === UNAVAILABLE_STATUS_TEXT || statusText === EMPTY_STATUS_TEXT;
  }

  return {
    async activate() {
      host.registerCommand("harnesslens.refresh", refresh);
      host.registerCommand("harnesslens.openFile", (file) =>
        openCommands.openFile(file as VscodeChangedFile),
      );
      host.registerCommand("harnesslens.openDiff", (file) =>
        openCommands.openDiff(file as VscodeChangedFile),
      );
      provider.onDidChangeChangedFiles?.(scheduleRefresh);

      await refresh();
    },
    refresh,
  };
}
