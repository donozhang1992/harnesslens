# Security Policy

## Supported Versions

HarnessLens is pre-1.0. Security fixes are handled on the latest `main`
branch until a formal release branch policy exists.

## Reporting A Vulnerability

Please do not open a public issue for sensitive security reports.

Until a private security advisory channel is configured, contact the repository
owner directly with:

- affected version or commit;
- Browser or VS Code surface affected;
- reproduction steps;
- expected impact;
- whether repository contents, changed file paths, or account data could be
  exposed.

HarnessLens does not intentionally collect telemetry, make network requests, or
upload repository contents. Reports that show otherwise should be treated as
high priority.

## Scope

Security-relevant areas include:

- Browser extension permissions and GitHub DOM access.
- VS Code Git API usage.
- Package scripts and release artifacts.
- Any future configurable classification file parsing.
