import { type Page, expect, test } from "@playwright/test";

// Title: "TwoStateToggle"
const STORY_BASE = "ui-navigation-twostatetoggle";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("TwoStateToggle -- light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("two-state-toggle-default.png");
  });

  test("custom-labels", async ({ page }) => {
    await gotoStory(page, "custom-labels");
    await expect(page).toHaveScreenshot("two-state-toggle-custom-labels.png");
  });
});

test.describe("TwoStateToggle -- dark", () => {
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
    await expect(page).toHaveScreenshot("two-state-toggle-default-dark.png");
  });

  test("custom-labels dark", async ({ page }) => {
    await gotoStory(page, "custom-labels");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "two-state-toggle-custom-labels-dark.png",
    );
  });
});
