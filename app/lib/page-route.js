import { site } from "../content/site.js";
import { getPageByPath, getRelatedPages } from "./content.js";

// Shared route data/metadata must not import a page or UI component.
export function loader({ request }) {
  const page = getPageByPath(new URL(request.url).pathname);
  if (!page) throw new Response("Not Found", { status: 404 });
  return { page, relatedPages: getRelatedPages(page) };
}

export function meta({ data }) {
  if (!data) return [{ title: "Page Not Found | Easy Code Checks" }];
  const { page } = data;
  const canonical = page.path === "/" ? site.url : `${site.url}${page.path}`;
  return [
    { title: page.seoTitle },
    { name: "description", content: page.description },
    { name: "robots", content: "noindex, nofollow" },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:title", content: page.seoTitle },
    { property: "og:description", content: page.description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonical },
  ];
}
