import type { ArtifactKind } from "@harnesslens/core";
import type { GithubChangedFileBlock } from "../content/githubDomAdapter";
import { groupChangedFilesByArtifactKind } from "../content/artifactGrouping";

export type CategoryFilter = ArtifactKind | "all";

export interface BrowserIsolationViewProps {
  blocks: GithubChangedFileBlock[];
  activeFilter: CategoryFilter;
  onFilterChange: (filter: CategoryFilter) => void;
  onRevealFile: (path: string) => void;
}

const FILTERS: Array<{ value: CategoryFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "harness", label: "Harness" },
  { value: "validation", label: "Validation" },
  { value: "code", label: "Code" },
];

const CATEGORIES: Array<{ value: ArtifactKind; label: string }> = [
  { value: "harness", label: "Harness" },
  { value: "validation", label: "Validation" },
  { value: "code", label: "Code" },
];

export function BrowserIsolationView({
  blocks,
  activeFilter,
  onFilterChange,
  onRevealFile,
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
        {activeFilter === "all" ? (
          <>
            <h2>Changed files</h2>
            {CATEGORIES.map((category) => (
              <FileNavigationGroup
                blocks={grouped[category.value]}
                headingLevel={3}
                key={category.value}
                label={category.label}
                onRevealFile={onRevealFile}
              />
            ))}
          </>
        ) : (
          <FileNavigationGroup
            blocks={grouped[activeFilter]}
            headingLevel={2}
            label={FILTERS.find((filter) => filter.value === activeFilter)!.label}
            onRevealFile={onRevealFile}
          />
        )}
      </div>
    </section>
  );
}

function FileNavigationGroup({
  blocks,
  headingLevel,
  label,
  onRevealFile,
}: {
  blocks: GithubChangedFileBlock[];
  headingLevel: 2 | 3;
  label: string;
  onRevealFile: (path: string) => void;
}) {
  const Heading = `h${headingLevel}` as const;

  return (
    <section className="harnesslens-file-group">
      <Heading>{label} files</Heading>
      {blocks.length === 0 ? (
        <p>No {label} files changed.</p>
      ) : (
        <ul>
          {blocks.map((block) => (
            <li key={block.path}>
              <button type="button" onClick={() => onRevealFile(block.path)}>
                {block.path}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
