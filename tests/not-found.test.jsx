import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import * as route from "../app/routes/not-found.jsx";

 describe("static wildcard fallback", () => {
  it("does not export server-only handlers", () => {
    expect(route).not.toHaveProperty("loader");
    expect(route).not.toHaveProperty("action");
    expect(route).not.toHaveProperty("headers");
  });
  it("renders its 404 UI as the default component", () => {
    const Page = route.default;
    const html = renderToStaticMarkup(<MemoryRouter><Page /></MemoryRouter>);
    expect(html).toContain("That page is not here.");
    expect((html.match(/<h1(?:\s|>)/g) ?? []).length).toBe(1);
    expect(html).toContain('href="/"');
  });
});
