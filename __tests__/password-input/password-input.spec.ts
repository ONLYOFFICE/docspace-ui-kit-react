import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Form controls/PasswordInput"
// → prefix: "ui-form-controls-passwordinput"
const STORY_BASE = "ui-form-controls-passwordinput";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("PasswordInput — light", () => {
  test("simple view", async ({ page }) => {
    await gotoStory(page, "simple-view");
    await expect(page).toHaveScreenshot("password-input-simple-view.png");
  });

  test("states", async ({ page }) => {
    await gotoStory(page, "states");
    await expect(page).toHaveScreenshot("password-input-states.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("password-input-css-customization.png");
  });
});

test.describe("PasswordInput — dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("simple view dark", async ({ page }) => {
    await gotoStory(page, "simple-view");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("password-input-simple-view-dark.png");
  });

  test("states dark", async ({ page }) => {
    await gotoStory(page, "states");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("password-input-states-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "password-input-css-customization-dark.png",
    );
  });
});
