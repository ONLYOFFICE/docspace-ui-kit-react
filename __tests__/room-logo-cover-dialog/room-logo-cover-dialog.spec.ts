import { type Page, expect, test } from "@playwright/test";

// Title: "RoomLogoCoverDialog"
const STORY_BASE = "ui-overlays-roomlogocoverdialog";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("RoomLogoCoverDialog -- light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("room-logo-cover-dialog-default.png");
  });

  test("with-preselected-cover", async ({ page }) => {
    await gotoStory(page, "with-preselected-cover");
    await expect(page).toHaveScreenshot(
      "room-logo-cover-dialog-preselected.png",
    );
  });

  test("initials-from-title", async ({ page }) => {
    await gotoStory(page, "initials-from-title");
    await expect(page).toHaveScreenshot(
      "room-logo-cover-dialog-initials-from-title.png",
    );
  });

  test("with-accent-colors", async ({ page }) => {
    await gotoStory(page, "with-accent-colors");
    await expect(page).toHaveScreenshot(
      "room-logo-cover-dialog-with-accent-colors.png",
    );
  });

  test("without-icon-picker", async ({ page }) => {
    await gotoStory(page, "without-icon-picker");
    await expect(page).toHaveScreenshot(
      "room-logo-cover-dialog-without-icon-picker.png",
    );
  });

  test("on-phone", async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 760 });
    await gotoStory(page, "on-phone");
    await expect(page).toHaveScreenshot("room-logo-cover-dialog-on-phone.png");
  });
});

test.describe("RoomLogoCoverDialog -- dark", () => {
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
    await expect(page).toHaveScreenshot(
      "room-logo-cover-dialog-default-dark.png",
    );
  });

  test("with-preselected-cover dark", async ({ page }) => {
    await gotoStory(page, "with-preselected-cover");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "room-logo-cover-dialog-preselected-dark.png",
    );
  });
});
