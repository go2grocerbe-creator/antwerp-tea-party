import { defineConfig, devices } from "@playwright/test";

// Playwright E2E config. See docs/testing-plan.md for what these tests cover and what they
// deliberately do not (real payment provider checkout — no credentials are configured yet).
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      // Mobile viewport on Chromium rather than the iPhone 13 WebKit preset, so this project
      // only needs the Chromium browser binary already installed for local/CI runs.
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000/nl",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: { COMMERCE_PREVIEW_TOKEN: "e2e-preview-token" },
  },
});
