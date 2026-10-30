# Batch 10 — Whole-site professional visual refinement

## Apply

Baseline: 2cb6bca37c361489cdd91480d7569c8ba64b3713.
The GitHub check is read-only. Nothing is committed or deployed by this delivery.
If you have uncommitted local CSS edits that were not pushed, review/back them up
before overlaying these full replacements. This package does not know those edits.

Merge this ZIP into the project root, allowing replacement of the seven files below.
Do not replace entire folders or delete the existing project.

Replaced:
- app/styles/tokens.css
- app/styles/globals.css
- app/styles/home.module.css
- app/styles/interior.module.css
- app/styles/navigation.module.css
- app/styles/quote.module.css
- app/styles/scene.module.css

Added:
- scripts/capture-design.mjs
- docs/premium-design-audit.md
- BATCH-10.md
- BATCH-10-MANIFEST.json

No package.json or lockfile change. No installation, font download, or browser
reinstallation is required. Existing Playwright/Chromium installation is reused.

## Validate once

    npm run test:e2e -- --workers=1 --retries=0

This retains all test projects and existing assertions. Single-worker execution
reduces concurrent browser pressure without using retries to conceal failures.
No test/config files are replaced by the styling delivery.

## Review actual output

After the successful build/test gate, stop any manually running preview on port
4173. Optionally run:

    node scripts/capture-design.mjs

This starts and stops its own local preview and generates 28 real screenshots:
all 14 routes at 1440px desktop and 390px mobile. Open this local contact sheet:

    test-results/premium-review/index.html

The screenshots and contact sheet are created on YOUR machine, not pre-rendered
or fabricated in this package. The folder is already covered by test-results/
in .gitignore. Save any screenshots you want to retain before a later Playwright
run cleans test-results. Captures use reduced motion; normal-motion 3D quality
requires a separate browser look.

For interactive inspection:

    npm run dev

Inspect Home, Services, a service detail, an industry detail, About, Blog, Contact,
Quote, and the client 404 on desktop and mobile. Try the native navigation dialog,
FAQ, empty form validation, valid local review, and reset.

## Important preservation

This is a site-wide styling pass. No application JS/JSX is replaced. Therefore:
- Business copy, all 14 routes, canonical metadata and JSON-LD remain intact.
- The existing 3D model/camera and Anime.js lifecycle remain intact.
- UI-only form safeguards, explicit no-JS notice, and disabled controls remain intact.
- Noindex headers/robots and Cloudflare preparation remain intact.
- No fake client logos, photos, reviews, typography files, or service claims.

Font files are not available. System/installed variable-font fallbacks are explicitly
supported rather than making broken @font-face or remote font requests.

## Delivery validation

All CSS modules retain the current export names. CSS syntax was parsed locally
where available; brace balance, custom-property references, palette contrast pairs,
JS syntax of the optional capture utility, and ZIP hashes were checked.
These checks are NOT browser execution or a rendered visual review. The full React
build, current test suite, and screenshot capture must execute locally. No pass or
visual approval is claimed for unexecuted work.

## Evidence to push

Push the updated source and standard verification reports after the gate passes.
For visual feedback, attach the actual Home desktop/mobile, one interior desktop,
and Quote mobile screenshots. You do not need to publish every screenshot in GitHub.

## Rollback

Restore only the seven replaced style files from the previous commit and remove
the new capture/docs files if desired. No dependency reinstall or runtime rollback.
