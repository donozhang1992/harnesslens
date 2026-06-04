# Chrome Web Store Listing Draft

Use this copy for the Chrome Web Store listing. Privacy and data-use answers
live in `PRIVACY.md` and the Chrome dashboard privacy form.

## Name

HarnessLens

## Short Description

Filter GitHub pull request files into Harness, Validation, and Code.

## Detailed Description

HarnessLens is a small review tool for the vibe coding era. It helps reviewers
understand GitHub pull requests faster by showing what kind of change each file
represents.

Vibe coding pull requests often mix the harness that guides AI-assisted work
with the tests that validate it and the code that ships it. Prompts, specs,
agent instructions, PRDs, ADRs, CI, tests, and runtime source all land in the
same GitHub diff. GitHub shows the diff, but it does not separate those files
by review intent.

HarnessLens adds a small review panel to GitHub pull request changed files so
you can quickly switch between Harness, Validation, and Code changes.

Use HarnessLens to:

- Start with Harness files to understand the intent behind a change.
- Review tests, fixtures, CI workflows, and snapshots as Validation changes.
- Isolate runtime Code changes when you need implementation focus.
- See category counts for the pull request.
- Jump from a category list to GitHub's native diff.
- Keep using GitHub comments, viewed state, file folding, and review controls.

Harness files include PRDs, specs, contracts, ADRs, prompts, agent
instructions, and operating rules.

Validation files include tests, fixtures, CI workflows, snapshots, and other
verification assets.

Code files include runtime source and files that do not match Harness or
Validation rules.

HarnessLens is intentionally lightweight. It does not replace GitHub's review
experience; it adds a lens on top of it so reviewers can choose the right
review path before reading every file line-by-line.

Current limitations:

- Classification uses built-in defaults.
- Project-level configurable classification is planned.
- The extension currently targets GitHub pull request changed-file pages.
- HarnessLens does not install Git hooks, parse commit trailers, infer
  causality, or build relationship graphs.

## Suggested Category

Developer Tools

## Suggested Screenshot Captions

1. Review all changed files grouped by Harness, Validation, and Code.
2. Isolate Harness files to review intent, specs, and operating rules first.
3. Jump from HarnessLens file links to GitHub's native diff.
