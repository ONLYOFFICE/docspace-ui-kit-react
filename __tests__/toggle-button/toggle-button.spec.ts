import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Form controls/ToggleButton"
// sanitize() lowercases and replaces spaces/slashes with dashes — no camelCase split for title segments
// → prefix: "ui-form-controls-togglebutton" (ToggleButton → togglebutton, not toggle-button)
const STORY_BASE = "ui-form-controls-togglebutton";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  // Storybook answers 200 for an unknown id and shows its error display
  // instead of the story: fail on that now, not on a timeout further down.
  await page.waitForSelector("body.sb-show-main, body.sb-show-errordisplay", {
    state: "attached",
  });
  await expect(page.locator("body")).not.toHaveClass(/sb-show-errordisplay/);
  // The label is absolutely positioned, so with `noPadding` (right-to-left)
  // the root has no height and never counts as visible: wait for the label.
  await page.locator("#storybook-root label").first().waitFor();
  await page.waitForLoadState("networkidle");
}

test.describe("ToggleButton — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("toggle-button-default.png");
  });

  test("checked states", async ({ page }) => {
    await gotoStory(page, "checked-states");
    await expect(page).toHaveScreenshot("toggle-button-checked-states.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("toggle-button-css-customization.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("toggle-button-right-to-left.png");
  });
});

test.describe("ToggleButton — dark", () => {
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
    await expect(page).toHaveScreenshot("toggle-button-default-dark.png");
  });

  test("checked states dark", async ({ page }) => {
    await gotoStory(page, "checked-states");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "toggle-button-checked-states-dark.png",
    );
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "toggle-button-css-customization-dark.png",
    );
  });
});
