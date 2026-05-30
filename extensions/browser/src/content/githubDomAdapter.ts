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
  const selector = "[data-file-name], [data-path], [data-testid='file']";
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      selector,
    ),
  ).filter((element) => {
    if (readFilePath(element) === undefined) {
      return false;
    }

    return element.parentElement?.closest(selector) === null;
  });
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
