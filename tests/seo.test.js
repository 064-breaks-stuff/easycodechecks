import { describe, expect, it } from "vitest";
import { pages } from "../app/content/pages.js";
import { site } from "../app/content/site.js";
import { canonicalUrl, breadcrumbItems, structuredData, pageMetadata } from "../app/lib/seo.js";

const serviceIds = new Set(["code-checks", "sign-permitting", "variances-appeals"]);

describe("deterministic metadata and structured data", () => {
  for (const page of pages) {
    it(`keeps existing metadata and valid graph references for ${page.path}`, () => {
      const descriptors = pageMetadata(page, site);
      expect(descriptors).toContainEqual({ title: page.seoTitle });
      expect(descriptors).toContainEqual({ name: "robots", content: "noindex, nofollow" });
      const graph = structuredData(page, site);
      expect(graph["@context"]).toBe("https://schema.org");
      const nodes = graph["@graph"];
      const ids = nodes.map((node) => node["@id"]);
      expect(new Set(ids).size).toBe(ids.length);
      expect(nodes.find((node) => node["@type"] === "WebPage")?.url).toBe(canonicalUrl(page, site));
      expect(nodes.filter((node) => node["@type"] === "Service")).toHaveLength(serviceIds.has(page.id) ? 1 : 0);
      const organization = nodes.find((node) => node["@type"] === "Organization");
      expect(organization.email).toBe(site.email);
      expect(organization.telephone).toBe(site.phone.display);
      expect(organization.sameAs).toEqual([site.linkedin]);
      expect(descriptors.find((item) => item["script:ld+json"])?.["script:ld+json"]).toEqual(graph);
      const breadcrumbs = breadcrumbItems(page, site);
      expect(breadcrumbs.map((item) => item.position)).toEqual(breadcrumbs.map((_, index) => index + 1));
    });
  }
  it("does not invent images, ratings, prices, coverage, dates, or live form actions", () => {
    const data = JSON.stringify(structuredData(pages.find((page) => page.id === "request-a-quote"), site));
    for (const property of ["aggregateRating", "review", "offers", "price", "logo", "image", "areaServed", "datePublished", "dateModified", "potentialAction"]) {
      expect(data).not.toContain(`"${property}"`);
    }
  });
  it("builds the same graph deterministically", () => {
    expect(structuredData(pages[0], site)).toEqual(structuredData(pages[0], site));
  });
  it("has no home breadcrumb and preserves existing root canonical formatting", () => {
    expect(breadcrumbItems(pages[0], site)).toEqual([]);
    expect(canonicalUrl(pages[0], site)).toBe(site.url);
  });
});
