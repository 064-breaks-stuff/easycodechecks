# Batch 2 — Responsive homepage layout

## Apply locally

1. Stop the development server.
2. Extract this ZIP to a temporary folder.
3. Copy its contents into your existing easycodechecks project root.
4. Merge the app/ and tests/ folders. Replace app/routes.js and vitest.config.js.
5. Do not delete the rest of your project. This is an overlay, not a standalone project.
6. Run the commands below from the project root.

    npm test
    npm run build
    npm run dev

No package.json changes or new dependencies are required. If node_modules is missing,
run npm ci first using the existing committed lockfile.

## Verified baseline

Prepared against the read-only GitHub snapshot:
75b3326259cc6dbf64906417b26ca165195a932c

Repository: 064-breaks-stuff/easycodechecks

The existing route manifest, root layout, company configuration, global CSS,
foundation page module, and package manifest were read before preparing this overlay.
No repository files, branches, settings, or workflows were changed remotely.

## Files replaced

- app/routes.js: only the home page now uses routes/home.jsx; other route IDs and paths stay intact.
- vitest.config.js: adds JSX test-file discovery while keeping the existing JS tests.

## Files added

- app/routes/home.jsx
- app/content/home.js
- app/components/home/Arrow.jsx
- app/components/home/SectionHeading.jsx
- app/components/home/SignIllustration.jsx
- app/components/home/SitePlan.jsx
- app/sections/home/HomeHero.jsx
- app/sections/home/ServicesOverview.jsx
- app/sections/home/ProjectPreparation.jsx
- app/sections/home/IndustriesOverview.jsx
- app/sections/home/ResearchOverview.jsx
- app/sections/home/CompanyOverview.jsx
- app/sections/home/ResourcesPreview.jsx
- app/sections/home/FinalCTA.jsx
- app/styles/home.module.css
- tests/home.test.jsx
- BATCH-2.md
- BATCH-2-MANIFEST.json

## Included homepage sections

1. Dark architectural hero with an authored SVG site illustration.
2. Company-at-a-glance strip using confirmed founding/location information.
3. Three service cards linked to existing service routes.
4. Four project-preparation prompts, not an asserted internal service workflow.
5. Four industry/project cards with authored concept illustrations.
6. Educational research-context board, explicitly not an actual client report.
7. Company introduction.
8. Three links to previously identified articles on the existing company website.
9. Quote CTA plus direct phone/email alternatives.

## Preserved foundation

- Root layout and global header/footer are unchanged.
- Existing content records and content-validation script are unchanged.
- All non-home pages retain the existing development scaffold.
- Existing loader and metadata are reused for the homepage.
- Development noindex metadata and robots restrictions remain in place.
- Static prerendering still uses the same content route registry.
- No package or lockfile edits.
- No backend, uploads, analytics, or external font/image requests.
- No automatic GitHub operations.

## Intentionally deferred

- Three.js scene and Anime.js choreography: next batch.
- Original company logo and approved photography: assets still required.
- Local font files: system fallbacks remain active.
- Approved case studies/testimonials: omitted rather than fabricated.
- Sample report: replaced with a clearly labeled educational illustration.
- Unconfirmed design services, municipality count, fees, timelines, guarantees.
- Quote submission: existing honest not-connected page remains.
- Final desktop dropdown behavior: unchanged foundation navigation remains.
- Individual article migration: homepage currently opens existing live articles
  in a new tab. Migrate those routes before switching the production domain.

## Test coverage added

- Service and industry links resolve through existing content utilities.
- Resource links target the established company article domain/path.
- Homepage can render to static HTML without WebGL or browser-only APIs.
- One H1 is rendered, the quote CTA is present, the site drawing is labeled,
  and the old foundation notice is absent from the homepage.

Tests are supplied, not claimed to have passed in the user's Node environment.
The delivery environment was used to inspect imports, archive integrity,
file hashes, and CSS brace balance. No browser/device rendering or npm build
was executed there.

## Local verification checklist

- npm test passes, including tests/home.test.jsx.
- npm run build succeeds and the homepage is prerendered.
- The homepage has no Batch 1 development panel.
- /services/code-checks, /banking, and /request-a-quote still work.
- All service and industry cards navigate to the expected pages.
- Hero and final quote CTAs navigate to the honest unconnected quote page.
- Resource links open the current website article in a new tab.
- Phone and email links point to the original company contact details.
- Inspect at 360px, 390px, 768px, 1024px, and 1440px widths.
- No horizontal page scrolling, clipped text, or overlapping buttons.
- Keyboard focus is visible on the dark hero and CTA.
- Existing mobile navigation still opens, traps focus, and closes with Escape.
- Unknown URLs still show the existing 404 page.
- Check the browser console for errors.

To inspect the production build locally:

    npm run preview

## Rollback

Use your local Git diff to review changes before committing. To roll back,
restore app/routes.js and vitest.config.js from the previous local commit and
remove only the new files listed above. Do not delete existing project folders.

## Next batch

Add the Three.js/R3F hero scene and Anime.js enhancement, preserving this
homepage's content, layout, route structure, and static illustration fallback.
