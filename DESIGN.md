# HarnessLens Design Specification

## 1. Product Feel

HarnessLens should feel like a native development/review aid: compact, quiet, predictable, and trustworthy.

The MVP is not a causality visualization tool. Avoid visual language that implies one file caused another.

## 2. Shared Language

Use these labels:

- Harness
- Validation
- Code
- All

Do not use these MVP labels:

- Linked
- Scoped
- Grouped
- Caused by
- Intent source
- Relationship

## 3. Browser Extension UI

Primary controls:

- Category counts.
- Filter tabs or segmented controls: All / Harness / Validation / Code.
- Harness panel listing changed harness files.

Expected behavior:

- Filtering makes it easier to inspect one category at a time.
- Harness panel items jump to native GitHub file diffs.
- GitHub native diff remains visible and authoritative.
- UI should fit near GitHub's Files Changed controls without feeling like a separate app.

## 4. VS Code Extension UI

Primary controls:

- HarnessLens Tree View.
- Groups: Harness Changes, Validation Changes, Code Changes.
- Status/count summary.
- Open file/diff command.

Expected behavior:

- Uses VS Code native Tree View patterns.
- Clicking items opens native editor or diff views.
- Empty state is concise.

## 5. Visual Constraints

- Use restrained colors compatible with GitHub and VS Code themes.
- Prefer native tokens when available.
- Do not use decorative hero/marketing visuals.
- Do not use cards inside cards.
- Keep text compact and scannable.
