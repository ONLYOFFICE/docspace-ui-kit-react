import { type Page, expect, test } from "@playwright/test";

// Title: "TwoStateToggle"
const STORY_BASE = "ui-navigation-twostatetoggle";

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

test.describe("TwoStateToggle -- light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("two-state-toggle-default.png");
  });

  test("custom-labels", async ({ page }) => {
    await gotoStory(page, "custom-labels");
    await expect(page).toHaveScreenshot("two-state-toggle-custom-labels.png");
  });

  test("right-to-left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("two-state-toggle-right-to-left.png");
  });

  test("css-customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot(
      "two-state-toggle-css-customization.png",
    );
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
