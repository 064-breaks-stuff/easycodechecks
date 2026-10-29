import path from "node:path";
import { access, readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";

export async function preparePagesArtifact(root, routePaths) {
  const output = path.join(root, "build", "client");
  const checks = [];
  for (const route of routePaths) {
    if (!route.startsWith("/") || route.includes("?") || route.includes("#") || route.split("/").includes("..")) {
      throw new Error(`Invalid static route: ${route}`);
    }
    const file = route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
    await access(path.join(output, file));
    checks.push({ route, file });
  }
  const source = await readFile(path.join(output, "__spa-fallback.html"));
  const headers = await readFile(path.join(output, "_headers"), "utf8");
  const robots = await readFile(path.join(output, "robots.txt"), "utf8");
  const globalHeaderBlock = headers.split(/\r?\n(?=\S)/).find((block) => block.split(/\r?\n/)[0].trim() === "/*") ?? "";
  if (!/^\s*X-Robots-Tag:\s*noindex,\s*nofollow\s*$/mi.test(globalHeaderBlock)) {
    throw new Error("Preview artifact is missing the explicit noindex,nofollow header rule.");
  }
  if (!/^Disallow:\s*\/\s*$/mi.test(robots)) {
    throw new Error("Preview artifact must retain robots.txt Disallow: /.");
  }
  await access(path.join(output, "sitemap.xml"));
  // Preserve the exact framework SPA shell, scripts and serialized context.
  await writeFile(path.join(output, "404.html"), source);
  const copied = await readFile(path.join(output, "404.html"));
  const hash = (buffer) => createHash("sha256").update(buffer).digest("hex");
  if (hash(source) !== hash(copied)) throw new Error("404 shell copy verification failed.");
  const report = {
    generatedAt: new Date().toISOString(),
    purpose: "Cloudflare Pages static preview preparation only",
    deployed: false,
    cloudflareRuntimeVerified: false,
    outputDirectory: "build/client",
    knownRoutes: checks,
    fallback: { file: "404.html", source: "__spa-fallback.html", sha256: hash(source), byteIdentical: true },
    crawlDirectives: { headerNoindex: true, robotsDisallowAll: true },
    formScope: "UI-only; no delivery integration",
    limitations: ["Local artifact checks are not a Cloudflare deployment test.", "No-index directives are not access control.", "Final assets/content and explicit release approval remain outstanding."],
  };
  await mkdir(path.join(root, "verification"), { recursive: true });
  await writeFile(path.join(root, "verification", "pages-readiness.json"), `${JSON.stringify(report, null, 2)}\n`);
  return report;
}
