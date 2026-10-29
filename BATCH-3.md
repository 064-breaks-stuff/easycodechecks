# Batch 3 — Three.js and Anime.js enhancement

## Apply locally

1. Stop your development server.
2. Extract this ZIP into a temporary directory.
3. Merge its contents into the existing project root, allowing the complete replacements listed below.
4. Run:

    npm install
    npm test
    npm run build
    npm run dev

Use npm install, not npm ci for this first application: package.json adds dependencies
and your existing lockfile must be updated locally. Commit package-lock.json with this batch.
No lockfile was generated or guessed in the delivery environment.

## Baseline inspected read-only

Repository: 064-breaks-stuff/easycodechecks
Commit: 54437c6dbecc3df7f9074097665b13324d9dec01

Read before packaging: the root listing, package.json, homepage route, hero component,
static site-plan component, existing homepage tests, and design tokens.
No remote GitHub writes, commits, pull requests, settings changes, or workflow runs.

## Complete replacements

- vitest.config.js: explicitly enables the automatic JSX runtime for JSX tests and imported baseline components.
- package.json: adds animejs, three, and @react-three/fiber; preserves existing scripts and allowScripts.
- app/routes/home.jsx: attaches lifecycle-managed homepage DOM motion.
- app/sections/home/HomeHero.jsx: inserts the progressive visual wrapper and hero animation markers.
- app/components/home/SitePlan.jsx: preserves the SVG, adds a fixed-aspect scene slot.

## New files

- app/components/home/HeroVisual.jsx
- app/hooks/useMediaQuery.js
- app/hooks/usePageVisibility.js
- app/hooks/useInView.js
- app/hooks/useHomeMotion.js
- app/lib/motion-config.js
- app/styles/scene.module.css
- app/three/SceneBoundary.jsx
- app/three/HeroCanvas.client.jsx
- app/three/HeroScene.jsx
- app/three/SiteModel.jsx
- app/three/scene-resources.js
- tests/motion.test.js
- tests/scene-resources.test.js
- BATCH-3.md
- BATCH-3-MANIFEST.json

## 3D behavior

The initial/prerendered HTML always contains the original SVG illustration.
On an eligible browser, the hero lazy-loads a React Three Fiber / Three.js scene.
There is no external model, texture, font, or image dependency.

The procedural scene contains a ground/site grid, building, canopy, wall sign,
monument sign, directional sign, and measurement guides. Building, signage,
and guides resolve in sequence. Pointer movement adds bounded parallax.
The scene is illustrative, not an actual project or permit drawing.

The SVG remains visible until the first scene frame has been requested and rendered.
A stable aspect-ratio stage prevents layout shifts from scene loading.

## Static fallback rules

Keep the SVG and do not load the 3D module when:

- viewport width is below 640 CSS pixels;
- the user requests reduced motion;
- navigator.connection.saveData is reported true;
- WebGL2 is unavailable or a major-performance-caveat context is rejected.

Use the SVG if module loading fails, scene rendering throws, or the WebGL context is lost.
No automatic retry loop is implemented; reload after fixing the environment to retry.
Changing width/reduced-motion preferences is handled live. Save-Data is sampled on mount.

## Performance and lifecycle

- The Three.js/R3F module is dynamically imported from a browser effect.
- The homepage HTML and CTAs never wait for the scene.
- The scene uses demand rendering rather than a permanent frame loop.
- Frames continue only for the intro or while pointer movement is settling.
- Offscreen/hidden-tab state stops scheduling scene animation frames.
- Device pixel ratio is capped at 1.5.
- Shared geometry and materials are explicitly disposed on scene teardown.
- No post-processing, real-time shadows, free orbit, scroll hijacking, or perpetual idle orbit.
- Leaving the homepage tears down its observers, motion scopes, and canvas.

## Anime.js behavior

- Anime.js is dynamically imported only when motion is permitted.
- Hero content receives a short staggered entrance.
- Section headings, linked cards, and list items reveal once as sections enter view.
- Normal CSS hover/focus states remain in place; no second interaction library.
- Each animation is constructed inside a scope and reverted on cleanup.
- Reveals skip targets containing active keyboard focus.
- Base CSS never hides the page in anticipation of animation.
- Switching to reduced motion reverts the active scopes.

The DOM and the Three.js scene own separate properties. Anime.js never writes
to the camera or scene objects; R3F never changes heading/button DOM transforms.

## Unchanged

All copy, routes, page metadata, header/footer, content registry, foundational tests,
non-home pages, development robots/noindex restrictions, and quote backend state.
No CMS, analytics, uploads, or business claims were added.
No changes to app/styles/home.module.css, app/routes.js, or the root layout.
No Drei dependency: the procedural scene does not require its helpers.

## Verification performed in the delivery environment

- ZIP integrity and file hashes.
- Relative import targets checked against delivered files and the inspected baseline.
- CSS brace balance.
- Node syntax checks for delivered plain JavaScript files.
- Node assertions for the dependency-free motion-math functions.

Not executed here:

- npm install, npm test, or the production React build.
- Browser rendering, real WebGL, visual regression, or device performance testing.

The full existing Vitest suite and the new tests must pass locally.
Do not treat static packaging checks as browser verification.

## Local checklist

1. npm install succeeds and updates package-lock.json.
2. npm test passes, including existing SSR/no-canvas homepage tests.
3. npm run build succeeds with prerendering still enabled.
4. On desktop with reduced motion OFF, the SVG transitions to an assembled 3D site.
5. Pointer movement gives a subtle response without intercepting scrolling.
6. After the intro/pointer settles, the scene is not continuously animating.
7. Scroll below the hero and switch browser tabs: the scene should not keep scheduling animation.
8. At 390px width, the original static SVG remains; normal content/CTAs work.
9. Enable prefers-reduced-motion: reduce in DevTools and reload: no 3D canvas or reveals.
10. Disable WebGL or simulate context loss: the static illustration remains/returns.
11. On a cold load with the 3D chunk blocked in DevTools Network, the SVG remains usable.
12. Navigate away and back: no duplicate observers, hidden headings, blank hero, or errors.
13. Verify mobile menu, direct service URLs, quote page, and 404 behavior remain intact.
14. Confirm there are no hydration warnings or console errors on the normal success path.
15. Test the production output with npm run preview as well as the dev server.

A warning is intentionally logged if an optional enhancement fails; this does not
turn a working static page into a failed form or navigation state.

## Rollback

Restore the five replacement files from your preceding local commit. Remove only the
new files listed above, then run npm install to resynchronize the local lockfile.
Do not delete project folders containing earlier batch files.

## Next batch

Interior service/industry/about/resource layouts and the finished shared navigation,
using the existing content and routing foundation. Production quote handling remains
a separate integration task requiring the approved storage/email configuration.
