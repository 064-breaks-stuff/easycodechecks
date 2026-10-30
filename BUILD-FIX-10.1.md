# Fix 10.1 — mobile header display cascade

The latest log has all 89 unit tests/build/prerender checks passing and three mobile
navigation failures. The desktop quote link is explicitly reported as intercepting
the Menu button. This is a stylesheet regression from Batch 10, not an environment
issue and not a reason to force-click or skip a check.

## Cause

The global .button display rule and the module .desktopQuote mobile display rule
had equal one-class specificity. A later global stylesheet could therefore restore
inline-flex and show the desktop CTA on mobile. The correction scopes all three
header display rules with .inner > .desktopQuote, .inner > .desktop and
.inner > .menuTrigger. These have two-class specificity and beat .button regardless
of chunk order. <=980px shows only mobile navigation; >=981px shows desktop controls.

No !important, z-index escalation, pointer-events workaround, forced clicks,
timeout increase or retries. All other premium navigation styling is unchanged.

## Apply

Keep Batch 10 installed. Merge the ZIP and replace the complete files:

- app/styles/navigation.module.css
- tests/e2e/navigation.spec.js

The other two files are these notes and BUILD-FIX-10.1-MANIFEST.json.
No install, dependency, lockfile, or application-JavaScript change.

## Verify once

    npm run test:e2e -- --workers=1 --retries=0

This rebuilds the corrected CSS and writes the standard complete reports. Do not
run the tests directly against stale build output from before this fix.

## Regression coverage

All existing click/Escape/focus/route/scroll-lock tests remain. Additional checks
require the desktop CTA to be hidden before mobile interactions and visible after
returning to desktop, with the Menu trigger hidden on desktop.

## Delivery checks

- Complete CSS parsed with tinycss2.
- Selector/cascade simulation using cssselect2 against a mock header.
- Original conflict reproduced at 390px with the global .button rule loaded last.
- Correct nav/CTA/menu display states at 320,390,768,980,981,1280,1440px in BOTH
  stylesheet orders (14 cases). Pseudo-elements are outside the element-display simulation.
- Replacement test file passed native Node syntax checking.
- ZIP and manifest hashes verified.

These are source/cascade checks, not a real browser run. The local gate must pass;
no browser pass is claimed here. GitHub main is still 2cb6bca at the read-only check.
This patch targets the Batch 10 source previously supplied and your local log.
No remote writes were made.
