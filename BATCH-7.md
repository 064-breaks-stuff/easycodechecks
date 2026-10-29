# Batch 7 — Route payload isolation (no assets required)

## Scope

Branding, photography, article migration, and project material stay deferred as requested.
This is the performance/loading-boundary portion of the approved architecture.
No redesign, new service, backend, dependency, or deployment change.

## Baseline

Read-only GitHub main: f2d79272f2d375d4b5e829658ce3a473dc807b73.
The committed reports already reviewed at this exact commit show:
- 0 npm-audit vulnerabilities.
- Vitest 4.1.12 with 64 passing unit/component tests.
- Passing production build and all 14 prerender/link checks.
- 73 browser passes, 0 failures/flakes, 8 viewport-conditional skips.

Before this overlay, the actual home route, generic route, route manifest,
InteriorView, and interior test source were fetched read-only at that commit.
No newer commit was present. No remote writes or workflow actions.

## Why this is useful

The home route re-exported loader/meta from routes/page.jsx. That UI route imports
InteriorView, which in turn statically imported QuotePageBody. This coupled shared
route helpers, general interior UI, and the React Hook Form/Zod feature.

This batch establishes explicit source boundaries:

- Shared loader/meta live in app/lib/page-route.js with data-only imports.
- Home imports shared helpers directly, not another page implementation.
- General interior pages no longer import the quote form.
- /request-a-quote has its own route module and view, containing the form dependency.

The bundler can therefore keep the quote implementation out of non-quote routes.
Actual browser loading is checked by the new production-preview test; no byte-size
or LCP improvement is claimed before your local run.

## Apply locally

Stop the dev server, merge this ZIP into the existing project root, then run:

    npm run test:e2e

One command runs the unit suite, production build, route checks, asset inventory,
and all browser projects. No npm install, browser download, or lockfile update needed.

## Complete replacements

- app/routes.js
- app/routes/home.jsx
- app/routes/page.jsx
- app/components/interior/InteriorView.jsx
- tests/interior.test.jsx

## New files

- app/lib/page-route.js
- app/routes/quote.jsx
- app/components/forms/QuotePageView.jsx
- scripts/lib/static-import-graph.mjs
- tests/route-boundaries.test.js
- tests/e2e/payload.spec.js
- BATCH-7.md
- BATCH-7-MANIFEST.json

Copy all files, including the manifest, so the active-file integrity verifier knows
these intentional replacements supersede earlier delivered hashes.

## Preserved behavior

- Same 14 public paths, route IDs, page records, and prerender list.
- Same loader data shape and metadata/canonical URLs.
- Same homepage, interior, and quote-page HTML structure and CSS classes.
- Same temporary wordmark and authored illustrations.
- Same Three.js/Anime.js scenes and motion preferences.
- Same quote fields, validation, preselection, local-only preview, and fallback notice.
- Same noindex/development robots restrictions and route-aware local preview.
- Same 404 behavior, audit-clean package/lockfile, and browser fixtures.

The quote route now directly renders QuotePageView rather than entering the generic
InteriorView switch. Its wrapper, PageHero and QuotePageBody are equivalent to the
previous quote branch. Existing interior tests are updated to render the actual
quote view rather than asserting an obsolete generic-view ownership boundary.

## New checks

### Unit/source checks

- Home's static import graph has no React Hook Form, resolver, or Zod import.
- General interior route's graph has none of those form dependencies.
- Dedicated quote route does contain the form dependencies.
- Shared loader/meta preserve the existing data and canonical URL behavior.
- Unknown shared-loader paths still reject with a 404 Response.

The helper follows this project's explicit static imports/re-exports, not dynamic
imports. It is a lightweight structural guard, not a general JavaScript parser or
a replacement for production-bundle inspection.

### Browser check

The new test visits Home -> Services -> Quote. It inspects completed JavaScript
responses for the unique quote-ui-fields implementation marker:

- Home: quote implementation must not have been fetched.
- Services: it must still not have been fetched.
- Quote: it must load and the actual preview button must become enabled.

The positive quote check makes sure the marker detector is not passing merely
because it fails to recognize every bundle. The test does not depend on hashed
chunk filenames or assume the size of generated bundles.

Existing direct HTTP/no-JS, form, metadata, mobile-navigation, runtime-error, and
fallback tests continue to run unchanged.

## Reports to push

- verification/latest.json
- verification/browser-summary.json
- verification/build-assets.json

No lockfile changes are expected. Do not suppress a failing check; share the exact
failure if the loading boundary differs from the intended source graph.

## What remains deliberately unresolved

The large optional Three.js chunk is not split cosmetically or hidden by raising
warning thresholds. Router future flags and Zod annotation warnings are not changed.
Actual LCP/INP/GPU measurements and final assets/content/deployment remain separate.

## Delivery verification

- Existing InteriorView and test sources were hash-matched before isolated edits.
- Plain JavaScript/MJS syntax checked with Node.
- Shared route-helper behavior checked with synthetic data fixtures.
- Static graph helper exercised with real temporary source files.
- Relative file targets and ZIP hashes checked.

New React JSX, full Vitest/build, and browser tests were not executed in the delivery
environment. The local gate is required evidence; no passing result is fabricated.

## Rollback

Restore the five replacement files from the preceding commit and remove only these
new files. No dependency rollback or npm install is needed.
