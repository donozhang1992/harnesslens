import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserIsolationView,
  type CategoryFilter,
} from "../components/BrowserIsolationView";
import {
  filterChangedFileBlocks,
} from "./artifactGrouping";
import {
  findGithubChangedFilesContainer,
  readGithubChangedFileBlocks,
  type GithubChangedFileBlock,
} from "./githubDomAdapter";
import "../styles/content.css";

const ROOT_ID = "harnesslens-root";
const remountObservers = new WeakMap<Document, MutationObserver>();

startHarnessLens();

export function startHarnessLens(rootDocument: Document = document): void {
  setHarnessLensStatus(rootDocument, "waiting-for-diffs");
  superviseHarnessLensRemounts(rootDocument);
  mountHarnessLens(rootDocument);
}

export function mountHarnessLens(rootDocument: Document = document): boolean {
  const existing = rootDocument.getElementById(ROOT_ID);
  if (existing) {
    setHarnessLensStatus(rootDocument, "mounted");
    return true;
  }

  const blocks = readGithubChangedFileBlocks(rootDocument);
  const mountPoint = createMountPoint(rootDocument, blocks);
  if (!mountPoint) {
    return false;
  }

  createRoot(mountPoint).render(
    <HarnessLensApp initialBlocks={blocks} rootDocument={rootDocument} />,
  );
  setHarnessLensStatus(rootDocument, "mounted");
  return true;
}

function setHarnessLensStatus(rootDocument: Document, status: string): void {
  rootDocument.documentElement.setAttribute("data-harnesslens-status", status);
}

function superviseHarnessLensRemounts(rootDocument: Document): void {
  if (remountObservers.has(rootDocument)) {
    return;
  }

  const observer = new MutationObserver(() => {
    mountHarnessLens(rootDocument);
  });
  observer.observe(rootDocument.body, { childList: true, subtree: true });
  remountObservers.set(rootDocument, observer);
}

function HarnessLensApp({
  initialBlocks,
  rootDocument,
}: {
  initialBlocks: GithubChangedFileBlock[];
  rootDocument: Document;
}) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");

  useEffect(() => {
    const filesContainer = findGithubChangedFilesContainer(rootDocument, blocks);
    if (!filesContainer) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      const root = rootDocument.getElementById(ROOT_ID);
      if (
        root &&
        mutations.every((mutation) => root.contains(mutation.target))
      ) {
        return;
      }

      const nextBlocks = readGithubChangedFileBlocks(rootDocument);
      filterChangedFileBlocks(nextBlocks, activeFilter);
      setBlocks(nextBlocks);
    });
    observer.observe(filesContainer, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [activeFilter, blocks, rootDocument]);

  const applyFilter = (filter: CategoryFilter) => {
    filterChangedFileBlocks(blocks, filter);
    setActiveFilter(filter);
  };

  return (
    <div className="harnesslens-shell">
      <BrowserIsolationView
        blocks={blocks}
        activeFilter={activeFilter}
        onFilterChange={applyFilter}
        onRevealFile={(path) => revealNativeDiff(blocks, path)}
      />
    </div>
  );
}

function createMountPoint(
  rootDocument: Document,
  blocks: GithubChangedFileBlock[],
): HTMLElement | undefined {
  const existing = rootDocument.getElementById(ROOT_ID);
  if (existing) {
    return existing;
  }

  const filesContainer = findGithubChangedFilesContainer(rootDocument, blocks);
  if (!filesContainer) {
    return undefined;
  }

  const mountPoint = rootDocument.createElement("div");
  mountPoint.id = ROOT_ID;
  const firstBlock = blocks[0]?.element;
  if (filesContainer.matches("[data-testid='progressive-diffs-list']")) {
    if (!filesContainer.parentElement) {
      return undefined;
    }
    filesContainer.parentElement.insertBefore(mountPoint, filesContainer);
  } else if (firstBlock?.parentElement === filesContainer) {
    filesContainer.insertBefore(mountPoint, firstBlock);
  } else if (filesContainer.parentElement) {
    filesContainer.parentElement.insertBefore(mountPoint, filesContainer);
  } else {
    return undefined;
  }
  return mountPoint;
}

function revealNativeDiff(blocks: GithubChangedFileBlock[], path: string): void {
  const block = blocks.find((candidate) => candidate.path === path);
  block?.element.scrollIntoView({ block: "center", behavior: "smooth" });
  block?.element.setAttribute("data-harnesslens-highlight", "true");
}
