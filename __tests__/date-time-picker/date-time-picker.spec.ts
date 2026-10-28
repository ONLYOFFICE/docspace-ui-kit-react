import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Form controls/DateTimePicker"
// → prefix: "ui-form-controls-datetimepicker"
const STORY_BASE = "ui-form-controls-datetimepicker";

async function gotoStory(page: Page, storyId: string) {
  // The css-customization story renders the current time, so without a frozen
  // clock the shot differs from its baseline as soon as the minute rolls over.
  await page.clock.install({ time: new Date("2026-01-15T09:20:00") });
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  // Storybook answers 200 for an unknown id and shows its error display
  // instead of the story: fail on that now, not on a timeout further down.
  await page.waitForSelector("body.sb-show-main, body.sb-show-errordisplay", {
    state: "attached",
  });
  await expect(page.locator("body")).not.toHaveClass(/sb-show-errordisplay/);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await page.waitForLoadState("networkidle");
}

test.describe("DateTimePicker — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("date-time-picker-default.png");
  });

  test("twenty four hour clock", async ({ page }) => {
    await gotoStory(page, "twenty-four-hour-clock");
    await expect(page).toHaveScreenshot(
      "date-time-picker-twenty-four-hour-clock.png",
    );
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot(
      "date-time-picker-css-customization.png",
    );
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
    await expect(page).toHaveScreenshot(
      "date-time-picker-css-customization-dark.png",
    );
  });
});
