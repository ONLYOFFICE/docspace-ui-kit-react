import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Data display/SelectedItem"
// → prefix: "ui-data-display-selecteditem"
const STORY_BASE = "ui-data-display-selecteditem";

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

test.describe("SelectedItem — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("selected-item-default.png");
  });

  test("all variants", async ({ page }) => {
    await gotoStory(page, "all-variants");
    await expect(page).toHaveScreenshot("selected-item-all-variants.png");
  });

  test("with icon", async ({ page }) => {
    await gotoStory(page, "with-icon");
    await expect(page).toHaveScreenshot("selected-item-with-icon.png");
  });

  test("active state", async ({ page }) => {
    await gotoStory(page, "active-state");
    await expect(page).toHaveScreenshot("selected-item-active-state.png");
  });

  test("without cross", async ({ page }) => {
    await gotoStory(page, "without-cross");
    await expect(page).toHaveScreenshot("selected-item-without-cross.png");
  });

  test("truncated label", async ({ page }) => {
    await gotoStory(page, "truncated-label");
    await expect(page).toHaveScreenshot("selected-item-truncated-label.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("selected-item-css-customization.png");
  });
});

test.describe("SelectedItem — dark", () => {
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
    await expect(page).toHaveScreenshot("selected-item-default-dark.png");
  });

  test("all variants dark", async ({ page }) => {
    await gotoStory(page, "all-variants");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("selected-item-all-variants-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "selected-item-css-customization-dark.png",
    );
  });
});
