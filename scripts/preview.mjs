import path from "node:path";
import { fileURLToPath } from "node:url";
import { access } from "node:fs/promises";
import { pages } from "../app/content/pages.js";
import { createStaticPreview } from "./lib/static-preview.mjs";

let host = "127.0.0.1";
let port = 4173;
const args = process.argv.slice(2);
for (let index = 0; index < args.length; index += 1) {
  if (args[index] === "--host") host = args[++index];
  else if (args[index] === "--port") port = Number(args[++index]);
  else if (args[index] === "--strictPort") continue;
  else throw new Error(`Unsupported preview option: ${args[index]}`);
}
if (!["127.0.0.1", "localhost"].includes(host)) throw new Error("This development preview is restricted to the local machine.");
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Use a valid preview port.");
const root = fileURLToPath(new URL("../", import.meta.url));
const directory = path.join(root, "build", "client");
for (const page of pages) {
  const relative = page.path === "/" ? "index.html" : `${page.path.slice(1)}/index.html`;
  try { await access(path.join(directory, relative)); }
  catch { throw new Error(`Missing prerendered ${relative}. Run npm run build first.`); }
}
await access(path.join(directory, "__spa-fallback.html"));
const server = await createStaticPreview({ directory, routePaths: pages.map((page) => page.path) });
server.on("error", (error) => {
  console.error(`Preview could not start: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, host, () => console.log(`Route-aware local preview: http://${host}:${port}`));
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    server.closeAllConnections?.();
  });
}
