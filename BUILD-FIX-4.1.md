# Build fix 4.1 — static wildcard route and Windows verifier

## Apply

Stop the development server, merge this ZIP into the existing project root,
and allow replacement of:

- app/routes/not-found.jsx
- scripts/verify-project.mjs

New files:

- scripts/lib/npm-command.mjs
- tests/not-found.test.jsx
- tests/npm-command.test.js
- BUILD-FIX-4.1.md
- BUILD-FIX-4.1-MANIFEST.json

No package, lockfile, dependency, routing, or rendering-mode changes.
No installation is needed for this overlay.

Then run:

    node scripts/verify-project.mjs

The command includes both tests and the production build. If it succeeds:

    npm run dev

Review the 404 UI, normal pages, and homepage scene in the browser, then push
changes and the new verification/latest.json report.

## Confirmed blocker

Your supplied output shows 34 tests passed but the production build failed
React Router's ssr:false prerender export validation.

The wildcard route exported a server loader even though the wildcard route is
not matched by one of the configured prerender paths. A server loader is not
valid on that unprerendered fallback with this static configuration.

The earlier foundation also rendered null by default and depended on a thrown
loader response to select the ErrorBoundary. Removing only the loader would
therefore leave the wildcard page blank.

This fix removes the server loader AND renders the 404 content in the default
component. The optional ErrorBoundary reuses the same UI. The existing static
rendering strategy, valid page loaders, and prerender path list remain intact.

At deployment time, the host's fallback/404 routing must still be configured.
Client-rendered not-found UI does not by itself guarantee an HTTP 404 status.
That deployment policy is not changed by this patch.

## Windows warning

The previous verifier invoked npm.cmd with shell:true and an argument array,
which triggered Node's DEP0190 warning. The replacement resolves npm-cli.js
and runs it through process.execPath with shell:false on all platforms.
Paths with spaces remain individual arguments. No warning-suppression flag
is used.

If a nonstandard Node/npm installation cannot be discovered, the script fails
with an explicit NPM_CLI_PATH instruction instead of falling back to a shell.

## What this does NOT change

- React Router future flags: migration advisories are not this build failure.
- Large 3D chunk: the warning remains visible; no warning threshold is raised.
- React Router major version or runtime SSR mode.
- Homepage visuals, motion, forms, service content, or approved architecture.
- Production deployment/HTTP status behavior.

## Read-only repository check

The GitHub version of app/routes/not-found.jsx still contains the invalid loader.
The requested scripts/verify-project.mjs path was not yet present in the accessible
repository snapshot. Its full replacement is based on the complete Batch 4 script
supplied earlier and the local execution output you provided, not an invented
repository version. No GitHub writes were performed.

## Checks performed here

- Plain JS/MJS syntax checks with Node.
- Shell-free resolver and task validation assertions.
- Actual child-process execution through a temporary mock npm-cli.js located in
  a directory with spaces, checking argument boundaries and successful execution.
- Static confirmation that the 404 route has no loader export and a non-null
  default page component.
- ZIP integrity and manifest hashes.

These are not a Windows execution test or a full React build. Your complete
local test/build/prerender gate must pass before the next feature batch.

## Regression tests supplied

- Wildcard route has no loader, action, or headers export.
- Wildcard default component renders one H1 and a home link.
- npm CLI path with spaces is one argument.
- Unexpected verification task names are rejected.
- Missing npm CLI fails explicitly.

## Authoritative references used

React Router: Pre-Rendering, Invalid Exports.
Node.js: child_process, Windows .cmd execution and shell/args deprecation.
