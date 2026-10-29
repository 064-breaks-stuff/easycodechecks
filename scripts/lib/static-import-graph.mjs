import path from "node:path";
import { readFile } from "node:fs/promises";

// Lightweight graph for this project's explicit static imports/re-exports.
// Dynamic imports are intentionally excluded; this is not a general JS parser.
export async function staticImportGraph(entry) {
  const files = new Set();
  const packages = new Set();
  async function visit(file) {
    file = path.resolve(file);
    if (files.has(file) || !/\.[cm]?jsx?$/.test(file)) return;
    files.add(file);
    const source = await readFile(file, "utf8");
    const expression = /(?:^|\n)\s*(?:import|export)\s+(?!\()[^;]*?\bfrom\s*["']([^"']+)["']/g;
    for (const match of source.matchAll(expression)) {
      const target = match[1];
      if (target.startsWith(".")) await visit(path.resolve(path.dirname(file), target));
      else packages.add(target);
    }
  }
  await visit(entry);
  return { files: [...files], packages: [...packages] };
}
