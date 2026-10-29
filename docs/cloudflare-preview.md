# Cloudflare Pages preview — prepared settings, not an executed deployment

No Cloudflare project, account binding, token, domain, DNS record, or GitHub
integration is created by these files. No deployment should run as part of testing.

## Build settings for a later manually approved preview

| Setting | Value |
| --- | --- |
| Build command | npm run build |
| Output directory | build/client |
| Project root | The root containing package.json |
| Node requirement | >=22.12.0; local verification currently uses 24.16.0 |
| Runtime server / Functions | None supplied |
| Secrets | None required for this UI-only preview |

If the platform's selected Node version is below the package engine requirement,
choose a supported compatible Node version before building. Do not guess an account
ID or create a wrangler configuration just to get a static upload.

Only build/client is the publish folder. Do not upload the repository, node_modules,
verification reports, tests, environment files, or any server build directory.

## Why 404.html is generated

Cloudflare Pages serves matching static HTML paths and recognizes a root 404.html.
Without that file, its default SPA behavior can serve the root page on unmatched
requests. Here the root page is a prerendered homepage, not the generic framework
SPA shell. Those are not interchangeable for hydration.

The post-build step copies the actual generated __spa-fallback.html to 404.html
byte-for-byte. It preserves framework context and script references rather than
fabricating another application document. Existing known prerendered pages stay intact.

There is deliberately no blanket /* -> /index.html rewrite and no catch-all Pages
Function. Native Pages static matching should serve the known pages; its 404 behavior
handles unknown paths. This must still be tested on the actual preview hostname.

## Headers and indexing

public/_headers is copied to build/client/_headers. Its global rule retains the
existing security headers and adds X-Robots-Tag: noindex, nofollow. Existing
fingerprinted-asset cache headers remain. The page metadata and robots.txt also keep
their existing development restrictions.

These are crawler directives, NOT authentication or confidentiality controls.
Preview content should contain nothing secret. Do not remove the no-index policy
or connect the live company domain without separate release approval.

_headers applies to Cloudflare static responses; the custom local preview server
does not emulate the Cloudflare header engine. The readiness report checks the
artifact configuration, not the platform's actual response headers.

## Target-host checks after a separately approved manual upload

- Test direct slashless and slash-ended URLs for all 14 pages.
- Check redirect destinations, hydration, title, canonical, and quote preselection.
- Check HTML .data and JS/CSS responses are not replaced by homepage HTML.
- Check an unknown URL returns HTTP 404 and the client not-found UI.
- Check a nonexistent asset returns a missing-resource response, not application HTML.
- Inspect X-Robots-Tag and security headers on the actual hostname.
- Confirm robots.txt retains Disallow: / and noindex metadata remains.
- Check the UI-only notice, no-JavaScript controls, and network absence of submissions.
- Check camera/scroll/reduced-motion behavior on a real target device.

Cloudflare may canonicalize HTML URLs differently from the local server. Local
success is not evidence that those platform redirects and headers already passed.

## Still deferred

Original branding/images, complete article migration, approved project proof, and
any future live quote backend/privacy configuration. A technically prepared preview
folder is not a completed production website or authorization for a domain cutover.
