import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Feedback/StatusMessage"
// → prefix: "ui-feedback-statusmessage"
const STORY_BASE = "ui-feedback-statusmessage";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("StatusMessage — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("status-message-default.png");
  });

  test("warning message", async ({ page }) => {
    await gotoStory(page, "warning-message");
    await expect(page).toHaveScreenshot("status-message-warning-message.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("status-message-css-customization.png");
  });
});

test.describe("StatusMessage — dark", () => {
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
    await expect(page).toHaveScreenshot("status-message-default-dark.png");
  });

  test("warning message dark", async ({ page }) => {
    await gotoStory(page, "warning-message");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "status-message-warning-message-dark.png",
    );
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "status-message-css-customization-dark.png",
    );
  });
});
