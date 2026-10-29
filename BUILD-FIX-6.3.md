# Fix 6.3 — explicit prerendered fallback notice

## What the latest run established

The 6.2 test passed the fieldset attribute/property checks, all descendant-control
disabled checks, the preview-button disabled check, and the contact link check.
It then failed solely on the missing fallback-message lookup.

This is a separate message-rendering problem exposed after correcting the previous
matcher. It is not evidence that the form was enabled or that the routing fix regressed.
The exact intermediate noscript DOM in the built page has not been supplied, so
no claim is made about a specific browser/parser defect.

## Source correction, not another relaxed assertion

The form now renders its JavaScript/initialization notice as an ordinary paragraph:
- Server render: hydrated=false, so the paragraph is visible.
- First client render: hydrated=false, matching the server.
- After hydration: the existing effect sets hydrated=true, hiding the paragraph.
- Without JavaScript: no effect runs, so the paragraph remains visible and all fields
  remain disabled under the existing safeguards.

There is no noscript wrapper or unsafe HTML injection. No delayed timeout or test
assertion suppression is used. This removes the dependency on special noscript
rendering/lookup behavior instead of guessing why its text was unavailable.

## Apply

Keep Batch 6 and fixes 6.1/6.2 installed. Merge this ZIP into the project root.
Complete replacement:

- app/components/forms/QuoteForm.jsx

New files:

- app/components/forms/QuoteFallbackNotice.jsx
- tests/quote-fallback.test.jsx
- BUILD-FIX-6.3.md
- BUILD-FIX-6.3-MANIFEST.json

No dependency or lockfile changes; no npm install needed.
The full QuoteForm baseline was hash-matched to the previously inspected source
before changing only the notice import and notice render.

## Run once

    npm run test:e2e

Use the full suite now. Do not repeat the focused check and then rebuild a second
time. The existing runner already performs the full unit/build gate before browsers.

The existing no-JavaScript browser test is unchanged: it must find the message
visible, in addition to verifying every form control stays disabled.

## New regression checks

The supplied tests assert the notice is normal HTML without a hidden attribute
before hydration, has a hidden attribute after hydration, and is included in the
complete prerendered form alongside its disabled fieldset.

## Boundaries

No service copy, business scope, form fields, validators, submission behavior,
styles, preview server, routing, timeouts, or browser assertions were changed.
GitHub main remains f3bcc6f95e680fe4627d80ca8c27e0623de66954 at the read-only check;
this local patch targets the provided source and your latest terminal output.
No remote changes were made.

Delivery validation covers exact baseline reconstruction, isolated edit scope,
relative imports, ZIP integrity, and hashes. React/Vitest and the real browser
suite must run locally; they are not claimed to have passed here.

After the full run, push the code and reports. The separate npm audit finding
still needs its detailed JSON; it is not addressed by this notice correction.
