import { site } from "../content/site.js";
import { getPageByPath, getRelatedPages } from "./content.js";
import { pageMetadata } from "./seo.js";

// Shared route data/metadata must not import a page or UI component.
export function loader({ request }) {
  const page = getPageByPath(new URL(request.url).pathname);
  if (!page) throw new Response("Not Found", { status: 404 });
  return { page, relatedPages: getRelatedPages(page) };
}

export function meta({ data }) {
  if (!data) return [{ title: "Page Not Found | Easy Code Checks" }];
  return pageMetadata(data.page, site);
}
