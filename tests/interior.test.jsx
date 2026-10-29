import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import InteriorView from "../app/components/interior/InteriorView.jsx";
import SiteHeader from "../app/components/SiteHeader.jsx";
import { pages } from "../app/content/pages.js";
import { getPageByPath, getRelatedPages } from "../app/lib/content.js";
import { getInteriorDetail, getQuoteContext, quoteHref } from "../app/content/interior.js";
import { navigationMatches } from "../app/lib/navigation.js";
import { navigation } from "../app/content/site.js";

function renderPage(page, query = "") {
  return renderToStaticMarkup(<MemoryRouter initialEntries={[`${page.path}${query}`]}><InteriorView page={page} relatedPages={getRelatedPages(page)} /></MemoryRouter>);
}

describe("interior pages", () => {
  for (const page of pages.filter((record) => record.id !== "home")) {
    it(`renders one H1 and real content for ${page.path}`, () => {
      const html = renderPage(page);
      expect((html.match(/<h1(?:\s|>)/g) ?? []).length).toBe(1);
      expect(html).not.toContain("Batch 1 foundation");
      expect(html).not.toContain("Structure before motion.");
      expect(html).not.toContain("<canvas");
    });
  }
  it("covers all established service and industry detail pages", () => {
    const ids = ["code-checks", "sign-permitting", "variances-appeals", "drive-thru", "building-signs", "banking", "subdivision"];
    for (const id of ids) expect(getInteriorDetail(id)?.groups.length).toBeGreaterThan(0);
  });
  it("preserves the quote service context", () => {
    const page = getPageByPath("/services/code-checks");
    expect(quoteHref(page)).toBe("/request-a-quote?service=code-checks");
    expect(getQuoteContext("service=code-checks").service?.id).toBe("code-checks");
  });
  it("rejects unknown query values rather than displaying arbitrary text", () => {
    const context = getQuoteContext("service=unknown&industry=%3Cscript%3E");
    expect(context.service).toBeNull();
    expect(context.industry).toBeNull();
  });
  it("retains the honest UI-only quote state", () => {
    const html = renderPage(getPageByPath("/request-a-quote"), "?industry=banking");
    expect(html).toContain("Online submission is not connected yet.");
    expect(html).toContain('data-ui-only="true"');
    expect(html).toContain("Validate &amp; preview");
    expect(html).toContain('id="quote-ui-fields" disabled=""');
    expect(html).not.toMatch(/<form[^>]*action=/);
  });
  it("highlights legacy industry routes under Industries", () => {
    const industries = navigation.find((item) => item.href === "/industries");
    expect(navigationMatches("/banking", industries)).toBe(true);
    expect(navigationMatches("/about", industries)).toBe(false);
  });
  it("renders accessible navigation disclosures without browser effects", () => {
    const html = renderToStaticMarkup(<MemoryRouter><SiteHeader /></MemoryRouter>);
    expect(html).toContain("<summary");
    expect(html).toContain('aria-label="Primary navigation"');
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain("Services overview");
  });
});
