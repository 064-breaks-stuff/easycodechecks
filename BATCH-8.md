# Batch 8 — Structured data and share metadata

## Scope

Asset-independent SEO metadata from existing approved company/page records.
Branding, photographs, original article migration, and project material remain deferred.
No business-copy, visual, routing, dependency, deployment, or form-delivery change.
Indexing stays disabled: noindex,nofollow metadata and robots Disallow remain untouched.

## Verified baseline

Read-only GitHub commit f5dc16dd544899bad47b0a792bc78411c979eb98.
Committed reports reviewed at that snapshot show 69 passing unit tests, a successful
build, all 14 prerender/link checks, and 76 browser passes with 0 failures/flakes
and 8 expected viewport skips. The current helper, company config, headers, and
sitemap implementation were inspected before preparing this overlay.
No GitHub writes or workflow actions were performed.

## Apply locally

Merge the ZIP into the project root, allowing the two complete replacements below.
Run once:

    npm run test:e2e

No installation, lockfile edit, additional browser download, environment variable,
external service, or secret is required.

## Complete replacements

- app/lib/page-route.js: loader unchanged; delegates metadata construction to seo.js.
- tests/e2e/routes.spec.js: retains the existing cases and adds metadata/JSON-LD assertions.

## New files

- app/lib/seo.js
- tests/seo.test.js
- BATCH-8.md
- BATCH-8-MANIFEST.json

## Metadata

Existing titles, descriptions, canonical URLs, Open Graph title/description/type/url,
and noindex policy remain the same. Adds:

- og:site_name
- twitter:card=summary
- twitter:title
- twitter:description
- One JSON-LD graph per known marketing page

No og:image, Twitter account handle, or logo is invented. A summary card without
approved imagery does not guarantee that every social platform will show a card.
Final social artwork stays with the deferred asset work.

## Structured data

Uses React Router's documented MetaDescriptor script:ld+json object support.
The existing Meta component serializes/emits it; no new HTML injection component
or third-party SEO library is introduced.

Graph nodes:
- Organization: existing brand name, URL, public email, telephone, company location
  as a Place name, and the existing LinkedIn URL.
- WebSite: existing name/URL, organization publisher, existing English language.
- WebPage: actual page title/description/canonical URL and references.
- BreadcrumbList: on non-home pages, with service/industry hierarchy where relevant.
- Service: only on the three established service-detail pages.

Industry pages are NOT declared to be separate services. The quote preview is NOT
described as a working submission action. Only predefined site/page records feed
this graph; no form values, query text, inferred addresses, or visitor data are used.

Intentionally absent:
- Price/offers, ratings/reviews, employee counts, guarantees, fees, service territory.
- Street/postal address, geo coordinates, invented dates or article authorship.
- Organization logo, project photos, SearchAction, quote submission action.
- FAQ rich-result markup or statements that a rich result is guaranteed.

This is machine-readable representation of existing content, not new marketing facts.
The graph is deterministic: no timestamps or random identifiers that could cause
server/client differences. Error/404 routes retain their existing metadata behavior.

## Regression checks

Unit tests cover all 14 pages, canonical consistency, existing noindex policy,
unique graph IDs, service/page-type distinction, company contact consistency,
breadcrumb positions, deterministic output, and excluded unsupported claims.

Existing browser route tests also require one parseable JSON-LD script with the
correct page URL and organization email, plus the added share tags. All original
route, title, canonical, overflow, no-canvas, and client-404 assertions remain.

The existing route payload checks remain active. seo.js has data-only imports,
so the form/code-splitting boundary is not intentionally changed.

## Reports

Push the updated verification/latest.json, verification/browser-summary.json,
and verification/build-assets.json after the full gate passes.
No lockfile change is expected and dependency audit state is unchanged.

## Verification here

- Existing shared-route helper reconstructed and SHA-256 matched before editing.
- Existing loader code retained byte-for-byte.
- Native Node syntax checks for all delivered JS files.
- Actual Node metadata/graph assertions using synthetic records (no dependency install).
- Relative imports, ZIP integrity, and hashes checked.

The real React Router Meta rendering, new Vitest suite, production build, and browser
suite were not executed here. Your local full gate supplies that evidence.
No indexing, rich-result, social-preview, ranking, security, or performance outcome
is guaranteed by this batch.

## Rollback

Restore the two replacements from the preceding commit and remove only these new
files. No dependency rollback or installation is required.
