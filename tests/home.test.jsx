import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import HomePage from "../app/routes/home.jsx";
import { homeServices, homeIndustries, homeResources } from "../app/content/home.js";
import { getPageByPath } from "../app/lib/content.js";

describe("homepage content", () => {
  it("resolves every service and industry to an existing route", () => {
    for (const item of [...homeServices, ...homeIndustries]) {
      expect(getPageByPath(item.href)).toBeDefined();
    }
  });
  it("links to articles on the existing company website", () => {
    for (const resource of homeResources) {
      const url = new URL(resource.href);
      expect(url.origin).toBe("https://www.easycodechecks.com");
      expect(url.pathname.startsWith("/post/")).toBe(true);
    }
  });
  it("renders useful HTML without browser APIs or a canvas", () => {
    const markup = renderToStaticMarkup(<MemoryRouter><HomePage /></MemoryRouter>);
    expect((markup.match(/<h1(?:\s|>)/g) ?? []).length).toBe(1);
    expect(markup).toContain("Sign Code Research");
    expect(markup).toContain("Request a Project Quote");
    expect(markup).toContain("Not a permit drawing");
    expect(markup).not.toContain("<canvas");
    expect(markup).not.toContain("Batch 1 foundation");
    expect(markup).not.toContain("12,844");
  });
});
