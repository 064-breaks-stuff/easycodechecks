import path from "node:path";
import { readdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

export function manifestVersion(name) {
  const batch = /^BATCH-(\d+)-MANIFEST\.json$/.exec(name);
  if (batch) return [Number(batch[1]), 0];
  const fix = /^BUILD-FIX-(\d+)\.(\d+)-MANIFEST\.json$/.exec(name);
  return fix ? [Number(fix[1]), Number(fix[2])] : null;
}

export async function verifyManifestIntegrity(root) {
  const names = (await readdir(root)).filter((name) => manifestVersion(name));
  names.sort((a, b) => {
    const av = manifestVersion(a), bv = manifestVersion(b);
    return av[0] - bv[0] || av[1] - bv[1];
  });
  const expected = new Map();
  const issues = [];
  for (const name of names) {
    const manifest = JSON.parse(await readFile(path.join(root, name), "utf8"));
    for (const entry of manifest.files ?? []) {
      const full = path.resolve(root, entry.path);
      const relative = path.relative(root, full);
      if (relative.startsWith("..") || path.isAbsolute(relative)) {
        issues.push(`unsafe path in ${name}: ${entry.path}`);
        continue;
      }
      expected.set(entry.path, { ...entry, manifest: name });
    }
  }
  if (!names.length) issues.push("No delivered batch manifests found.");
  for (const [file, entry] of expected) {
    try {
      const text = (await readFile(path.join(root, file), "utf8")).replace(/\r\n/g, "\n");
      const hash = createHash("sha256").update(text).digest("hex");
      if (hash !== entry.sha256) issues.push(`${file} differs from ${entry.manifest}`);
    } catch { issues.push(`missing: ${file}`); }
  }
  return { passed: issues.length === 0, checkedFiles: expected.size, manifests: names, issues };
}
