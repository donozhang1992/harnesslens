export const githubFilesPageFixture = `
  <main>
    <div id="files_bucket">
      <div data-testid="file" data-file-name="docs/AGENTS.md" data-path="docs/AGENTS.md">
        <button aria-label="Toggle file" aria-expanded="true">docs/AGENTS.md</button>
        <table>
          <tbody>
            <tr data-line-number="12" data-side="right"><td>+ Browser workers read DESIGN.md</td></tr>
            <tr data-line-number="13" data-side="right"><td>+ Browser workers read CONTRACT.md</td></tr>
          </tbody>
        </table>
      </div>

      <div data-testid="file" data-file-name="extensions/browser/src/content/index.tsx" data-path="extensions/browser/src/content/index.tsx">
        <button aria-label="Toggle file" aria-expanded="false">extensions/browser/src/content/index.tsx</button>
        <table>
          <tbody>
            <tr data-line-number="27" data-side="right"><td>+ mountIntentIsolation()</td></tr>
          </tbody>
        </table>
      </div>

      <div data-testid="file" data-file-name="extensions/browser/tests/browserIsolationView.test.tsx" data-path="extensions/browser/tests/browserIsolationView.test.tsx">
        <button aria-label="Toggle file" aria-expanded="true">extensions/browser/tests/browserIsolationView.test.tsx</button>
        <table>
          <tbody>
            <tr data-line-number="4" data-side="right"><td>+ render comparison rows</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
`;

export const changedGithubDomFixture = `
  <main>
    <section aria-label="GitHub changed its markup">
      <p>No recognizable file blocks are present.</p>
    </section>
  </main>
`;
