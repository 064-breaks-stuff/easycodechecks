import path from "node:path";
import { fileURLToPath } from "node:url";
import { access, mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";
import { pages } from "../app/content/pages.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "test-results", "premium-review");
const base = "http://127.0.0.1:4173";
const report = { generatedAt: new Date().toISOString(), baseline: "2cb6bca37c361489cdd91480d7569c8ba64b3713", visualApproval: false, captures: [], issues: [] };
let server;
let browser;
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
try {
  await access(path.join(root, "build", "client", "index.html"));
  await mkdir(output, { recursive: true });
  server = spawn(process.execPath, [path.join(root, "scripts", "preview.mjs"), "--host", "127.0.0.1", "--port", "4173"], { cwd: root, shell: false, stdio: ["ignore", "pipe", "pipe"] });
  await new Promise((resolve, reject) => {
    let messages = "";
    const timer = setTimeout(() => reject(new Error("Local preview did not start in time. Check port 4173.")), 15000);
    server.on("error", (error) => { clearTimeout(timer); reject(error); });
    server.on("exit", (code) => { clearTimeout(timer); reject(new Error(`Preview exited (${code}). ${messages}`)); });
    server.stderr.on("data", (data) => { messages += data.toString(); });
    server.stdout.on("data", (data) => {
      messages += data.toString();
      if (messages.includes("Route-aware local preview:")) { clearTimeout(timer); resolve(); }
    });
  });
  browser = await chromium.launch();
  for (const mode of [{ name: "desktop", width: 1440, height: 1000 }, { name: "mobile", width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport: { width: mode.width, height: mode.height }, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (/^https?:$/.test(url.protocol) && url.origin !== base) {
        report.issues.push(`Blocked external request: ${url.origin}`);
        await route.abort();
      } else await route.continue();
    });
    page.on("pageerror", (error) => report.issues.push(error.message));
    for (const record of pages) {
      await page.goto(`${base}${record.path}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const file = `${record.id}-${mode.name}.png`;
      await page.screenshot({ path: path.join(output, file), fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      report.captures.push({ route: record.path, title: record.title, mode: mode.name, width: mode.width, file, overflow });
      if (overflow) report.issues.push(`Horizontal overflow: ${record.path} at ${mode.width}px`);
    }
    await context.close();
  }
  const cards = report.captures.map((capture) => `<article><a href="${escape(capture.file)}"><img src="${escape(capture.file)}" alt="${escape(capture.route)} ${escape(capture.mode)} screenshot" loading="lazy"></a><h2>${escape(capture.route)}</h2><p>${escape(capture.mode)} · ${capture.width}px · ${capture.overflow ? "OVERFLOW DETECTED" : "No document overflow detected"}</p></article>`).join("\n");
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Easy Code Checks — local design review</title><style>body{margin:0;padding:32px;background:#f4f5ef;color:#142b26;font:15px/1.6 system-ui}main{max-width:1440px;margin:auto}h1{font-size:32px;letter-spacing:-.04em}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;margin-top:32px}article{background:white;border:1px solid #dce2d9;padding:16px;border-radius:8px}img{width:100%;height:260px;object-fit:cover;object-position:top;border:1px solid #e2e5dc}h2{font-size:18px;margin:16px 0 6px}p{margin:0;color:#53645c}</style><main><h1>Local design review</h1><p>Actual local screenshots; no visual approval is implied. Reduced motion is used for consistent static review; these do not certify GPU scene quality. Open a screenshot for the full page.</p><section>${cards}</section></main></html>`;
  await writeFile(path.join(output, "index.html"), html);
  console.log(`Captured ${report.captures.length} page views. Open test-results/premium-review/index.html locally.`);
} catch (error) {
  report.issues.push(error.message);
  console.error(error.message);
} finally {
  await browser?.close();
  server?.kill("SIGTERM");
  await mkdir(output, { recursive: true });
  await writeFile(path.join(output, "capture-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  if (report.issues.length) process.exitCode = 1;
}
