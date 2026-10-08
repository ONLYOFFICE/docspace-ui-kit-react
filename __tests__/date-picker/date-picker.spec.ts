import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Form controls/DatePicker"
// → prefix: "ui-form-controls-datepicker"
const STORY_BASE = "ui-form-controls-datepicker";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("DatePicker — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("date-picker-default.png");
  });

  test("without clear button", async ({ page }) => {
    await gotoStory(page, "without-clear-button");
    await expect(page).toHaveScreenshot("date-picker-without-clear-button.png");
  });

  test("aligned to right edge", async ({ page }) => {
    await gotoStory(page, "aligned-to-right-edge");
    await expect(page).toHaveScreenshot(
      "date-picker-aligned-to-right-edge.png",
    );
  });

  test("end of day value", async ({ page }) => {
    await gotoStory(page, "end-of-day-value");
    await expect(page).toHaveScreenshot("date-picker-end-of-day-value.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("date-picker-right-to-left.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("date-picker-css-customization.png");
  });
});

test.describe("DatePicker — dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("default dark", async ({ page }) => {
    await gotoStory(page, "default");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("date-picker-default-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "date-picker-css-customization-dark.png",
    );
  });
});
