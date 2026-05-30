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

export function createExtensionController({
  host,
  provider,
}: {
  host: ExtensionControllerHost;
  provider: GitChangedFilesProvider;
}): ExtensionController {
  const openCommands = createOpenChangedFileCommands(host);

  async function refresh(): Promise<void> {
    const view = createTreeViewModel(await loadChangedFiles(provider));
    host.publishTree(view);
    host.publishStatus(view.statusText);
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

      await refresh();
    },
    refresh,
  };
}
