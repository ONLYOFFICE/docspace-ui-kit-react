import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Interactive elements/AddButton"
// → prefix: "ui-interactive-elements-addbutton"
const STORY_BASE = "ui-interactive-elements-addbutton";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("AddButton — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("add-button-default.png");
  });

  test("disabled states", async ({ page }) => {
    await gotoStory(page, "disabled-states");
    await expect(page).toHaveScreenshot("add-button-disabled-states.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("add-button-css-customization.png");
  });
});

test.describe("AddButton — dark", () => {
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
    await expect(page).toHaveScreenshot("add-button-default-dark.png");
  });

  test("disabled states dark", async ({ page }) => {
    await gotoStory(page, "disabled-states");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("add-button-disabled-states-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("add-button-css-customization-dark.png");
  });
});
