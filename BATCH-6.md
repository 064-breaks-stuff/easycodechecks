# Batch 6 — Production-preview browser QA and asset inventory

## Baseline verification

Read-only GitHub commit: f3bcc6f95e680fe4627d80ca8c27e0623de66954 (step 5).
Reviewed the complete commit patch, current quote form, package manifest, shared
navigation, ignore rules, and committed verification/latest.json before this batch.

The committed report records:
- 55 tests passing in 10 files.
- Successful production build.
- Prerender/H1/noindex checks passing for 14 pages.
- Internal-link checks passing.
- 67 delivered files passing the active integrity check.
- UI-only quote configuration and safe local preview checks passing.

This baseline has automated source/build evidence, not browser-interaction evidence.
This batch adds the Playwright layer already included in the approved plan.
No design, copy, route, scene, form-delivery, or business-scope changes are made.
No GitHub writes, pull requests, deployment changes, or workflow execution.

## Install and run locally

1. Stop any server already using port 4173 (for example npm run preview).
2. Merge this ZIP into the existing project root, allowing the two replacements below.
3. Run:

    npm install
    npx playwright install chromium
    npm run test:e2e

The browser install is a local development dependency download, not a deployment.
No credentials are needed by the supplied tests. If your environment blocks the
browser download, report that error rather than marking the tests as passed.

npm run test:e2e automatically:
1. Runs the existing project verification gate (unit tests + production build).
2. Generates a build asset-size report.
3. Starts an isolated local Vite production preview on 127.0.0.1:4173.
4. Runs Chromium desktop, mobile-layout, and reduced-motion projects.
5. Writes a compact browser summary, including failures if tests fail.
6. Exits nonzero on verification/build/browser failure.

Do not run npm run build separately first; the runner already builds once through
the verification gate. Your normal dev server on port 5173 can stay stopped while testing.
No existing port-4173 server is reused, so stale preview output cannot silently pass.

The ordinary command remains available:

    node scripts/verify-project.mjs

That command checks source/unit/build/prerender as before. It does not run a browser.

## Files replaced

- package.json: adds @playwright/test as a development dependency and QA scripts.
- .gitignore: preserves existing rules, also excludes the large raw browser JSON report.

Commit the locally updated package-lock.json after npm install.
No lockfile was fabricated in the delivery environment.

## New files

- playwright.config.js
- tests/e2e/fixtures.js
- tests/e2e/routes.spec.js
- tests/e2e/navigation.spec.js
- tests/e2e/quote.spec.js
- tests/e2e/fallbacks.spec.js
- scripts/lib/browser-report.mjs
- scripts/analyze-build.mjs
- scripts/run-browser-tests.mjs
- tests/browser-report.test.js
- tests/build-assets.test.js
- BATCH-6.md
- BATCH-6-MANIFEST.json

## Browser coverage

All three projects use local Chromium with isolated test contexts:
- Desktop: 1440 x 1000, normal motion preference.
- Mobile layout: 390 x 844, touch/mobile emulation.
- Reduced motion: 1440 x 1000, prefers-reduced-motion: reduce.

Checks include:
- All 14 direct marketing routes: visible single H1, title, canonical, noindex,
  one main landmark, and no horizontal document overflow.
- No hero canvas or hero-scene chunk request on direct interior-route loads.
- Client-side missing-route fallback UI.
- Desktop disclosure toggling, Escape behavior, and navigation.
- Mobile dialog opening, focus containment, Escape dismissal, navigation focus,
  scroll-lock cleanup, and resizing to desktop.
- Empty quote validation, error-summary focus, field-link focus.
- Known/unknown query defaults and associated form-control labels.
- Valid local preview, edit invalidation, and reset behavior.
- No non-GET/HEAD request from the local quote flow.
- Unavailable-WebGL fallback, reduced-motion/mobile static scene behavior.
- No-JavaScript quote controls remain disabled.
- Unhandled page errors and hydration/critical React console errors.

The quote tests use synthetic example data only. External HTTP(S) page requests
are blocked by the shared fixture and flagged; no live company form is contacted.
Email and resource links are inspected, not used to send mail or visit external sites.

Tests that are inapplicable to a viewport are explicitly skipped and counted as
skipped, not described as passing. Retries are disabled to avoid hiding flaky runs.

## Report files to push

- verification/latest.json: source/unit/build/prerender results.
- verification/browser-summary.json: compact browser results and failures.
- verification/build-assets.json: generated JS/CSS asset inventory.
- Updated package-lock.json.

Review reports before committing if local test tooling prints sensitive information.
The ignored raw JSON, HTML report, screenshots, and traces remain on your machine.

Open the detailed local browser report with:

    npm run test:e2e:report

Optional focused debugging (the runner still verifies/builds first):

    npm run test:e2e -- --project=mobile
    npm run test:e2e -- --project=desktop --headed

A focused project is not evidence that every project passed. The summary lists actual
counts and failures; use an unfiltered npm run test:e2e for the full gate.

## Asset-size inventory

The QA runner writes actual built JS/CSS file sizes and Node gzip estimates.
You can regenerate the inventory for an existing build with:

    npm run analyze:build

The inventory flags JS files over a 500 KiB reference without changing Vite's
warning threshold. It measures generated files, not LCP, INP, actual network
transfer, first-load dependency totals, or an optimization result. Adding all
lazy files together is NOT the initial page-load size.

The existing large Three.js chunk warning and React Router/Zod advisories are
not suppressed or treated as fixed by this batch.

## Limits of this evidence

- These are Chromium checks, not real iOS Safari, Firefox, or a physical-device matrix.
- Headless WebGL support varies. The suite verifies deterministic fallback behavior;
  it does not certify the appearance, smoothness, or GPU timing of the actual 3D scene.
- Label/landmark/keyboard checks are not a complete WCAG or screen-reader audit.
- Document-overflow checks are not a complete visual-regression comparison.
- Client-side 404 UI is tested. Direct unknown-path HTTP status and host fallback
  mapping remain deployment checks; this batch does not alter them.
- The no-write-request assertion covers the tested quote interaction, not a security audit.
- No backend, mail sender, storage, upload, or privacy-policy implementation is added.

## Checks performed while packaging

- Node syntax checks for all delivered JavaScript/MJS.
- Native Node assertions for report status interpretation.
- Real temporary-file asset inventory/gzip checks.
- Relative imports against delivered files and the inspected baseline.
- ZIP integrity and delivery-manifest hashes.

Not executed here: dependency installation, Chromium download, the full unit suite,
production React build, or Playwright/browser tests. Those must run locally.
No browser pass result is fabricated.

## If something fails

Do not change warning thresholds, remove assertions, or proceed to another feature
batch just to obtain a green report. Push the summary/report or paste the specific
failure. A browser test may reveal a real interaction issue the earlier static
suite could not detect; fix that before extending the site.

## Remaining non-QA resources

Original logo and approved photography, full original article bodies/assets,
approved project/testimonial material, and any future live submission configuration
are still needed for the corresponding launch tasks. No substitute facts or assets
were invented to bypass those requirements.

## Rollback

Restore package.json and .gitignore from the preceding commit, remove only the new
files listed above, then run npm install to align the local lockfile. Existing app,
shared schemas, pages, scenes, and verification code are unchanged.
