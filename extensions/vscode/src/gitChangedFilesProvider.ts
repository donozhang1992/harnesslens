import type { ChangedFile } from "@harnesslens/core";

export interface VscodeChangedFile {
  path: string;
  status?: ChangedFile["status"];
}

export interface GitChangedFilesProvider {
  getChangedFiles(): Promise<VscodeChangedFile[]>;
}

export type ChangedFilesLoadResult =
  | {
      availability: "available";
      files: VscodeChangedFile[];
    }
  | {
      availability: "unavailable";
      files: [];
      message: string;
    };

export async function loadChangedFiles(
  provider: GitChangedFilesProvider,
): Promise<ChangedFilesLoadResult> {
  try {
    return {
      availability: "available",
      files: await provider.getChangedFiles(),
    };
  } catch {
    return {
      availability: "unavailable",
      files: [],
      message: "Git changed files are unavailable.",
    };
  }
}
