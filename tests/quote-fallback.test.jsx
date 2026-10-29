import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import QuoteFallbackNotice from "../app/components/forms/QuoteFallbackNotice.jsx";
import QuoteForm from "../app/components/forms/QuoteForm.jsx";

describe("explicit prerendered quote fallback", () => {
  it("is ordinary visible HTML before hydration", () => {
    const html = renderToStaticMarkup(<QuoteFallbackNotice hydrated={false} />);
    expect(html).toContain('<p id="quote-initialization-notice"');
    expect(html).toContain("This local preview requires JavaScript.");
    expect(html).not.toContain("<noscript");
    expect(html).not.toMatch(/<p[^>]*\bhidden(?:=|\s|>)/);
  });
  it("is hidden only after hydration", () => {
    const html = renderToStaticMarkup(<QuoteFallbackNotice hydrated />);
    expect(html).toContain('hidden=""');
  });
  it("is included outside noscript in the complete form HTML", () => {
    const html = renderToStaticMarkup(<MemoryRouter><QuoteForm /></MemoryRouter>);
    expect(html).toContain('id="quote-initialization-notice"');
    expect(html).not.toContain("<noscript");
    expect(html).toContain('id="quote-ui-fields" disabled=""');
  });
});
