# Fix 6.1 — route-aware local preview

## Evidence reviewed

The uploaded paste.txt reports 60 unit tests and production build passing, followed
by 54 browser failures, 16 passes, and 8 skips. Failures cluster on direct interior
URLs in all viewports, including a JavaScript-disabled quote page missing its form.
Homepage and client-side navigation checks pass. React reports hydration error 418.

That pattern points to the local static-preview response selecting the wrong HTML
for extensionless interior URLs, before form logic runs. This patch explicitly maps
all known public routes to their actual prerendered index.html files. It does not
assume each component or validation rule independently failed.

GitHub main is still f3bcc6f95e680fe4627d80ca8c27e0623de66954 (Batch 5), so Batch 6
and its failed browser reports are not yet available there. This overlay targets
the Batch 6 files supplied earlier and demonstrated by your local log. No GitHub writes.

## Apply locally

Keep the existing Batch 6 files. Stop any preview using port 4173, then merge this
ZIP into the project root. Allow complete replacement of:

- package.json
- playwright.config.js

Added:

- scripts/preview.mjs
- scripts/lib/static-preview.mjs
- tests/static-preview.test.js
- tests/e2e/direct-html.spec.js
- BUILD-FIX-6.1.md
- BUILD-FIX-6.1-MANIFEST.json

No dependency versions change. No npm install or browser download is needed if
Batch 6 is already installed. package.json only changes the preview command.

## Run

First use a narrow browser run to avoid repeating all the long failures:

    npm run test:e2e -- --project=desktop

This still runs the complete unit/build gate, but executes only desktop browser
cases. If it passes, run the complete browser suite:

    npm run test:e2e

The second full run is the evidence needed before another feature batch.
Neither retries nor timeouts are increased. No assertions or error guards are removed.

For manual preview after a successful build:

    npm run preview

This now uses the same route-aware local server as Playwright. It accepts optional
--host 127.0.0.1 and --port arguments, rejects nonlocal hosts, and fails on port
conflicts rather than silently moving to another port.

## Response mapping

- / -> build/client/index.html
- /services -> build/client/services/index.html
- /services/ -> the same services HTML, without a redirect
- /request-a-quote?industry=banking -> the quote HTML, with the original query intact
- Existing .data, JS, CSS, image, and font paths -> the actual corresponding files
- Missing JS/CSS/data assets -> 404, never homepage HTML
- Unknown extensionless HTML navigation -> the generated __spa-fallback.html, local status 404
- Writes such as POST -> 405; this preview is not a form backend

X-Preview-File reports the relative file used, so the new HTTP regression test can
check the actual response rather than just asserting that some H1 exists.

The helper confines file reads to the built output directory, rejects unsafe decoded
paths, prevents symlink escape, serves correct MIME types, and disables caching for
local QA. It is not a production hosting server or a Cloudflare deployment change.
Do not expose it to the public internet.

## Checks added

The native Node/Vitest HTTP regression checks actual responses for:
slashless/slashed/query URLs, quote markup, data MIME/body, missing assets, unknown
HTML fallback, HEAD, and rejected POST.

The Playwright request test checks all 14 known URLs' HTML/title/file mapping before
JavaScript, plus quote markup on a query URL. Existing hydration, title, no-JS,
form-interaction, and runtime-error checks remain unchanged.

## Audit finding is separate and unresolved

Your log also reports 3 npm vulnerabilities: 1 moderate and 2 critical.
The package names/advisories are not provided. No dependency upgrade can be chosen
responsibly from those counts alone, and this preview patch does not fix that finding.

Capture the detailed report without modifying dependencies:

    npm audit --json > verification/npm-audit.json

npm audit may exit nonzero when vulnerabilities are present; the report is still
useful. Share/push that report with the verification files. Do not run npm audit fix
--force as a blanket response; inspect the exact advisories and proposed changes first.

## Verification boundary

Delivery checks: native syntax checks, ZIP hashes, and an actual local HTTP test
using temporary mock prerender artifacts, not a fabricated React build.
The full Windows React/browser suite must be rerun locally. This patch is not a claim
that all browser failures or reported vulnerabilities are already resolved.

## Push after rerunning

Push Batch 6, this patch, verification/latest.json, verification/browser-summary.json,
verification/build-assets.json, and the audit JSON. Review reports before committing
if your tooling prints sensitive details.

## Unchanged

No app component, content, schema, animation, UI-only boundary, dependency version,
ssr setting, future flag, chunk-size warning threshold, or production deployment.
