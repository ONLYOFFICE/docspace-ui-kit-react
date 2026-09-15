import { type Page, expect, test } from "@playwright/test";

// Title: "ActionButton"
const STORY_BASE = "ui-interactive-elements-actionbutton";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("ActionButton -- light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("action-button-default.png");
  });

  test("with-icon", async ({ page }) => {
    await gotoStory(page, "with-icon");
    await expect(page).toHaveScreenshot("action-button-with-icon.png");
  });
});

test.describe("ActionButton -- dark", () => {
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
    await expect(page).toHaveScreenshot("action-button-default-dark.png");
  });

  test("with-icon dark", async ({ page }) => {
    await gotoStory(page, "with-icon");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("action-button-with-icon-dark.png");
  });
});
