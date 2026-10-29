import { test, expect } from "./fixtures.js";

test("unavailable WebGL keeps the static illustration", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
      if (kind === "webgl2" || kind === "webgl" || kind === "experimental-webgl") return null;
      return original.call(this, kind, ...args);
    };
  });
  await page.goto("/");
  const visual = page.locator('[data-scene-slot="home-hero"]');
  await expect(visual.locator("figure svg")).toBeVisible();
  await expect(visual.locator("figure svg").locator("..")).toHaveCSS("opacity", "1");
  await expect(visual).toContainText("Not a permit drawing");
  await expect(visual.locator("canvas")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Request a Project Quote" }).first()).toBeVisible();
});

test("reduced motion and small screens avoid the 3D chunk", async ({ page }, testInfo) => {
  const shouldUseStatic = testInfo.project.name === "reduced-motion" || (page.viewportSize()?.width ?? 0) < 640;
  test.skip(!shouldUseStatic, "Desktop no-preference may use 3D");
  const sceneRequests = [];
  page.on("request", (request) => {
    if (/HeroCanvas\.client-.*\.js/.test(request.url())) sceneRequests.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator('[data-scene-slot="home-hero"] figure svg')).toBeVisible();
  await page.getByRole("link", { name: "Explore Services", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Support for the next step in your signage project.");
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(sceneRequests).toEqual([]);
});

test("without JavaScript the quote form stays disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/request-a-quote");
    const fieldset = page.locator("#quote-ui-fields");
    // Assert fieldset semantics directly; toBeDisabled targets actionable controls.
    await expect(fieldset).toHaveAttribute("disabled");
    await expect(fieldset).toHaveJSProperty("disabled", true);
    const controls = fieldset.locator("input, select, textarea, button");
    const controlCount = await controls.count();
    expect(controlCount).toBeGreaterThan(0);
    for (let index = 0; index < controlCount; index += 1) {
      await expect(controls.nth(index)).toBeDisabled();
    }
    await expect(page.getByRole("button", { name: "Validate & preview", exact: true })).toBeDisabled();
    await expect(page.getByRole("link", { name: "support@easycodechecks.com", exact: true }).first()).toHaveAttribute("href", "mailto:support@easycodechecks.com");
    await expect(page.getByText("This local preview requires JavaScript.", { exact: false })).toBeVisible();
  } finally {
    await context.close();
  }
});
