import { describe, expect, it } from "vitest";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { once } from "node:events";
import { createStaticPreview } from "../scripts/lib/static-preview.mjs";

describe("prerender-aware local HTTP serving", () => {
  it("serves each page's actual HTML on direct slashless and query URLs", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "ecc-preview-"));
    let server;
    try {
      await mkdir(path.join(root, "request-a-quote"));
      await mkdir(path.join(root, "assets"));
      await writeFile(path.join(root, "index.html"), "<h1>Home</h1>");
      await writeFile(path.join(root, "request-a-quote/index.html"), '<title>Quote</title><fieldset id="quote-ui-fields" disabled></fieldset>');
      await writeFile(path.join(root, "__spa-fallback.html"), "<div>SPA shell</div>");
      await writeFile(path.join(root, "request-a-quote.data"), "data payload");
      await writeFile(path.join(root, "assets/entry.js"), "export const ready=true;");
      server = await createStaticPreview({ directory: root, routePaths: ["/", "/request-a-quote"] });
      server.listen(0, "127.0.0.1"); await once(server, "listening");
      const origin = `http://127.0.0.1:${server.address().port}`;
      for (const route of ["/request-a-quote", "/request-a-quote/", "/request-a-quote?service=code-checks"]) {
        const response = await fetch(`${origin}${route}`);
        expect(response.status).toBe(200);
        expect(response.headers.get("x-preview-file")).toBe("request-a-quote/index.html");
        expect(await response.text()).toContain('id="quote-ui-fields"');
      }
      const data = await fetch(`${origin}/request-a-quote.data`);
      expect(data.headers.get("content-type")).toContain("text/x-script");
      expect(await data.text()).toBe("data payload");
      const missingAsset = await fetch(`${origin}/assets/missing.js`, { headers: { Accept: "text/html" } });
      expect(missingAsset.status).toBe(404);
      expect(await missingAsset.text()).not.toContain("Home");
      const missingPage = await fetch(`${origin}/missing-page`, { headers: { Accept: "text/html" } });
      expect(missingPage.status).toBe(404);
      expect(await missingPage.text()).toContain("SPA shell");
      const head = await fetch(`${origin}/request-a-quote`, { method: "HEAD" });
      expect(head.status).toBe(200); expect(await head.text()).toBe("");
      expect((await fetch(`${origin}/request-a-quote`, { method: "POST" })).status).toBe(405);
    } finally {
      if (server) { server.closeAllConnections?.(); await new Promise((resolve) => server.close(resolve)); }
      await rm(root, { recursive: true, force: true });
    }
  });
});
