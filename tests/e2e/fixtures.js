import { test as base, expect } from "@playwright/test";

export const test = base.extend({
  runtimeGuard: [async ({ page }, use) => {
    const pageErrors = [];
    const hydrationErrors = [];
    const externalRequests = [];
    const onPageError = (error) => pageErrors.push(error.message);
    const onConsole = (message) => {
      if (message.type() === "error" && /hydration|hydrated|server.rendered.HTML|Maximum update depth|Invalid hook call/i.test(message.text())) hydrationErrors.push(message.text());
    };
    page.on("pageerror", onPageError);
    page.on("console", onConsole);
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (/^https?:$/.test(url.protocol) && !["127.0.0.1", "localhost"].includes(url.hostname)) {
        externalRequests.push(url.origin);
        await route.abort();
      } else {
        await route.continue();
      }
    });
    await use();
    page.off("pageerror", onPageError);
    page.off("console", onConsole);
    expect.soft(pageErrors, "Unhandled browser JavaScript errors").toEqual([]);
    expect.soft(hydrationErrors, "Hydration/React runtime errors").toEqual([]);
    expect.soft(externalRequests, "Unexpected external requests; QA must stay local").toEqual([]);
  }, { auto: true }],
});

export { expect };
