import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Navigation/Paging"
// → prefix: "ui-navigation-paging"
const STORY_BASE = "ui-navigation-paging";

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

test.describe("Paging — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("paging-default.png");
  });

  test("disabled previous", async ({ page }) => {
    await gotoStory(page, "disabled-previous");
    await expect(page).toHaveScreenshot("paging-disabled-previous.png");
  });

  test("single page", async ({ page }) => {
    await gotoStory(page, "single-page");
    await expect(page).toHaveScreenshot("paging-single-page.png");
  });

  test("buttons only", async ({ page }) => {
    await gotoStory(page, "buttons-only");
    await expect(page).toHaveScreenshot("paging-buttons-only.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("paging-css-customization.png");
  });
});

test.describe("Paging — dark", () => {
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
    await expect(page).toHaveScreenshot("paging-default-dark.png");
  });

  test("disabled previous dark", async ({ page }) => {
    await gotoStory(page, "disabled-previous");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("paging-disabled-previous-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("paging-css-customization-dark.png");
  });
});
