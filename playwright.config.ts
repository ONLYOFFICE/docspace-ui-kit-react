import { defineConfig, devices } from "@playwright/test";

const STORYBOOK_PORT = 6007;

export default defineConfig({
  testDir: "./__tests__",
  fullyParallel: true,
  // 30s (the default) is not enough for the first specs of a run: `storybook
  // dev` serves the port before it has compiled anything, so the earliest
  // navigations wait on an on-demand build while every worker asks at once.
  timeout: 60_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: Number(process.env.WORKERS) || (process.env.CI ? 1 : undefined),
  reporter: [
    ["dot"],
    [
      "html",
      {
        outputFolder: "playwright-report",
        open: "never",
      },
    ],
    [
      "json",
      {
        outputFile: "playwright-report/test-results.json",
      },
    ],
  ],
  use: {
    baseURL: `http://localhost:${STORYBOOK_PORT}`,
    trace: "on-first-retry",
  },
  snapshotPathTemplate: "{testDir}/screenshots{/projectName}/{arg}{ext}",
  expect: {
    toHaveScreenshot: {
      threshold: 0.16,
      animations: "disabled",
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1024 },
      },
    },
  ],
  webServer: {
    command: `storybook dev --port ${STORYBOOK_PORT} --no-open`,
    port: STORYBOOK_PORT,
    timeout: 1000 * 60 * 5,
    reuseExistingServer: !process.env.CI,
  },
});
