import { type Page, expect, test } from "@playwright/test";

// Title: "Card"
const STORY_BASE = "ui-data-display-card";

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

test.describe("Card -- light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("card-default.png");
  });

  test("with-extra", async ({ page }) => {
    await gotoStory(page, "with-extra");
    await expect(page).toHaveScreenshot("card-with-extra.png");
  });

  test("css-customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("card-css-customization.png");
  });
});

test.describe("Card -- dark", () => {
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
    await expect(page).toHaveScreenshot("card-default-dark.png");
  });

  test("with-extra dark", async ({ page }) => {
    await gotoStory(page, "with-extra");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("card-with-extra-dark.png");
  });
});
