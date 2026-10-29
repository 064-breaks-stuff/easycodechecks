import { describe, expect, it } from "vitest";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { analyzeBuild } from "../scripts/analyze-build.mjs";

describe("build asset inventory", () => {
  it("measures actual files and retains the large-chunk reference", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "ecc-assets-"));
    try {
      const assets = path.join(root, "build", "client", "assets");
      await mkdir(assets, { recursive: true });
      await writeFile(path.join(assets, "entry.js"), "export const ready = true;");
      await writeFile(path.join(assets, "scene.js"), "x".repeat(512001));
      await writeFile(path.join(assets, "site.css"), "body { margin: 0; }");
      const report = await analyzeBuild(root);
      expect(report.assets).toHaveLength(3);
      expect(report.largeJavaScript[0].file).toBe("assets/scene.js");
      expect(report.largeJavaScript[0].bytes).toBe(512001);
      expect(report.largeJavaScript[0].gzipBytes).toBeLessThan(512001);
      expect(report.measurement).toContain("not browser timing");
    } finally { await rm(root, { recursive: true, force: true }); }
  });
});
