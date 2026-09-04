import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Data display/PortalLogo"
// → prefix: "ui-data-display-portallogo"
const STORY_BASE = "ui-data-display-portallogo";

const MOBILE_LOGO_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="24"><rect fill="#0082c9" width="48" height="24" rx="4"/></svg>';

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("PortalLogo — light", () => {
  test("css customization (mobile)", async ({ page }) => {
    // Mock logo requests so the <img> loads instead of triggering the error fallback
    await page.route(/\/logo\.ashx/, (route) =>
      route.fulfill({
        contentType: "image/svg+xml",
        body: MOBILE_LOGO_SVG,
      }),
    );
    // Use mobile viewport so the resizable header bar is visible
    await page.setViewportSize({ width: 500, height: 600 });
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("portal-logo-css-customization.png");
  });
});

test.describe("PortalLogo — dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("css customization dark (mobile)", async ({ page }) => {
    await page.route(/\/logo\.ashx/, (route) =>
      route.fulfill({
        contentType: "image/svg+xml",
        body: MOBILE_LOGO_SVG,
      }),
    );
    await page.setViewportSize({ width: 500, height: 600 });
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("portal-logo-css-customization-dark.png");
  });
});
