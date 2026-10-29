# Easy Code Checks

React marketing website foundation.

## Stack

- JavaScript / JSX
- React
- Vite
- React Router framework mode
- Build-time prerendering
- Plain CSS design tokens
- Vitest

Three.js, React Three Fiber, and Anime.js will be added when their
implementation batch begins.

## Requirements

Node.js 22.12 or later.

## Install

npm install

Commit package-lock.json after installation.

## Development

npm run dev

Default local URL:

http://localhost:5173

## Validation

npm run validate:content

## Tests

npm test

## Production build

npm run build

Static output:

build/client

## Local production preview

npm run preview

## Content

app/content/site.js contains company information and navigation.

app/content/pages.js contains the initial route registry.

app/lib/content.js provides content lookup and validation.

## Foundation limitations

- Page layouts are temporary development scaffolds.
- The text wordmark is not the approved company logo.
- No quote form submission service is connected.
- No documents are uploaded or stored.
- No analytics is installed.
- No 3D scene or animation library is initialized.
- No unapproved testimonials or client logos are included.
- Design services and Master Sign Programs remain unpublished.
- Privacy content requires actual processing details and approval.
- Development pages use noindex and robots.txt blocks crawling.

## Deployment

The intended deployment target is Cloudflare Pages.

Build command:

npm run build

Output directory:

build/client

Do not point the production domain at this foundation.

Review routing, security headers, forms, content, redirects, and
indexing rules before production deployment.

## Repository workflow

Development takes place locally.

GitHub access by the assistant is restricted to read-only progress
monitoring. No assistant commits, pull requests, or remote changes
are authorized.
