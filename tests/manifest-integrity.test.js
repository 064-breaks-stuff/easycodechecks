import { describe, expect, it } from "vitest";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { manifestVersion, verifyManifestIntegrity } from "../scripts/lib/manifest-integrity.mjs";
const hash = (text) => createHash("sha256").update(text).digest("hex");

describe("layered delivery manifests", () => {
  it("orders fixes between their base batch and the next batch", () => {
    expect(manifestVersion("BUILD-FIX-4.1-MANIFEST.json")).toEqual([4, 1]);
    expect(manifestVersion("BATCH-5-MANIFEST.json")).toEqual([5, 0]);
  });
  it("checks the newest approved file hash instead of an obsolete baseline", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "ecc-manifests-"));
    try {
      await writeFile(path.join(root, "package.json"), "new\r\n");
      await writeFile(path.join(root, "BATCH-3-MANIFEST.json"), JSON.stringify({ files: [{ path: "package.json", sha256: hash("old\n") }] }));
      await writeFile(path.join(root, "BATCH-5-MANIFEST.json"), JSON.stringify({ files: [{ path: "package.json", sha256: hash("new\n") }] }));
      expect((await verifyManifestIntegrity(root)).passed).toBe(true);
      await writeFile(path.join(root, "package.json"), "changed\n");
      expect((await verifyManifestIntegrity(root)).passed).toBe(false);
    } finally { await rm(root, { recursive: true, force: true }); }
  });
});
