import { defineConfig, devices } from "@playwright/test";

const STORYBOOK_PORT = 6007;

export default defineConfig({
  testDir: "./__tests__",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["dot"],
    [
      "html",
      {
        outputFolder: "../../playwright-report/ui-kit",
        open: "never",
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
    command: `pnpm run copy-assets && storybook dev --port ${STORYBOOK_PORT} --no-open`,
    port: STORYBOOK_PORT,
    timeout: 1000 * 60 * 5,
    reuseExistingServer: !process.env.CI,
  },
});
