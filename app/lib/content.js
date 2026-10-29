import { pages } from "../content/pages.js";

export function normalizePath(pathname) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.replace(/\/+$/, "");
}

export function getAllPages() {
  return pages;
}

export function getPageByPath(pathname) {
  const normalizedPath = normalizePath(pathname);

  return pages.find((page) => page.path === normalizedPath);
}

export function getRelatedPages(page) {
  return (page.relatedPaths ?? [])
    .map((path) => getPageByPath(path))
    .filter(Boolean);
}

export function validatePages(records) {
  const errors = [];
  const ids = new Set();
  const paths = new Set();

  for (const page of records) {
    if (!page.id || ids.has(page.id)) {
      errors.push(`Missing or duplicate page id: ${page.id}`);
    }

    if (
      !page.path ||
      !page.path.startsWith("/") ||
      paths.has(page.path)
    ) {
      errors.push(`Invalid or duplicate page path: ${page.path}`);
    }

    if (page.path !== "/" && page.path?.endsWith("/")) {
      errors.push(`Page path has a trailing slash: ${page.path}`);
    }

    for (const field of [
      "title",
      "eyebrow",
      "description",
      "seoTitle",
    ]) {
      if (
        typeof page[field] !== "string" ||
        !page[field].trim()
      ) {
        errors.push(`${page.id}: missing ${field}`);
      }
    }

    ids.add(page.id);
    paths.add(page.path);
  }

  for (const page of records) {
    for (const relatedPath of page.relatedPaths ?? []) {
      if (!paths.has(relatedPath)) {
        errors.push(
          `${page.id}: related page does not exist: ${relatedPath}`,
        );
      }
    }
  }

  return errors;
}