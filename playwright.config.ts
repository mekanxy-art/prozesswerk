import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  workers: 1,
  fullyParallel: false,
  timeout: 60000,
  use: {
    baseURL: process.env.TEST_BASE_URL || "http://localhost:3000",
    browserName: "chromium",
    channel:
      process.env.TEST_BROWSER_CHANNEL ||
      (process.env.CI ? "chromium" : "msedge"),
    trace: "retain-on-failure",
  },
  reporter: [["list"], ["html", { open: "never" }]],
});
