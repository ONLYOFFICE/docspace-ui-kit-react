import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Form controls/EmailInput"
// → prefix: "ui-form-controls-emailinput"
const STORY_BASE = "ui-form-controls-emailinput";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("EmailInput — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("email-input-default.png");
  });

  test("states", async ({ page }) => {
    await gotoStory(page, "states");
    await expect(page).toHaveScreenshot("email-input-states.png");
  });

  test("automatic error state", async ({ page }) => {
    await gotoStory(page, "automatic-error-state");
    await expect(page).toHaveScreenshot(
      "email-input-automatic-error-state.png",
    );
  });

  test("accepted address forms", async ({ page }) => {
    await gotoStory(page, "accepted-address-forms");
    await expect(page).toHaveScreenshot(
      "email-input-accepted-address-forms.png",
    );
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("email-input-right-to-left.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("email-input-css-customization.png");
  });
});

test.describe("EmailInput — dark", () => {
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
    await expect(page).toHaveScreenshot("email-input-default-dark.png");
  });

  test("states dark", async ({ page }) => {
    await gotoStory(page, "states");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("email-input-states-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "email-input-css-customization-dark.png",
    );
  });
});
