# Fix 7.1 — avoid the dynamic URL transform in route-boundary tests

## Evidence

The supplied terminal log shows the existing 64 tests pass, while the new
route-boundaries suite fails with zero collected tests and:

Cannot split a chunk that has already been edited (... import.meta)

The build, all 14 prerender checks, and internal-link checks still pass.
Browser tests correctly do not start because the unit gate failed.

## Cause and change

The supplied test used new URL with a template-literal path and import.meta.url
inside the loop. That pattern is subject to Vite's URL/asset transformation,
which is unnecessary for reading local source files in a Node test.

The full replacement uses node:path with process.cwd() to locate app/routes,
then joins each route filename. The existing npm/Vitest commands run from the
project root, as shown in the supplied logs. No import.meta or new URL path
construction remains in this test.

All five checks are preserved: the home and general-page graphs exclude form
libraries; the quote graph includes them; loader/meta behavior is preserved;
unknown paths reject with 404. No skip or reduced assertion coverage.

## Apply

Keep Batch 7 installed. Merge the ZIP into the project root and replace:

- tests/route-boundaries.test.js

The other two files are these notes and the active-file integrity manifest.
No app, dependency, lockfile, config, future flag, routing, or browser-test change.

## Efficient verification

Run this from the project root first; it does NOT rebuild the application:

    npx vitest run tests/route-boundaries.test.js

If that passes, run the complete gate once:

    npm run test:e2e

If the focused suite fails, share that output instead of repeating the full build.
The existing build results already show a separate quote bundle, but that does not
substitute for the browser payload boundary assertion.

## Delivery checks

- Native Node syntax check of the replacement.
- Confirmed all five assertion cases remain in source.
- Confirmed import.meta and file-URL asset construction are absent.
- ZIP integrity and hashes verified.

The installed Vitest transform and real browser suite were not executed here;
no local passing result is fabricated.

GitHub main at the read-only check is still f2d79272f2d375d4b5e829658ce3a473dc807b73.
The patch targets the delivered Batch 7 code evidenced by your latest local run.
No remote writes were made.
