import { createServer } from "node:http";
import path from "node:path";
import { realpath, readFile, stat } from "node:fs/promises";

const contentTypes = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".data": "text/x-script; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".avif": "image/avif", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".woff": "font/woff", ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8", ".map": "application/json; charset=utf-8",
};

export async function createStaticPreview({ directory, routePaths }) {
  const root = await realpath(directory);
  const routes = new Set(routePaths);
  const contained = (file) => {
    const relative = path.relative(root, file);
    return relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
  };
  async function resolveFile(relative) {
    const candidate = path.resolve(root, relative);
    if (!contained(candidate)) return null;
    try {
      const resolved = await realpath(candidate);
      if (!contained(resolved) || !(await stat(resolved)).isFile()) return null;
      return resolved;
    } catch { return null; }
  }
  return createServer(async (request, response) => {
    const finish = (status, body, type = "text/plain; charset=utf-8", previewFile = "") => {
      response.writeHead(status, {
        "Content-Type": type,
        "Content-Length": Buffer.byteLength(body),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        ...(previewFile ? { "X-Preview-File": previewFile } : {}),
      });
      response.end(request.method === "HEAD" ? undefined : body);
    };
    try {
      if (!["GET", "HEAD"].includes(request.method)) {
        finish(405, "Local preview accepts only GET and HEAD.");
        return;
      }
      let pathname;
      try { pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname); }
      catch { finish(400, "Invalid URL."); return; }
      if (pathname.includes("\\") || pathname.includes("\0") || pathname.split("/").includes("..")) {
        finish(400, "Invalid path."); return;
      }
      const normalized = pathname.replace(/\/+$/, "") || "/";
      let relative;
      if (routes.has(normalized)) {
        relative = normalized === "/" ? "index.html" : `${normalized.slice(1)}/index.html`;
      } else {
        relative = pathname.replace(/^\/+/, "");
      }
      let file = await resolveFile(relative);
      let status = 200;
      if (!file) {
        // Never answer missing asset/data requests with homepage HTML.
        const navigation = String(request.headers.accept ?? "").includes("text/html") || request.headers["sec-fetch-dest"] === "document";
        const assetLike = normalized.startsWith("/assets/") || Boolean(path.extname(normalized));
        if (!routes.has(normalized) && navigation && !assetLike) {
          file = await resolveFile("__spa-fallback.html");
          status = 404;
        }
      }
      if (!file) { finish(404, "Not found."); return; }
      const body = await readFile(file);
      const served = path.relative(root, file).split(path.sep).join("/");
      finish(status, body, contentTypes[path.extname(file)] ?? "application/octet-stream", served);
    } catch {
      if (!response.headersSent) finish(500, "Local preview failed to read the requested file.");
      else response.destroy();
    }
  });
}
