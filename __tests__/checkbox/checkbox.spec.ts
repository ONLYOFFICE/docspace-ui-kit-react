import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Form controls/Checkbox"
// sanitize() lowercases and replaces spaces/slashes with dashes — no camelCase split for title segments
// → prefix: "ui-form-controls-checkbox" (Checkbox → checkbox)
const STORY_BASE = "ui-form-controls-checkbox";

async function gotoStory(page: Page, storyId: string) {
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

test.describe("Checkbox — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("checkbox-default.png");
  });

  test("checked states", async ({ page }) => {
    await gotoStory(page, "checked-states");
    await expect(page).toHaveScreenshot("checkbox-checked-states.png");
  });

  test("with help button", async ({ page }) => {
    await gotoStory(page, "with-help-button");
    await expect(page).toHaveScreenshot("checkbox-with-help-button.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("checkbox-css-customization.png");
  });
});

test.describe("Checkbox — dark", () => {
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
    await expect(page).toHaveScreenshot("checkbox-default-dark.png");
  });

  test("checked states dark", async ({ page }) => {
    await gotoStory(page, "checked-states");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("checkbox-checked-states-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("checkbox-css-customization-dark.png");
  });
});
