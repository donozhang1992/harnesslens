# VS Code Marketplace Listing Draft

The VS Code Marketplace uses `extensions/vscode/package.json` for the short
description and `extensions/vscode/README.md` for the extension details page.

## Display Name

HarnessLens

## Extension ID

`harnesslens.harnesslens-vscode`

This assumes the Marketplace publisher identifier is `harnesslens`.

## Short Description

Review local Git changes as Harness, Validation, and Code.

## Categories

Other

## Keywords

- git
- review
- vibe-coding
- ai
- testing
- harness

## Marketplace Description

Use the content in `extensions/vscode/README.md`.

## Publish Commands

```powershell
npx @vscode/vsce login harnesslens
npx @vscode/vsce publish --packagePath dist/harnesslens-vscode-0.1.3.vsix
```

If the publisher identifier is not `harnesslens`, update
`extensions/vscode/package.json` before packaging and publishing.
