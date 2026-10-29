# Batch 4 — Interior pages, shared navigation, and verification gate

## Apply locally

1. Stop the development server.
2. Extract this ZIP into a temporary folder.
3. Merge its contents into the existing project root, replacing the two files listed below.
4. If dependencies are already installed from Batch 3, no new installation is needed.
5. Run:

    node scripts/verify-project.mjs
    npm run dev

The verification command runs npm test and npm run build, checks the prerendered
HTML and internal links, and writes verification/latest.json. It exits nonzero
if any automated check fails. Do not proceed to the next batch with a failed report.

If node_modules is missing, run npm ci first using your existing lockfile.
Do not replace the entire project folder: this is an overlay.

## Source verification before this batch

Read-only repository: 064-breaks-stuff/easycodechecks
Baseline commit: 81b82ee4dcd23129b66dcc6d85231da0ed55b070 (step 3)

Reviewed the complete Batch 3 commit patch, including all new motion/3D files,
package manifest changes, lockfile additions, JSX test configuration, and tests.
Also read the current shared header, generic route module, route configuration,
page registry, and content utility module.

Findings:
- All expected Batch 3 implementation files appear in the commit.
- package-lock.json includes the added dependencies and matching root declarations.
- The lockfile diff resolves R3F 9.8.2, Anime.js 4.5.0, and Three.js 0.180.0.
- Browser-only scene initialization remains behind a browser effect/dynamic import.
- The static SVG, reduced-motion checks, scope cleanup, and demand-loop gates are present.
- Existing static-render tests remain present; new motion/resource tests are included.
- No source-level blocker identified in that review.

This is a source review, NOT proof that the user's npm tests, production build,
WebGL rendering, or browser interactions passed. No test-result artifact had been
provided in the inspected commit. The new local gate supplies that evidence.
No GitHub writes or workflow execution were performed.

## Files replaced in this batch

- app/routes/page.jsx: replaces the Batch 1 placeholder body, preserves loader/meta exports.
- app/components/SiteHeader.jsx: completes responsive shared navigation.

## Added files

- app/content/interior.js
- app/lib/navigation.js
- app/components/interior/Breadcrumbs.jsx
- app/components/interior/PageHero.jsx
- app/components/interior/RelatedPages.jsx
- app/components/interior/FAQList.jsx
- app/components/interior/InteriorView.jsx
- app/styles/interior.module.css
- app/styles/navigation.module.css
- scripts/verify-project.mjs
- tests/interior.test.jsx
- BATCH-4.md
- BATCH-4-MANIFEST.json

## Interior pages

- /services: service overview.
- /services/code-checks: code-check detail, starting information, FAQ.
- /services/sign-permitting: permanent/promotional/event scope and FAQ.
- /services/variances-appeals: assistance scope and explicit approval limitation.
- /industries: four established project categories.
- /drive-thru, /building-signs, /banking, /subdivision: distinct project content and FAQs.
- /about: founding/location, published services, company values.
- /blog: resource index linking to the three previously identified original articles.
- /contact: direct email/telephone/location and useful project information.
- /request-a-quote: polished, honest offline inquiry state with direct contact options.

The quote page is NOT a working online form. No submission, fake success, data
storage, uploads, or mail sending is implemented. Direct email links open the
visitor's own email application. Query parameters only select a validated service/
industry interest and include its label in the email subject.

No new business claims, prices, turnaround promises, engineering credentials,
approval guarantees, staff biographies, testimonials, or client logos were invented.
Scope exclusions are expressed as things to confirm, not assertions that a service
is unavailable. Company value descriptions are editorial expressions of the existing
published values, not quantified performance claims.

## Navigation

- Native desktop disclosures with overview links and individual service/industry links.
- Only one desktop disclosure stays open at once.
- Escape closes a disclosure and returns focus to its summary.
- Outside pointer interaction closes desktop disclosures.
- Mobile retains a native modal dialog and accessible labels.
- Navigation closes on route changes and desktop/mobile breakpoint changes.
- Focus returns to main content after route navigation rather than a hidden menu trigger.
- Legacy industry paths correctly highlight the Industries group.
- Sticky header uses the existing header-height token and adds no scroll library.

## Automated local verification

Run node scripts/verify-project.mjs from the project root.

The report includes:
- Checked-out commit and execution timestamp.
- Package/lockfile root dependency declaration consistency.
- Batch 3 delivered-file integrity (normalizes Windows CRLF to LF).
- Relative import existence and no authored TypeScript under app/.
- Hashes of the actual local app sources.
- npm test and npm run build outcomes with output tails.
- Per-route prerendered HTML presence, one H1, and development noindex metadata.
- Internal-link destinations in built HTML.
- Homepage static fallback present without a prerendered canvas.
- Quote page honest offline state without a form.

If you intentionally edited a Batch 3 file, its old manifest check will flag it.
Review that change rather than discarding it automatically. The report does not
claim a browser test, security audit, or proof of form delivery.

Push verification/latest.json with the completed batch so the next read-only review
can inspect actual local results. The report includes test/build output tails and
app-file hashes. Review it before committing if your local tooling prints secrets.

## Checks performed while packaging

- Static review of the actual pushed baseline described above.
- Plain JavaScript / MJS syntax checks using Node.
- Delivery-file relative imports against the inspected baseline.
- CSS brace balance.
- Node assertions for navigation matching and quote-context validation.
- ZIP integrity and manifest hashes.

Full project installation, Vitest, React build, browser rendering, and WebGL tests
must run locally. No passing status is claimed for those in this delivery.

## Manual browser checks after the automated gate

- Homepage visuals and animations are unchanged.
- Desktop Services and Industries disclosures open by keyboard/click.
- Escape closes a disclosure; outside click closes it.
- /banking highlights Industries.
- Mobile menu traps focus, closes with Escape, and restores scroll.
- Navigating from the mobile menu focuses main content.
- Resizing an open mobile menu to desktop does not leave a scroll lock.
- Each service/industry page has distinct content, breadcrumbs, and working FAQ disclosure.
- Service CTA carries ?service=...; industry CTA carries ?industry=....
- Unknown query values are ignored.
- Email/phone links use the verified company details.
- Blog cards open the existing source articles in a new tab.
- All layouts are readable at 360, 390, 768, 1024, and 1440 CSS pixels.
- Unknown URLs retain the existing 404 page.
- No hydration warnings or unexpected console errors.

## Still blocked on real resources/configuration

- Individual article migration needs full original article content/assets.
- Original company logo/photography need approved source files.
- Case studies/testimonials need approvals.
- Working quote submission needs storage, email, and abuse-protection configuration.
- Privacy wording depends on the actual data-processing setup.
- Production domain cutover must wait for article migration and launch checks.

## Rollback

Restore only app/routes/page.jsx and app/components/SiteHeader.jsx from your preceding
local commit and remove the new Batch 4 files. No dependency/lockfile rollback needed.
