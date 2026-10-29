import { pages } from "../app/content/pages.js";
import { navigation } from "../app/content/site.js";
import { validatePages } from "../app/lib/content.js";

const errors = validatePages(pages);
const paths = new Set(pages.map((page) => page.path));

for (const item of navigation) {
  if (!paths.has(item.href)) {
    errors.push(`Navigation target is missing: ${item.href}`);
  }

  for (const child of item.children ?? []) {
    if (!paths.has(child.href)) {
      errors.push(`Navigation target is missing: ${child.href}`);
    }
  }
}

if (errors.length > 0) {
  console.error(
    `Content validation failed:\n${errors
      .map((error) => `- ${error}`)
      .join("\n")}`,
  );
  process.exit(1);
}

console.log(
  `Content validation passed: ${pages.length} pages and all navigation targets are valid.`,
);