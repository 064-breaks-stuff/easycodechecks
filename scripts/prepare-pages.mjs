import { fileURLToPath } from "node:url";
import { pages } from "../app/content/pages.js";
import { preparePagesArtifact } from "./lib/pages-artifact.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const report = await preparePagesArtifact(root, pages.map((page) => page.path));
console.log(`Prepared ${report.knownRoutes.length} static routes and 404.html for a no-index Pages preview. Nothing was deployed.`);
