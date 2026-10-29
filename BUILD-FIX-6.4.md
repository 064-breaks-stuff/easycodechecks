# Fix 6.4 — resolve the Vitest audit findings with the smallest supported upgrade

## Audit evidence (verification/npm-audit.json, commit 64e90a8)

Three findings, all through the direct dev dependency vitest:
- tinypool <= 2.1.1 — critical prototype-pollution-to-code-execution advisories
- @vitest/mocker >= 2.1.0 and < 4.1.11 — moderate path-traversal advisory
- @vitest/mocker before 4.1.12 — moderate code-injection advisory

The advisory pages say the first mocker fix is 4.1.11, the second is 4.1.12 on the
4.x line, and the tinypool issue is fixed at 2.1.2. Vitest's v4 migration guide says
Vitest 4 completely removed tinypool, so the 4.x line avoids that package entirely.

## Decision

Upgrade vitest from ^3.2.4 to ^4.1.12. This targets all three affected dependency
records in the supplied audit without taking Vitest 5, which npm labels as the offered
fix but would be a second major jump. Vitest 4 officially needs Vite >= 6 and
Node >= 20; this project uses Vite ^6.3.6 (6.4.5 in your logs), Node >= 22.12,
and does not use vi.mock, coverage, browser mode, workspaces, or poolOptions.

I could not fetch the npm registry metadata for 4.1.12 here. The advisory says that
version contains the backport. If npm cannot resolve it, the install will fail
visibly; paste that error rather than changing versions.

## Real exposure

Both advisories describe dev-tooling paths. The mocker issues involve a reachable
dev-server WebSocket using mocker plugins; this repository does not configure
mockerPlugin or interceptorPlugin. The tinypool issue requires prior prototype
pollution plus passing run() options. These are not exposed by the static site
output. The upgrade is still correct to clear the dependency risk.

## Apply

Merge the ZIP into the project root and replace package.json, then run:

    npm install
    npm audit --json > verification/npm-audit.json
    npm run test:e2e

Do not use npm audit fix --force. npm install updates package-lock.json; commit it.
The first command may take time because Vitest dependencies change.

After install, the new audit file should show zero vulnerabilities. If it does not,
push or paste that file; do not proceed to feature work with an unexplained result.

The e2e command runs unit tests, build, preview, and all browser projects once.
No application, test, or config source changes were made: only the vitest range.
Previous tests are not expected to depend on Vitest 3-only APIs, but local execution
is the proof.

## Unchanged warnings

React Router v8 future-flag notices, the 889 KB Three.js chunk warning, and Zod
Rollup annotation notices are separate. They are not hidden or addressed here.

## Boundary

GitHub main is 64e90a880383d8c5e8786e8541e92f0cb1666742. No remote writes.
Package syntax and integrity were checked here; npm resolution, tests, build and
browsers were not executed. No passing result is claimed.
