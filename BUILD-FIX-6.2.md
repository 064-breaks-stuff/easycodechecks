# Fix 6.2 — correct the no-JavaScript fieldset assertion

## Diagnosis

The supplied desktop log shows:
- 61 unit tests passing and a successful production build.
- All direct route/title/metadata tests passing after preview fix 6.1.
- Quote interaction tests passing.
- One browser failure, four expected viewport skips, 22 passes.

The remaining failing matcher is toBeDisabled() on the fieldset itself, despite
Playwright displaying the literal disabled attribute on that fieldset.

The fieldset should be checked for its disabled attribute/property; toBeDisabled
should check the actual input/select/textarea/button controls. A disabled fieldset
disables descendant controls except controls inside its first legend. The quote
fieldset's legend contains only text, not an enabled interactive exception.

This was an incorrect assertion in the test I supplied, not evidence from this log
that the no-JavaScript form is accepting input.

## Apply

Merge this ZIP into the project root. Replace the complete file:

- tests/e2e/fallbacks.spec.js

Keep all Batch 6 and fix 6.1 files installed. The two added files are these notes
and BUILD-FIX-6.2-MANIFEST.json, used by the existing layered integrity verifier.
No dependency installation, lockfile edit, application code change, or browser
reinstallation is required.

## What the replacement checks

The test still creates a context with javaScriptEnabled:false and now verifies:
1. The fieldset has the disabled attribute.
2. Its native disabled property is true.
3. It contains actual form controls (not an empty collection).
4. EVERY descendant input/select/textarea/button is disabled.
5. The preview button is disabled.
6. The direct contact link and noscript explanation remain available.

The fieldset property is inspected by Playwright's browser instrumentation; this
does not enable the page's application scripts in a JavaScript-disabled context.
No aria-disabled workaround, increased timeout, skip, or suppressed failure.
The WebGL and reduced-motion tests in this complete file remain unchanged.

## Run the focused check first

    npm run test:e2e -- --project=desktop --grep "without JavaScript"

If that passes, run all projects:

    npm run test:e2e

The runner still executes the full unit/build gate before browser tests. Only the
unfiltered second command verifies all configured projects; do not treat the focused
result as a mobile/reduced-motion pass.

## Repository status

Read-only GitHub check still shows f3bcc6f95e680fe4627d80ca8c27e0623de66954 (Batch 5).
This patch is based on the supplied Batch 6 code and the local desktop log. No new
GitHub changes or report uploads were assumed. No writes were made remotely.

## Verification performed here

- Native Node syntax check of the full replacement test.
- ZIP integrity and file hashes.
- Assertion changes cross-checked against Playwright's LocatorAssertions documentation
  and MDN fieldset disabled semantics.

Actual browser execution must be rerun locally. No passing result is fabricated.
The npm-audit finding remains a separate unresolved item until its JSON is reviewed.

After the full suite passes, push the batch/fixes and the verification reports,
including verification/browser-summary.json and the requested npm-audit JSON.
