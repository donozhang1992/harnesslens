import type { ArtifactKind } from "@harnesslens/core";
import type { GithubChangedFileBlock } from "../content/githubDomAdapter";
import { groupChangedFilesByArtifactKind } from "../content/artifactGrouping";

export type CategoryFilter = ArtifactKind | "all";

export interface BrowserIsolationViewProps {
  blocks: GithubChangedFileBlock[];
  activeFilter: CategoryFilter;
  onFilterChange: (filter: CategoryFilter) => void;
  onRevealHarnessFile: (path: string) => void;
}

const FILTERS: Array<{ value: CategoryFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "harness", label: "Harness" },
  { value: "validation", label: "Validation" },
  { value: "code", label: "Code" },
];

export function BrowserIsolationView({
  blocks,
  activeFilter,
  onFilterChange,
  onRevealHarnessFile,
}: BrowserIsolationViewProps) {
  const grouped = groupChangedFilesByArtifactKind(blocks);
  const counts = {
    all: blocks.length,
    harness: grouped.harness.length,
    validation: grouped.validation.length,
    code: grouped.code.length,
  };

  return (
    <section className="harnesslens-surface" aria-label="HarnessLens file categories">
      <div className="harnesslens-filters" role="group" aria-label="Changed file category">
        {FILTERS.map((filter) => (
          <button
            className="harnesslens-filter"
            aria-pressed={activeFilter === filter.value}
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            type="button"
          >
            {filter.label} <span>{counts[filter.value]}</span>
          </button>
        ))}
      </div>
      <div className="harnesslens-panel">
        <strong>Harness files</strong>
        {grouped.harness.length === 0 ? (
          <p>No Harness files changed.</p>
        ) : (
          <ul>
            {grouped.harness.map((block) => (
              <li key={block.path}>
                <button type="button" onClick={() => onRevealHarnessFile(block.path)}>
                  {block.path}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
