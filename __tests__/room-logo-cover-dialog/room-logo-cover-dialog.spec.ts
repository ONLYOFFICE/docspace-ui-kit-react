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
    await expect(page).toHaveScreenshot("room-logo-cover-dialog-preselected.png");
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
    await expect(page).toHaveScreenshot("room-logo-cover-dialog-default-dark.png");
  });

  test("with-preselected-cover dark", async ({ page }) => {
    await gotoStory(page, "with-preselected-cover");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("room-logo-cover-dialog-preselected-dark.png");
  });
});
