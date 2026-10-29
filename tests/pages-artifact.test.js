import { describe, expect, it } from "vitest";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { preparePagesArtifact } from "../scripts/lib/pages-artifact.mjs";

async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), "ecc-pages-"));
  const output = path.join(root, "build", "client");
  await mkdir(path.join(output, "services"), { recursive: true });
  await writeFile(path.join(output, "index.html"), "<h1>Home</h1>");
  await writeFile(path.join(output, "services/index.html"), "<h1>Services</h1>");
  await writeFile(path.join(output, "__spa-fallback.html"), '<html><script type="module" src="/assets/entry.js"></script></html>');
  await writeFile(path.join(output, "_headers"), "/*\n  X-Robots-Tag: noindex, nofollow\n");
  await writeFile(path.join(output, "robots.txt"), "User-agent: *\nDisallow: /\n");
  await writeFile(path.join(output, "sitemap.xml"), "<urlset />");
  return { root, output };
}

describe("Cloudflare static preview preparation", () => {
  it("copies the framework shell exactly and records a local-only report", async () => {
    const { root, output } = await fixture();
    try {
      const report = await preparePagesArtifact(root, ["/", "/services"]);
      expect(await readFile(path.join(output, "404.html"), "utf8")).toBe(await readFile(path.join(output, "__spa-fallback.html"), "utf8"));
      expect(report.knownRoutes).toHaveLength(2);
      expect(report.deployed).toBe(false);
      expect(report.cloudflareRuntimeVerified).toBe(false);
    } finally { await rm(root, { recursive: true, force: true }); }
  });
  it("does not prepare a preview with missing crawler protection", async () => {
    const { root, output } = await fixture();
    try {
      await writeFile(path.join(output, "_headers"), "/*\n  X-Content-Type-Options: nosniff\n");
      await expect(preparePagesArtifact(root, ["/"])).rejects.toThrow("noindex");
    } finally { await rm(root, { recursive: true, force: true }); }
  });
  it("fails for a missing prerendered route", async () => {
    const { root } = await fixture();
    try {
      await expect(preparePagesArtifact(root, ["/missing-page"])).rejects.toThrow();
    } finally { await rm(root, { recursive: true, force: true }); }
  });
});
