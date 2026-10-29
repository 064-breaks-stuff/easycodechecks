import { mkdir, writeFile } from "node:fs/promises";

import { pages } from "../app/content/pages.js";
import { site } from "../app/content/site.js";

const origin = new URL(
  process.env.SITE_URL || site.url,
).origin;

const outputDirectory = new URL(
  "../build/client/",
  import.meta.url,
);

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, (character) => {
    const entities = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };

    return entities[character];
  });
}

const urls = pages
  .map((page) => {
    const location = new URL(page.path, `${origin}/`).href;

    return `  <url><loc>${escapeXml(location)}</loc></url>`;
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const robots = `# Development foundation: do not index.
User-agent: *
Disallow: /
`;

await mkdir(outputDirectory, { recursive: true });

await Promise.all([
  writeFile(
    new URL("sitemap.xml", outputDirectory),
    sitemap,
    "utf8",
  ),
  writeFile(
    new URL("robots.txt", outputDirectory),
    robots,
    "utf8",
  ),
]);

console.log(
  `Generated sitemap for ${pages.length} routes and development robots.txt.`,
);