# HarnessLens Privacy Notice

HarnessLens is a local review aid for changed files.

## Data Collection

HarnessLens does not collect analytics, telemetry, crash reports, or user
tracking data.

## Browser Extension

The Browser extension runs only on GitHub pull request pages matched by its
manifest.

It reads the visible pull request changed-file DOM in order to:

- list changed file paths;
- classify files as Harness, Validation, or Code;
- filter native GitHub diff blocks;
- scroll to native GitHub diff blocks.

The Browser extension does not send changed file paths, code, comments, account
information, or page content to any remote service.

## VS Code Extension

The VS Code extension uses the built-in VS Code Git extension API to read local
working tree and staged changed-file paths.

It uses those paths to:

- classify files as Harness, Validation, or Code;
- show grouped tree items;
- open native Git diffs or source files.

The VS Code extension does not upload repository content, changed file paths, or
workspace metadata to any remote service.

## Network Access

HarnessLens does not intentionally make network requests.

The Browser extension is loaded on GitHub pages and interacts with the page DOM.
GitHub itself may continue to make its normal requests while you review a pull
request.

## Local Storage

HarnessLens does not currently persist user settings or classification history.

Future configurable classification rules should be stored in project files or
local extension settings and documented before release.

## Contact

For pre-release issues, open an issue in the project repository or report the
manual test failure with reproduction steps.
