import { type Page, expect, test } from "@playwright/test";

// Title: "ColumnarInfoBar"
const STORY_BASE = "ui-feedback-columnarinfobar";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("ColumnarInfoBar -- light", () => {
  test("profile-details", async ({ page }) => {
    await gotoStory(page, "profile-details");
    await expect(page).toHaveScreenshot("columnar-info-bar-profile-details.png");
  });

  test("css-customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("columnar-info-bar-css-customization.png");
  });
});

test.describe("ColumnarInfoBar -- dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("profile-details dark", async ({ page }) => {
    await gotoStory(page, "profile-details");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("columnar-info-bar-profile-details-dark.png");
  });

  test("css-customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("columnar-info-bar-css-customization-dark.png");
  });
});
