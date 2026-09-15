import { type Page, expect, test } from "@playwright/test";

// Title: "AvatarEditorDialog"
const STORY_BASE = "ui-overlays-avatareditordialog";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("AvatarEditorDialog -- light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("avatar-editor-dialog-default.png");
  });

  test("square-crop", async ({ page }) => {
    await gotoStory(page, "square-crop");
    await expect(page).toHaveScreenshot("avatar-editor-dialog-square-crop.png");
  });
});

test.describe("AvatarEditorDialog -- dark", () => {
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
    await expect(page).toHaveScreenshot("avatar-editor-dialog-default-dark.png");
  });

  test("square-crop dark", async ({ page }) => {
    await gotoStory(page, "square-crop");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("avatar-editor-dialog-square-crop-dark.png");
  });
});
