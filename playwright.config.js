import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 2,
  retries: 0,
  timeout: 30000,
  expect: { timeout: 10000 },
  forbidOnly: Boolean(process.env.CI),
  outputDir: "test-results",
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["json", { outputFile: "verification/browser-results.json" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    serviceWorkers: "block",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "off",
    actionTimeout: 10000,
    navigationTimeout: 20000,
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "no-preference" } },
    { name: "reduced-motion", use: { viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" } },
  ],
  webServer: {
    command: "node scripts/preview.mjs --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 30000,
  },
});
