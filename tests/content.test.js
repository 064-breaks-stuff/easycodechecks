import { describe, expect, it } from "vitest";

import { pages } from "../app/content/pages.js";
import { navigation } from "../app/content/site.js";
import {
  getPageByPath,
  getRelatedPages,
  normalizePath,
  validatePages,
} from "../app/lib/content.js";

describe("content foundation", () => {
  it("contains a valid page registry", () => {
    expect(validatePages(pages)).toEqual([]);
  });

  it("normalizes trailing slashes", () => {
    expect(normalizePath("/services/")).toBe("/services");
    expect(normalizePath("/")).toBe("/");
  });

  it("finds known pages", () => {
    expect(getPageByPath("/services/")?.id).toBe("services");
  });

  it("returns undefined for unknown pages", () => {
    expect(getPageByPath("/does-not-exist")).toBeUndefined();
  });

  it("resolves related pages", () => {
    const home = getPageByPath("/");
    const relatedPages = getRelatedPages(home);

    expect(relatedPages).toHaveLength(3);
    expect(
      relatedPages.every((page) => Boolean(page.id)),
    ).toBe(true);
  });

  it("rejects duplicate page identifiers and paths", () => {
    const errors = validatePages([pages[0], pages[0]]);

    expect(errors.some((error) => error.includes("id"))).toBe(
      true,
    );
    expect(
      errors.some((error) => error.includes("path")),
    ).toBe(true);
  });

  it("resolves all navigation targets", () => {
    for (const item of navigation) {
      expect(getPageByPath(item.href)).toBeDefined();

      for (const child of item.children ?? []) {
        expect(getPageByPath(child.href)).toBeDefined();
      }
    }
  });
});