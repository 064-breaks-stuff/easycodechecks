# Presentation correction — Batch 11

## Apply

Baseline checked read-only: 7b8f82befb38a4309b952ad377fcbcdbf6527015.
Merge this ZIP into the existing project root. All files are complete replacements
or complete new files. Do not replace entire folders. No npm install is required.
No dependencies, lockfile, navigation stylesheet, routing manifest or hosting changes.

Run once:

    npm run test:e2e -- --workers=1 --retries=0

This uses the existing pipeline and assertions, not a new test suite or a skipped gate.

## Actual corrections

- Homepage: one service-led headline instead of repeated clarity slogans/labels.
- Services: three differentiated editorial rows instead of three similar building cards.
- Industries: compact directory; small conceptual art on desktop, text-first mobile.
- Removes the duplicated project-input section from the homepage; those questions
  remain on contact/quote pages. Research explanation remains as the single explanatory sequence.
- Combines company approach and resources into a compact two-column editorial section.
- Keeps the existing company facts strip, research board and final conversion section.
- General interior pages: shorter hero, more focused heading measure, tighter reading rhythm.
- Quote: shorter header, simpler honest notice, less nested mobile padding, fewer
  repeated development caveats. All fields, acknowledgment and not-sent review remain.

## Files replaced

- app/routes/home.jsx
- app/sections/home/HomeHero.jsx
- app/routes/page.jsx
- app/components/forms/QuotePageView.jsx
- app/components/forms/QuoteForm.jsx
- app/components/forms/QuotePageBody.jsx
- app/content/quote.js

New:

- app/sections/home/PresentationSections.jsx
- app/styles/presentation.module.css
- BATCH-11.md
- BATCH-11-MANIFEST.json

## Preserved

All 14 paths, route IDs, loader/meta exports, JSON-LD, canonical tags, noindex policy,
service facts and links. Existing hero scene/fallback, Anime.js scope cleanup and
reduced-motion behavior. No live form submission or storage. No new logo, client
proof, pricing, guarantees, images or font requests.

The complete QuoteForm was reconstructed and SHA-256 matched to the repository
before editing only its outer data attribute and removing one redundant note.
Its hooks, validation, defaults, focus behavior, handlers, fields, disabled fieldset,
preview acknowledgment and not-sent result are unchanged. The required offline notice
title, Validate & preview label and field IDs remain for existing QA assertions.

The mobile-header fix is untouched. The new stylesheet is scoped to new presentation
components/wrappers; it does not alter header display or pointer hit testing.

## Review

After the gate passes:

    node scripts/capture-design.mjs

Open test-results/premium-review/index.html for current desktop/mobile views.
The capture utility is unchanged and uses reduced motion; it is not proof of GPU
animation quality. Inspect the ordinary homepage in the browser for actual 3D motion.

## Delivery checks and limits

Relative imports and CSS references checked; CSS parsed with tinycss2; delivered
plain JS syntax checked with Node; archive hashes verified. Existing QuoteForm
behavioral prefix confirmed unchanged. JSX/browser rendering and the real React
build were NOT executed here. The local gate is required; no passing outcome or
visual approval is fabricated. No GitHub write was made.

Push the updated source and standard verification reports after the full gate passes.
Rollback means restoring the seven replaced files from the previous commit and
removing only the new files above; no installation needed.
