import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Feedback/Toast"
// → prefix: "ui-feedback-toast"
const STORY_BASE = "ui-feedback-toast";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("Toast — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("toast-default.png");
  });

  test("success", async ({ page }) => {
    await gotoStory(page, "success");
    await expect(page).toHaveScreenshot("toast-success.png");
  });

  test("custom content", async ({ page }) => {
    await gotoStory(page, "custom-content");
    await expect(page).toHaveScreenshot("toast-custom-content.png");
  });

  test("default titles", async ({ page }) => {
    await gotoStory(page, "default-titles");
    await expect(page).toHaveScreenshot("toast-default-titles.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("toast-right-to-left.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("toast-css-customization.png");
  });
});

test.describe("Toast — dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("success dark", async ({ page }) => {
    await gotoStory(page, "success");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("toast-success-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("toast-css-customization-dark.png");
  });
});
