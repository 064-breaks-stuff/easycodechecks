import { test, expect } from "./fixtures.js";

test("form implementation loads when visiting the quote route, not before", async ({ page }) => {
  const pending = [];
  const observed = [];
  const readErrors = [];
  page.on("response", (response) => {
    if (!/\.js(?:\?|$)/.test(response.url()) || response.status() !== 200) return;
    const task = response.text().then((body) => {
      observed.push({ url: response.url(), hasQuoteImplementation: body.includes("quote-ui-fields") });
    }).catch(() => readErrors.push(response.url()));
    pending.push(task);
  });
  async function settleScripts() {
    await page.waitForLoadState("networkidle");
    await Promise.all(pending);
    expect(readErrors, "Unable to inspect a completed JavaScript response").toEqual([]);
  }
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await settleScripts();
  expect(observed.some((item) => item.hasQuoteImplementation), "Homepage fetched the quote form implementation").toBe(false);

  await page.getByRole("link", { name: "Explore Services", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Support for the next step in your signage project.");
  await settleScripts();
  expect(observed.some((item) => item.hasQuoteImplementation), "Services overview fetched the quote form implementation").toBe(false);

  await page.getByRole("main").getByRole("link", { name: "Request a Project Quote", exact: true }).click();
  await expect(page.getByRole("button", { name: "Validate & preview", exact: true })).toBeEnabled();
  await settleScripts();
  expect(observed.some((item) => item.hasQuoteImplementation), "Quote form should load on its own route").toBe(true);
});
