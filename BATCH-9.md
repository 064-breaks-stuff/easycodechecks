# Batch 9 — Cloudflare Pages preview artifact preparation

## Verified baseline

Read-only GitHub commit a8a4f884f12e245dd11b2ced55b7d6050088d5c4.
Committed evidence reviewed: 86 unit tests passing, successful build, all 14
prerender/link checks, and 76 browser passes with no failures/flakes and 8 expected
viewport skips. The current public folder, package scripts, headers, and sitemap
script were inspected before this overlay.

No remote GitHub writes, Cloudflare operations, deployment, DNS changes, account
creation, or CI workflow creation. Branding/assets remain deferred; form stays UI-only.

## What this does

Appends a small post-build step to the existing npm run build:
- Confirms every registry page's prerendered HTML exists.
- Confirms the build retains global noindex headers and robots crawl restriction.
- Copies __spa-fallback.html to a root 404.html exactly, preserving framework output.
- Writes verification/pages-readiness.json describing LOCAL artifact preparation.

The report explicitly marks deployed:false and cloudflareRuntimeVerified:false.

Why: Cloudflare Pages recognizes 404.html. Without it, default SPA handling can
serve the root index on unmatched paths. A prerendered homepage is not the same
as React Router's SPA fallback shell. No catch-all index rewrite is added.

## Apply

Merge this ZIP into the existing project root. Complete replacements:

- package.json: only appends node scripts/prepare-pages.mjs to the build command.
- public/_headers: only adds the global X-Robots-Tag noindex,nofollow directive.

New files:

- scripts/prepare-pages.mjs
- scripts/lib/pages-artifact.mjs
- tests/pages-artifact.test.js
- tests/e2e/pages-preview.spec.js
- docs/cloudflare-preview.md
- BATCH-9.md
- BATCH-9-MANIFEST.json

No dependency or lockfile change. No npm install needed.

Run once:

    npm run test:e2e

The runner invokes the existing build, which now includes artifact preparation.
No additional manual build step or deployment command is needed.

## Checks added

- The generated 404 file is byte-identical to the actual framework fallback.
- Missing prerendered output fails preparation instead of producing false readiness.
- Missing global crawler protection fails preparation.
- Local HTTP access confirms /404.html equals /__spa-fallback.html.
- Direct unknown navigation displays the existing not-found view with local 404 status.

The local server's unknown-page response still comes from its existing SPA fallback
implementation. Because the generated 404 bytes are identical, the artifact test
checks the exported file and the browser test checks the same shell's client behavior.
This is not an emulation or certification of Cloudflare's complete serving behavior.

## Publish-folder settings are prepared, not activated

Build command: npm run build
Output directory: build/client
No server, Pages Function, new dependency, secret, project ID, or domain is required
for this preparation. The separate guide provides later target-host checks.

Do not publish the repository or verification folder. Do not switch the live domain.
Any actual upload/deployment is a separate user-controlled action, not performed here.

## Unchanged

No app component, route, service copy, metadata graph, form validation, motion,
asset placeholder, content record, audit-clean dependency version, or runtime API.
No CSP experiment, caching-threshold override, broad redirect rule, or production
indexing toggle. Existing security and fingerprinted-asset header rules remain.

## Reports to push

- verification/latest.json
- verification/browser-summary.json
- verification/build-assets.json
- verification/pages-readiness.json

The readiness report is LOCAL artifact evidence only, not a deployment success report.

## Delivery checks

- JS/MJS parsed by native Node.
- Native Node temporary-artifact checks exercise exact copying, global header guard,
  and missing-route rejection.
- The post-build helper has no third-party dependencies or network calls.
- Archive hashes and integrity verified.

Full React/Vitest/build/browser execution was not performed here. The local gate
must pass. Actual Cloudflare redirect/header behavior still needs target-host testing
when a preview is separately authorized.

## Rollback

Restore package.json and public/_headers from the preceding commit; remove only the
new files listed above. Delete stale build/client/404.html or rebuild to clear the
output if needed. No dependency reinstall or account rollback is involved.
