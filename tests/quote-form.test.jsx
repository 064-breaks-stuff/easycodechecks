import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import QuoteForm from "../app/components/forms/QuoteForm.jsx";
import QuoteReview from "../app/components/forms/QuoteReview.jsx";
import { createQuoteDefaults } from "../shared/quote-options.js";
import { quoteUi } from "../app/content/quote.js";

describe("UI-only quote form", () => {
  it("prerenders disabled controls, the preview notice, and no endpoint", () => {
    const html = renderToStaticMarkup(<MemoryRouter><QuoteForm /></MemoryRouter>);
    expect(html).toContain('data-ui-only="true"');
    expect(html).toContain('id="quote-ui-fields" disabled=""');
    expect(html).toContain("Online submission is not connected yet.");
    expect(html).toContain("Validate &amp; preview");
    expect(html).not.toMatch(/<form[^>]*action=/);
    expect(html).not.toContain('type="file"');
  });
  it("retains the confirmed contact address without connecting a sender", () => {
    expect(quoteUi.mode).toBe("preview-only");
    expect(quoteUi.notificationRecipient).toBe("support@easycodechecks.com");
  });
  it("labels a valid review as not sent and escapes user content", () => {
    const values = { ...createQuoteDefaults(), contactName: "<script>bad</script>", summary: "<b>example</b>" };
    const html = renderToStaticMarkup(<QuoteReview values={values} headingRef={null} />);
    expect(html).toContain("nothing has been sent.");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });
});
