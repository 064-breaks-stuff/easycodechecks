import { describe, expect, it } from "vitest";
import path from "node:path";
import { staticImportGraph } from "../scripts/lib/static-import-graph.mjs";
import { loader, meta } from "../app/lib/page-route.js";

// npm test runs from this project's root. These are filesystem paths, not assets.
const routeDirectory = path.resolve(process.cwd(), "app", "routes");
const formPackages = ["react-hook-form", "@hookform/resolvers/zod", "zod"];

describe("route payload boundaries", () => {
  for (const name of ["home", "page"]) {
    it(`${name} has no static quote-form dependency`, async () => {
      const graph = await staticImportGraph(path.join(routeDirectory, `${name}.jsx`));
      for (const dependency of formPackages) expect(graph.packages).not.toContain(dependency);
      expect(graph.files.some((file) => /[/\\]forms[/\\]/.test(file))).toBe(false);
    });
  }
  it("the dedicated quote route contains the form dependencies", async () => {
    const graph = await staticImportGraph(path.join(routeDirectory, "quote.jsx"));
    for (const dependency of formPackages) expect(graph.packages).toContain(dependency);
  });
  it("shared loader/meta preserve the page and canonical URL", () => {
    const data = loader({ request: new Request("https://preview.invalid/services/code-checks?example=1") });
    expect(data.page.id).toBe("code-checks");
    const descriptors = meta({ data });
    expect(descriptors).toContainEqual({ title: data.page.seoTitle });
    expect(descriptors).toContainEqual({ name: "robots", content: "noindex, nofollow" });
    expect(descriptors.find((item) => item.rel === "canonical")?.href).toBe("https://www.easycodechecks.com/services/code-checks");
  });
  it("shared loader retains unknown-route rejection", () => {
    let thrown;
    try { loader({ request: new Request("https://preview.invalid/unknown-page") }); }
    catch (error) { thrown = error; }
    expect(thrown).toBeInstanceOf(Response);
    expect(thrown.status).toBe(404);
  });
});
