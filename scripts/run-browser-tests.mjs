import path from "node:path";
import { spawnSync } from "node:child_process";
import { readFile, mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { analyzeBuild } from "./analyze-build.mjs";
import { summarizeBrowserReport } from "./lib/browser-report.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const verification = path.join(root, "verification");
const rawReport = path.join(verification, "browser-results.json");
const summary = {
  startedAt: new Date().toISOString(),
  baseline: "f3bcc6f95e680fe4627d80ca8c27e0623de66954",
  passed: false,
  stage: "setup",
  scope: "Local production-preview Chromium QA; not a live deployment or hardware-GPU certification.",
};
let exitCode = 1;
function execute(script, args = []) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root, stdio: "inherit", shell: false, windowsHide: true,
  });
  if (result.error) throw result.error;
  return result.status ?? 1;
}
try {
  await mkdir(verification, { recursive: true });
  await rm(rawReport, { force: true });
  const cli = path.join(root, "node_modules", "@playwright", "test", "cli.js");
  if (!existsSync(cli)) throw new Error("Playwright is not installed. Run npm install, then npx playwright install chromium.");
  summary.stage = "project-verification";
  if (execute(path.join(root, "scripts", "verify-project.mjs")) !== 0) throw new Error("Project verification failed. Fix verification/latest.json failures before browser tests.");
  const projectReport = JSON.parse(await readFile(path.join(verification, "latest.json"), "utf8"));
  summary.checkedOutCommit = projectReport.checkedOutCommit;
  summary.sourceHashes = projectReport.sourceHashes;
  summary.deliveryManifests = projectReport.deliveryManifests;
  summary.stage = "asset-inventory";
  const assets = await analyzeBuild(root);
  summary.largeJavaScriptFiles = assets.largeJavaScript.map((item) => item.file);
  summary.stage = "browser-tests";
  const browserExit = execute(cli, ["test", ...process.argv.slice(2)]);
  let report;
  try { report = JSON.parse(await readFile(rawReport, "utf8")); }
  catch { throw new Error("Playwright did not produce a JSON report. Review terminal output; browser binaries may need npx playwright install chromium."); }
  const results = summarizeBrowserReport(report);
  summary.browser = results;
  summary.passed = browserExit === 0 && results.passed;
  summary.stage = "complete";
  exitCode = summary.passed ? 0 : 1;
} catch (error) {
  summary.error = error.message;
  console.error(error.message);
} finally {
  summary.finishedAt = new Date().toISOString();
  await mkdir(verification, { recursive: true });
  await writeFile(path.join(verification, "browser-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`Browser QA ${summary.passed ? "PASSED" : "FAILED"}. Summary: verification/browser-summary.json`);
  process.exitCode = exitCode;
}
