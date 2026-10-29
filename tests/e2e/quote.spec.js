import { test, expect } from "./fixtures.js";

async function openForm(page, query = "") {
  await page.goto(`/request-a-quote${query}`);
  await expect(page.getByRole("button", { name: "Validate & preview", exact: true })).toBeEnabled();
}
async function fillDraft(page) {
  await page.locator("#quote-contactName").fill("Website QA");
  await page.locator("#quote-company").fill("Example Sign Company");
  await page.locator("#quote-email").fill("qa@example.com");
  await page.locator("#quote-service").selectOption("code-checks");
  await page.locator("#quote-country").fill("Example country");
  await page.locator("#quote-region").fill("Example region");
  await page.locator("#quote-city").fill("Example city");
  await page.locator("#quote-summary").fill("Research support for proposed building signage.");
  await page.locator("#quote-previewAcknowledged").check();
}

test("empty validation shows a focused error summary", async ({ page }) => {
  await openForm(page);
  await page.getByRole("button", { name: "Validate & preview", exact: true }).click();
  const errors = page.getByRole("alert");
  await expect(errors).toBeVisible();
  await expect(errors).toBeFocused();
  await expect(page.locator("#quote-contactName")).toBeEnabled();
  await errors.getByRole("link", { name: /^Your name:/ }).click();
  await expect(page.locator("#quote-contactName")).toBeFocused();
  await expect(page.locator("#quote-contactName")).toHaveAttribute("aria-invalid", "true");
});

test("valid review stays local; edit and reset work", async ({ page }) => {
  const writes = [];
  page.on("request", (request) => {
    if (!["GET", "HEAD"].includes(request.method())) writes.push(`${request.method()} ${request.url()}`);
  });
  await openForm(page, "?service=code-checks&industry=banking");
  await fillDraft(page);
  await page.getByRole("button", { name: "Validate & preview", exact: true }).click();
  const heading = page.getByRole("heading", { name: "Preview ready — nothing has been sent.", exact: true });
  await expect(heading).toBeVisible();
  await expect(heading).toBeFocused();
  await expect(page.getByRole("region", { name: "Preview ready — nothing has been sent." })).toContainText("qa@example.com");
  expect(writes, "The preview must not submit requests").toEqual([]);
  expect(page.url()).not.toContain("qa%40example.com");
  expect(page.url()).not.toContain("Website%20QA");
  await page.locator("#quote-summary").fill("Updated local draft.");
  await expect(heading).not.toBeVisible();
  await page.getByRole("button", { name: "Reset form", exact: true }).click();
  await expect(page.locator("#quote-contactName")).toHaveValue("");
  await expect(page.locator("#quote-summary")).toHaveValue("");
  await expect(page.locator("#quote-previewAcknowledged")).not.toBeChecked();
  await expect(page.locator("#quote-service")).toHaveValue("code-checks");
  await expect(page.locator("#quote-industry")).toHaveValue("banking");
});

test("known query defaults are selected; unknown values are ignored", async ({ page }) => {
  await openForm(page, "?service=code-checks&industry=banking");
  await expect(page.locator("#quote-service")).toHaveValue("code-checks");
  await expect(page.locator("#quote-industry")).toHaveValue("banking");
  await openForm(page, "?service=unknown&industry=unknown");
  await expect(page.locator("#quote-service")).toHaveValue("");
  await expect(page.locator("#quote-industry")).toHaveValue("");
});

test("all form controls expose labels", async ({ page }) => {
  await openForm(page);
  const missing = await page.locator("main input, main select, main textarea").evaluateAll((controls) => controls.filter((control) => !control.labels?.length && !control.getAttribute("aria-label") && !control.getAttribute("aria-labelledby")).map((control) => control.id));
  expect(missing).toEqual([]);
});
