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
    await expect(page).toHaveScreenshot(
      "columnar-info-bar-profile-details.png",
    );
  });

  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("columnar-info-bar-default.png");
  });

  test("event-details", async ({ page }) => {
    await gotoStory(page, "event-details");
    await expect(page).toHaveScreenshot("columnar-info-bar-event-details.png");
  });

  test("neutral-variant", async ({ page }) => {
    await gotoStory(page, "neutral-variant");
    await expect(page).toHaveScreenshot(
      "columnar-info-bar-neutral-variant.png",
    );
  });

  test("page-variant", async ({ page }) => {
    await gotoStory(page, "page-variant");
    await expect(page).toHaveScreenshot("columnar-info-bar-page-variant.png");
  });

  test("css-customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot(
      "columnar-info-bar-css-customization.png",
    );
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
    await expect(page).toHaveScreenshot(
      "columnar-info-bar-profile-details-dark.png",
    );
  });

  test("neutral-variant dark", async ({ page }) => {
    await gotoStory(page, "neutral-variant");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "columnar-info-bar-neutral-variant-dark.png",
    );
  });

  test("page-variant dark", async ({ page }) => {
    await gotoStory(page, "page-variant");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "columnar-info-bar-page-variant-dark.png",
    );
  });

  test("css-customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "columnar-info-bar-css-customization-dark.png",
    );
  });
});
