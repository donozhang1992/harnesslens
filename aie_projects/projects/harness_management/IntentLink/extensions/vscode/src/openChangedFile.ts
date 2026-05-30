import type { VscodeChangedFile } from "./gitChangedFilesProvider.js";

export interface NativeChangedFileViews {
  openFile(file: VscodeChangedFile): Promise<void>;
  openDiff(file: VscodeChangedFile): Promise<void>;
}

export interface OpenChangedFileCommands {
  openFile(file: VscodeChangedFile): Promise<void>;
  openDiff(file: VscodeChangedFile): Promise<void>;
}

export function createOpenChangedFileCommands(
  nativeViews: NativeChangedFileViews,
): OpenChangedFileCommands {
  return {
    openFile: (file) => nativeViews.openFile(file),
    openDiff: (file) => nativeViews.openDiff(file),
  };
}
