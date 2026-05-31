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
  readGithubChangedFileBlocks,
  type GithubChangedFileBlock,
} from "./githubDomAdapter";
import "../styles/content.css";

const ROOT_ID = "harnesslens-root";

mountHarnessLens();

export function mountHarnessLens(rootDocument: Document = document): void {
  const blocks = readGithubChangedFileBlocks(rootDocument);
  const mountPoint = createMountPoint(rootDocument);
  if (!mountPoint) {
    return;
  }

  createRoot(mountPoint).render(
    <HarnessLensApp initialBlocks={blocks} rootDocument={rootDocument} />,
  );
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
    const filesBucket = rootDocument.getElementById("files_bucket");
    if (!filesBucket) {
      return;
    }

    const observer = new MutationObserver(() => {
      const nextBlocks = readGithubChangedFileBlocks(rootDocument);
      filterChangedFileBlocks(nextBlocks, activeFilter);
      setBlocks(nextBlocks);
    });
    observer.observe(filesBucket, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [activeFilter, rootDocument]);

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
        onRevealHarnessFile={(path) => revealNativeDiff(blocks, path)}
      />
    </div>
  );
}

function createMountPoint(rootDocument: Document): HTMLElement | undefined {
  const existing = rootDocument.getElementById(ROOT_ID);
  if (existing) {
    return existing;
  }

  const filesBucket = rootDocument.getElementById("files_bucket");
  if (!filesBucket?.parentElement) {
    return undefined;
  }

  const mountPoint = rootDocument.createElement("div");
  mountPoint.id = ROOT_ID;
  filesBucket.parentElement.insertBefore(mountPoint, filesBucket);
  return mountPoint;
}

function revealNativeDiff(blocks: GithubChangedFileBlock[], path: string): void {
  const block = blocks.find((candidate) => candidate.path === path);
  block?.element.scrollIntoView({ block: "center", behavior: "smooth" });
  block?.element.setAttribute("data-harnesslens-highlight", "true");
}
