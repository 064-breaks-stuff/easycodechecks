import { spawnSync } from "node:child_process";
import { readFile, readdir, mkdir, writeFile, access } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { pages } from "../app/content/pages.js";
import { interiorDetails } from "../app/content/interior.js";
import { quoteUi } from "../app/content/quote.js";
import { createNpmInvocation } from "./lib/npm-command.mjs";
import { verifyManifestIntegrity } from "./lib/manifest-integrity.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const report = {
  startedAt: new Date().toISOString(), node: process.version,
  baseline: "fe6f3bf70443f775c08302f29724f2a600be2ba9", verifierVersion: "5.0",
  scope: "UI-only quote preview; no delivery integration", checks: [],
  browserVerification: "Not performed by this script; use the manual checklist.",
};
let failed = false;
function record(name, passed, detail = "") {
  report.checks.push({ name, passed, detail });
  if (!passed) failed = true;
  console.log(`${passed ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
}
function runNpm(task) {
  const invocation = createNpmInvocation(task);
  const result = spawnSync(invocation.command, invocation.args, {
    cwd: root, encoding: "utf8", shell: false, windowsHide: true, maxBuffer: 20 * 1024 * 1024,
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  process.stdout.write(output);
  const passed = result.status === 0 && !result.error;
  record(`npm run ${task}`, passed, result.error?.message ?? `exit ${result.status}`);
  report.checks[report.checks.length - 1].outputTail = output.slice(-6000);
  return passed;
}
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...await walk(full));
    else results.push(full);
  }
  return results;
}
async function checkSource() {
  const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  const lock = JSON.parse(await readFile(path.join(root, "package-lock.json"), "utf8"));
  for (const field of ["dependencies", "devDependencies"]) {
    const specs = pkg[field] ?? {};
    const lockedSpecs = lock.packages?.[""]?.[field] ?? {};
    const same = Object.keys(specs).length === Object.keys(lockedSpecs).length && Object.entries(specs).every(([name, value]) => lockedSpecs[name] === value);
    record(`lockfile ${field} declarations`, same);
  }
  const integrity = await verifyManifestIntegrity(root);
  record("active delivered-file integrity (newest approved version)", integrity.passed, `${integrity.checkedFiles} files; ${integrity.issues.join("; ")}`);
  report.deliveryManifests = integrity.manifests;
  const fallback = await readFile(path.join(root, "app/routes/not-found.jsx"), "utf8");
  record("wildcard fallback has no server loader export", !/export\s+(?:async\s+)?function\s+loader\b|export\s+(?:const|let|var)\s+loader\b/.test(fallback));
  const sourceFiles = [...await walk(path.join(root, "app")), ...await walk(path.join(root, "shared"))];
  record("authored app and shared code are JavaScript", !sourceFiles.some((file) => /\.tsx?$/.test(file)));
  const missing = [];
  for (const file of sourceFiles.filter((entry) => /\.[cm]?jsx?$/.test(entry))) {
    const source = await readFile(file, "utf8");
    for (const expression of [/(?:from\s+|import\s+)["'](\.[^"']+)["']/g, /import\s*\(\s*["'](\.[^"']+)["']/g]) {
      for (const match of source.matchAll(expression)) {
        try { await access(path.resolve(path.dirname(file), match[1])); }
        catch { missing.push(`${path.relative(root, file)} -> ${match[1]}`); }
      }
    }
  }
  record("relative source import targets exist", missing.length === 0, missing.join("; "));
  record("seven approved detail routes have content", Object.keys(interiorDetails).length === 7);
  record("quote configuration is UI-only", quoteUi.mode === "preview-only" && quoteUi.notificationRecipient === "support@easycodechecks.com");
  const formSource = await readFile(path.join(root, "app/components/forms/QuoteForm.jsx"), "utf8");
  record("quote form source has no delivery/persistence calls", !/\b(?:fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage)\b/.test(formSource));
  report.sourceHashes = {};
  for (const file of sourceFiles) report.sourceHashes[path.relative(root, file).split(path.sep).join("/")] = createHash("sha256").update(await readFile(file)).digest("hex");
}
async function checkBuiltPages() {
  const known = new Set(pages.map((page) => page.path));
  const client = path.join(root, "build", "client");
  for (const page of pages) {
    const slug = page.path.replace(/^\//, "");
    const candidates = page.path === "/" ? [path.join(client, "index.html")] : [path.join(client, slug, "index.html"), path.join(client, `${slug}.html`)];
    const file = candidates.find((candidate) => existsSync(candidate));
    if (!file) { record(`prerender ${page.path}`, false, "HTML file missing"); continue; }
    const html = await readFile(file, "utf8");
    const h1s = (html.match(/<h1(?:\s|>)/g) ?? []).length;
    const hasNoindex = /<meta[^>]+name=["']robots["'][^>]+content=["']noindex/i.test(html) || /<meta[^>]+content=["']noindex[^>]+name=["']robots/i.test(html);
    record(`prerender ${page.path}`, h1s === 1 && hasNoindex && !html.includes("Batch 1 foundation"), `H1=${h1s}; noindex=${hasNoindex}`);
    const broken = [];
    for (const match of html.matchAll(/href=["'](\/(?!\/)[^"']*)["']/g)) {
      const pathname = new URL(match[1].replaceAll("&amp;", "&"), "https://local.invalid").pathname.replace(/\/+$/, "") || "/";
      if (pathname.startsWith("/assets/") || pathname.startsWith("/@")) continue;
      if (!known.has(pathname) && !existsSync(path.join(client, pathname.slice(1)))) broken.push(pathname);
    }
    record(`internal links ${page.path}`, broken.length === 0, [...new Set(broken)].join(", "));
    if (page.id === "home") record("homepage static fallback is prerendered", html.includes("Not a permit drawing") && !html.includes("<canvas"));
    if (page.id === "request-a-quote") {
      const localForm = /<form\b[^>]*data-ui-only="true"/.test(html);
      const noAction = !/<form\b[^>]*action=/.test(html);
      const disabledBeforeHydration = /<fieldset\b[^>]*id="quote-ui-fields"[^>]*disabled/.test(html);
      record("quote page exposes only a safe local preview", localForm && noAction && disabledBeforeHydration && html.includes("Online submission is not connected yet.") && html.includes("Validate &amp; preview") && !html.includes('type="file"'));
    }
  }
}
try {
  const git = spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8", shell: false });
  report.checkedOutCommit = git.status === 0 ? git.stdout.trim() : "Unavailable";
  await checkSource();
  runNpm("test");
  if (runNpm("build")) await checkBuiltPages();
} catch (error) { record("verification execution", false, error.message); }
report.finishedAt = new Date().toISOString();
report.passed = !failed;
await mkdir(path.join(root, "verification"), { recursive: true });
await writeFile(path.join(root, "verification", "latest.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Verification ${failed ? "FAILED" : "PASSED"}. Report: verification/latest.json`);
process.exitCode = failed ? 1 : 0;
