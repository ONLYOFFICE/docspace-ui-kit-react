import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Overlays/ModalDialog" → "ui-overlays-modaldialog"
const STORY_BASE = "ui-overlays-modaldialog";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("ModalDialog — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("modal-dialog-default.png");
  });

  test("aside display", async ({ page }) => {
    await gotoStory(page, "aside-display");
    await expect(page).toHaveScreenshot("modal-dialog-aside-display.png");
  });

  test("large modal", async ({ page }) => {
    await gotoStory(page, "large-modal");
    await expect(page).toHaveScreenshot("modal-dialog-large-modal.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("modal-dialog-css-customization.png");
  });
});

test.describe("ModalDialog — dark", () => {
  test("default dark", async ({ page }) => {
    await gotoStory(page, "default");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("modal-dialog-default-dark.png");
  });

  test("aside display dark", async ({ page }) => {
    await gotoStory(page, "aside-display");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("modal-dialog-aside-display-dark.png");
  });

  test("large modal dark", async ({ page }) => {
    await gotoStory(page, "large-modal");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("modal-dialog-large-modal-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("modal-dialog-css-customization-dark.png");
  });
});
