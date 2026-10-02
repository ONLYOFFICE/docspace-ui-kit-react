import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Data display/RoomType"
// → prefix: "ui-data-display-roomtype"
const STORY_BASE = "ui-data-display-roomtype";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("RoomType — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("room-type-default.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("room-type-css-customization.png");
  });

  test("dropdown button", async ({ page }) => {
    await gotoStory(page, "dropdown-button");
    await expect(page).toHaveScreenshot("room-type-dropdown-button.png");
  });

  test("dropdown item", async ({ page }) => {
    await gotoStory(page, "dropdown-item");
    await expect(page).toHaveScreenshot("room-type-dropdown-item.png");
  });

  test("room types", async ({ page }) => {
    await gotoStory(page, "room-types");
    await expect(page).toHaveScreenshot("room-type-room-types.png");
  });

  test("disabled state", async ({ page }) => {
    await gotoStory(page, "disabled-state");
    await expect(page).toHaveScreenshot("room-type-disabled-state.png");
  });

  test("from template", async ({ page }) => {
    await gotoStory(page, "from-template");
    await expect(page).toHaveScreenshot("room-type-from-template.png");
  });

  test("form space", async ({ page }) => {
    await gotoStory(page, "form-space");
    await expect(page).toHaveScreenshot("room-type-form-space.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("room-type-right-to-left.png");
  });
});

test.describe("RoomType — dark", () => {
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
    await expect(page).toHaveScreenshot("room-type-default-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("room-type-css-customization-dark.png");
  });
});
