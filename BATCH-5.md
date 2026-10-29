# Batch 5 — UI-only quote form

## Approved scope

- UI only.
- Lead storage: not selected, not implemented.
- Email provider: not selected, not implemented.
- Confirmed future notification/contact recipient: support@easycodechecks.com.
- No file uploads, external form service, request endpoint, or fake submission.

## Baseline verification

Read-only repository baseline: fe6f3bf70443f775c08302f29724f2a600be2ba9.
The committed report previously reviewed at this baseline passed 39 tests, the
production build, and prerender/internal-link checks for 14 pages.
The same commit is still main at preparation time. The current package manifest,
quote/contact view, verifier, and interior tests were read before constructing
this overlay. The complete old InteriorView was hash-matched before adding its
quote-page integration. No GitHub writes or workflow actions were performed.

This confirms the earlier baseline, not the new code's runtime status.
Run the local gate below for the new batch.

## Install locally

1. Stop the development server.
2. Extract the ZIP into a temporary directory.
3. Merge the contents into the existing project root, allowing complete replacements.
4. Run:

    npm install
    node scripts/verify-project.mjs
    npm run dev

Use npm install for this application because the approved form libraries are now
added. It must update package-lock.json. No lockfile was fabricated in the delivery
environment. Commit the actual locally updated lockfile with this batch.

## Libraries added

- react-hook-form
- @hookform/resolvers
- zod

These implement the React Hook Form / Zod layer in the approved architecture.
No animation, router, hosting, storage, or email-provider changes.

## Complete replacements

- package.json
- app/components/interior/InteriorView.jsx
- scripts/verify-project.mjs
- tests/interior.test.jsx

## New source files

- shared/quote-options.js
- shared/quote-schema.js
- app/content/quote.js
- app/components/forms/FormField.jsx
- app/components/forms/QuoteForm.jsx
- app/components/forms/QuoteReview.jsx
- app/components/forms/QuotePageBody.jsx
- app/styles/quote.module.css
- scripts/lib/manifest-integrity.mjs
- tests/quote-schema.test.js
- tests/quote-form.test.jsx
- tests/manifest-integrity.test.js
- BATCH-5.md
- BATCH-5-MANIFEST.json

## User experience

The form appears only on /request-a-quote.
The ordinary /contact page and all homepage/service/industry layouts remain intact.

- Required: name, company, email, service, country, state/region, city, summary,
  and acknowledgment that this is a local preview.
- Optional: phone, project type, project address, location count, target date.
- Query service/industry selections are accepted only from known options.
- Personal fields are not reset by URL context updates.
- Manually edited service/industry selections are not silently overwritten by queries.
- Country is free text; no new geographic-coverage claim or country restriction.
- Validation trims text, checks email, enumerated choices, dates, counts, and lengths.
- The button is labeled Validate & preview, not Send or Submit request.
- A valid draft produces Preview ready — nothing has been sent.
- Error summary links focus the corresponding fields; review heading receives focus.
- Editing invalidates a displayed preview.
- Reset clears personal entries and restores only current validated query context.

## Data handling boundaries

Form values stay in the current React component's memory. No API request, email,
database write, browser-storage API, analytics event, log, URL serialization, or
file upload is made with those values. User-entered text is rendered as React text,
not injected as HTML. Direct contact links do not copy the draft into an email.
Browser autofill remains the browser's own behavior, not site persistence.

The form's initial/prerendered fieldset is disabled. JavaScript enables it only
after hydration, so the preview does not fall back to a native form submission
when JavaScript is unavailable. No form action endpoint is configured.

The acknowledgment is explicitly preview-only. It is NOT an invented privacy policy,
marketing consent, or production data-processing approval. Live submission and the
correct privacy language need a separate approved integration.

The confirmed email address is configuration for display/future integration only.
No notification sender is connected or tested.

## Validation limits

These are technical UI bounds, not business promises:

- Name: 100 characters; company: 160; email: 254; phone: 50.
- Country/state/city: 100 each; project address: 300.
- Location count: optional positive integer, up to six digits.
- Target date: optional real ISO calendar date, without assuming future-only timing.
- Project summary: 2,000 characters.

The shared project schema excludes preview acknowledgment. A future production
endpoint can reuse the project-field validation but must add its own actual
privacy/consent and abuse-protection rules.

## Updated integrity verification

The old verifier compared package.json to its Batch 3 hash forever. That would
incorrectly reject this approved dependency change. The new integrity helper reads
all BATCH-N-MANIFEST.json and BUILD-FIX-N.M-MANIFEST.json files in numerical order.
Each file is verified against its newest delivered hash; unchanged files still
retain their older expected hashes. It does not simply skip package.json.
Windows CRLF is normalized before text comparisons.

The script retains the shell-free Windows npm launcher from fix 4.1.
It now checks the honest preview form rather than requiring the absence of all forms.
It also hashes/checks the shared source folder.

## Local automated checks

Run node scripts/verify-project.mjs after npm install.
It must pass tests, production build, all existing prerender/link checks, and the
new preview-form and active-manifest checks. Push verification/latest.json so the
next review can inspect actual results.

## Manual browser checks

1. Open /request-a-quote directly and from a service CTA.
2. Submit the empty preview: an error summary and field errors appear, nothing is sent.
3. Follow error-summary links and verify focus moves to the named field.
4. Complete the required fields with test data; validate and inspect the local review.
5. Confirm the review says nothing has been sent, not request received.
6. Edit a field: the old review disappears until revalidated.
7. Reset: personal fields clear, valid query defaults return.
8. Open ?service=code-checks&industry=banking and inspect preselection.
9. Unknown query values are ignored.
10. Refresh/leave the route: no site-managed saved draft is restored; browser autofill/page restoration may behave independently.
11. Inspect DevTools Network while validating: no inquiry POST or delivery request.
12. Disable JavaScript and reload: form fields stay disabled, contact links remain.
13. Confirm no uploads, storage service, email sender, or tracking was added.
14. Inspect 360px, 390px, 768px, and desktop layouts and keyboard navigation.
15. Rerun homepage/3D/reduced-motion smoke checks; those files are unchanged.

## Verification performed while packaging

- Node syntax checks for delivered JS/MJS.
- Native Node assertions for defaults/date/context option helpers.
- Actual temporary-file test for layered-manifest supersession and tamper detection.
- Relative import targets and CSS-module class references.
- Full baseline replacement hash checks before applying the integration edits.
- ZIP integrity and manifest hashes.

Not executed here: npm install, Zod/RHF/Vitest runtime, full React build,
browser interaction, or WebGL rendering. The local gate must provide that evidence.

## Rollback

Restore the four replacements from your preceding commit, remove only the listed
new files, and run npm install to align the local lockfile with the restored manifest.
No repository operations are performed by this overlay.

## Remaining launch requirements

Live form delivery, lead storage, email provider, spam prevention, production privacy
wording, logo/photography assets, complete article migration, and deployment checks
remain separate. This UI-only batch does not make the site production-ready.
