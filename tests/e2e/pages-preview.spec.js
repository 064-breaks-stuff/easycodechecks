import { test, expect } from "./fixtures.js";

test("prepared 404 artifact is the exact framework SPA shell", async ({ request }) => {
  const generated = await request.get("/404.html");
  const source = await request.get("/__spa-fallback.html");
  expect(generated.status()).toBe(200);
  expect(source.status()).toBe(200);
  expect(await generated.text()).toBe(await source.text());
});

test("direct unknown HTML navigation renders the existing not-found view", async ({ page }) => {
  const response = await page.goto("/qa-direct-not-found", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "That page is not here.", exact: true })).toBeVisible();
  await expect(page.getByRole("main").getByRole("link", { name: "Back to home", exact: true })).toHaveAttribute("href", "/");
});
