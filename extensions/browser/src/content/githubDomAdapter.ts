export interface GithubChangedFileBlock {
  path: string;
  element: HTMLElement;
}

const PRIMARY_FILE_BLOCK_SELECTOR = [
  "[data-testid='file-diff']",
  "[data-testid='file'][data-file-name]",
  ".js-file[data-path]",
].join(", ");
const FALLBACK_FILE_BLOCK_SELECTOR = [
  "[data-file-path]",
  "[data-file-name]",
].join(", ");
const PROGRESSIVE_DIFFS_LIST_SELECTOR = "[data-testid='progressive-diffs-list']";

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

export function findGithubChangedFilesContainer(
  root: Document,
  blocks: GithubChangedFileBlock[] = readGithubChangedFileBlocks(root),
): HTMLElement | undefined {
  return (
    root.querySelector<HTMLElement>(PROGRESSIVE_DIFFS_LIST_SELECTOR) ??
    root.getElementById("files_bucket") ??
    blocks[0]?.element.parentElement ??
    undefined
  );
}

function findFileElements(root: ParentNode): HTMLElement[] {
  const filesByPath = new Map<string, HTMLElement>();
  const primaryElements = root.querySelectorAll<HTMLElement>(
    PRIMARY_FILE_BLOCK_SELECTOR,
  );
  const elements =
    primaryElements.length > 0
      ? primaryElements
      : findProgressiveDiffEntries(root) ??
        root.querySelectorAll<HTMLElement>(FALLBACK_FILE_BLOCK_SELECTOR);

  for (const element of elements) {
    const path = readFilePath(element);
    if (path === undefined) {
      continue;
    }

    const ancestor = element.parentElement?.closest<HTMLElement>(
      PRIMARY_FILE_BLOCK_SELECTOR,
    );
    if (ancestor != null && readFilePath(ancestor) === path) {
      continue;
    }

    if (!filesByPath.has(path)) {
      filesByPath.set(path, element);
    }
  }

  return [...filesByPath.values()].filter((element) => {
    if (readFilePath(element) === undefined) {
      return false;
    }

    return true;
  });
}

function findProgressiveDiffEntries(root: ParentNode): HTMLElement[] | undefined {
  const list = root.querySelector<HTMLElement>(PROGRESSIVE_DIFFS_LIST_SELECTOR);
  if (list == null) {
    return undefined;
  }

  return [...list.children].filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && readFilePath(element) !== undefined,
  );
}

function readFilePath(element: HTMLElement): string | undefined {
  const path =
    element.getAttribute("data-file-name") ??
    element.getAttribute("data-file-path") ??
    element.getAttribute("data-path") ??
    element.querySelector<HTMLElement>("[data-file-name]")?.getAttribute(
      "data-file-name",
    ) ??
    element.querySelector<HTMLElement>("[data-file-path]")?.getAttribute(
      "data-file-path",
    ) ??
    element.querySelector<HTMLElement>("[data-path]")?.getAttribute("data-path") ??
    readRegionLabelledPath(element);

  return path?.trim() || undefined;
}

function readRegionLabelledPath(element: HTMLElement): string | undefined {
  const region = element.matches("[role='region'][aria-labelledby]")
    ? element
    : element.querySelector<HTMLElement>("[role='region'][aria-labelledby]");
  const labelledBy = region?.getAttribute("aria-labelledby")?.trim();
  if (!labelledBy) {
    return undefined;
  }

  for (const id of labelledBy.split(/\s+/)) {
    const label = element.ownerDocument.getElementById(id)?.textContent?.trim();
    if (label) {
      return label;
    }
  }

  return undefined;
}
