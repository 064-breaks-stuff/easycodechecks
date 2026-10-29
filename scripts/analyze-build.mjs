import path from "node:path";
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

export async function analyzeBuild(root) {
  const client = path.join(root, "build", "client");
  const assets = [];
  for (const file of await walk(path.join(client, "assets"))) {
    if (!/\.(js|css)$/.test(file)) continue;
    const content = await readFile(file);
    assets.push({
      file: path.relative(client, file).split(path.sep).join("/"),
      kind: file.endsWith(".js") ? "javascript" : "css",
      bytes: content.length,
      gzipBytes: gzipSync(content).length,
    });
  }
  assets.sort((a, b) => b.bytes - a.bytes);
  const report = {
    generatedAt: new Date().toISOString(),
    measurement: "Generated JS/CSS file sizes and Node gzip estimates; not browser timing, Brotli transfer, or first-load totals.",
    allGeneratedAssets: {
      count: assets.length,
      bytes: assets.reduce((sum, item) => sum + item.bytes, 0),
      gzipBytes: assets.reduce((sum, item) => sum + item.gzipBytes, 0),
    },
    referenceLargeChunkBytes: 500 * 1024,
    largeJavaScript: assets.filter((item) => item.kind === "javascript" && item.bytes > 500 * 1024),
    assets,
  };
  await mkdir(path.join(root, "verification"), { recursive: true });
  await writeFile(path.join(root, "verification", "build-assets.json"), `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const report = await analyzeBuild(root);
  console.log(`Measured ${report.assets.length} generated JS/CSS files; ${report.largeJavaScript.length} JS files exceed the 500 KiB reference. No warnings were suppressed.`);
}
