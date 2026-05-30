export interface GithubChangedFileBlock {
  path: string;
  element: HTMLElement;
}

export function readGithubChangedFileBlocks(
  root: ParentNode = document,
): GithubChangedFileBlock[] {
  try {
    return findFileElements(root).flatMap((element) => {
      const path = readFilePath(element);
      if (!path) {
        return [];
      }

      return [
        {
          path,
          element,
        },
      ];
    });
  } catch {
    return [];
  }
}

function findFileElements(root: ParentNode): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      "[data-file-name], [data-path], [data-testid='file']",
    ),
  ).filter((element) => readFilePath(element) !== undefined);
}

function readFilePath(element: HTMLElement): string | undefined {
  const path =
    element.getAttribute("data-file-name") ??
    element.getAttribute("data-path") ??
    element.querySelector<HTMLElement>("[data-file-name]")?.getAttribute(
      "data-file-name",
    ) ??
    element.querySelector<HTMLElement>("[data-path]")?.getAttribute("data-path");

  return path?.trim() || undefined;
}
