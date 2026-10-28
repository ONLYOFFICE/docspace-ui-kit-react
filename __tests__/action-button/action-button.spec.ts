import { type Page, expect, test } from "@playwright/test";

// Title: "ActionButton"
const STORY_BASE = "ui-interactive-elements-actionbutton";

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

test.describe("ActionButton -- light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("action-button-default.png");
  });

  test("with-icon", async ({ page }) => {
    await gotoStory(page, "with-icon");
    await expect(page).toHaveScreenshot("action-button-with-icon.png");
  });

  test("disabled-state", async ({ page }) => {
    await gotoStory(page, "disabled-state");
    await expect(page).toHaveScreenshot("action-button-disabled-state.png");
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
