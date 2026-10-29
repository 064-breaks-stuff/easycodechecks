import { test, expect } from "./fixtures.js";
import { pages } from "../../app/content/pages.js";
import { site } from "../../app/content/site.js";

for (const record of pages) {
  test(`direct route ${record.path}: content, metadata, layout`, async ({ page }) => {
    const sceneRequests = [];
    page.on("request", (request) => {
      if (/HeroCanvas\.client-.*\.js/.test(request.url())) sceneRequests.push(request.url());
    });
    await page.goto(record.path, { waitUntil: "domcontentloaded" });
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page).toHaveTitle(record.seoTitle);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", record.path === "/" ? site.url : `${site.url}${record.path}`);
    const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    expect(fits, `Horizontal overflow at ${record.path}`).toBe(true);
    if (record.id !== "home") {
      await expect(page.locator("canvas")).toHaveCount(0);
      expect(sceneRequests, "Interior routes must not fetch the hero scene").toEqual([]);
    }
  });
}

test("client-side unknown-route fallback renders", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  // Exercise the client router, not a hosting provider's HTTP fallback policy.
  await page.evaluate(() => {
    window.history.pushState({}, "", "/qa-missing-page");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.getByRole("heading", { name: "That page is not here." })).toBeVisible();
  await expect(page.getByRole("main").getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
});
