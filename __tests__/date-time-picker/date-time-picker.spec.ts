import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Interactive elements/DateTimePicker"
// → prefix: "ui-interactive-elements-datetimepicker"
const STORY_BASE = "ui-interactive-elements-datetimepicker";

async function gotoStory(page: Page, storyId: string) {
  // The css-customization story renders the current time, so without a frozen
  // clock the shot differs from its baseline as soon as the minute rolls over.
  await page.clock.install({ time: new Date("2026-01-15T09:20:00") });
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("DateTimePicker — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("date-time-picker-default.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("date-time-picker-css-customization.png");
  });
});

test.describe("DateTimePicker — dark", () => {
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
    await expect(page).toHaveScreenshot("date-time-picker-default-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("date-time-picker-css-customization-dark.png");
  });
});
