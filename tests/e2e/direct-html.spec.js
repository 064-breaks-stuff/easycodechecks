import { test, expect } from "./fixtures.js";
import { pages } from "../../app/content/pages.js";

test("direct HTTP responses contain the requested page before JavaScript", async ({ request }) => {
  for (const record of pages) {
    const response = await request.get(record.path);
    expect(response.status(), record.path).toBe(200);
    const html = await response.text();
    expect(html, record.path).toContain("<h1");
    const title = record.seoTitle.replaceAll("&", "&amp;");
    expect(html, record.path).toContain(`<title>${title}</title>`);
    expect(response.headers()["x-preview-file"]).toBe(record.path === "/" ? "index.html" : `${record.path.slice(1)}/index.html`);
  }
  const quote = await request.get("/request-a-quote?industry=banking");
  expect(await quote.text()).toContain('id="quote-ui-fields"');
});
