import { test, expect } from "./fixtures.js";

test("desktop disclosures support keyboard dismissal and navigation", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 981, "Desktop-only navigation");
  await page.goto("/");
  const services = page.locator("header details").nth(0);
  const industries = page.locator("header details").nth(1);
  const summary = services.locator("summary");
  await summary.click();
  await expect(services).toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await expect(services).not.toHaveAttribute("open", "");
  await expect(summary).toBeFocused();
  await summary.click();
  await industries.locator("summary").click();
  await expect(services).not.toHaveAttribute("open", "");
  await expect(industries).toHaveAttribute("open", "");
  await industries.getByRole("link", { name: "Banks & Financial Institutions", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Banks & Financial Institutions");
  await expect(industries).not.toHaveAttribute("open", "");
});

test("mobile dialog closes with Escape and restores focus", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 981, "Mobile-only navigation");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /^Menu/ });
  const dialog = page.getByRole("dialog", { name: "Navigation" });
  await trigger.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest("dialog")))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});

test("mobile route navigation focuses main content", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 981, "Mobile-only navigation");
  await page.goto("/");
  await page.getByRole("button", { name: /^Menu/ }).click();
  const dialog = page.getByRole("dialog", { name: "Navigation" });
  await dialog.getByRole("link", { name: "Banks & Financial Institutions", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Banks & Financial Institutions");
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("main")).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});

test("resizing an open mobile menu releases its scroll lock", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 981, "Starts in mobile layout");
  await page.goto("/");
  await page.getByRole("button", { name: /^Menu/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});
