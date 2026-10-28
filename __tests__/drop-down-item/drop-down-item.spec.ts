import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Overlays/DropDownItem"
// → prefix: "ui-overlays-dropdownitem"
const STORY_BASE = "ui-overlays-dropdownitem";

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

test.describe("DropDownItem — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("drop-down-item-default.png");
  });

  test("item types", async ({ page }) => {
    await gotoStory(page, "item-types");
    await expect(page).toHaveScreenshot("drop-down-item-item-types.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("drop-down-item-css-customization.png");
  });

  test("with external link", async ({ page }) => {
    await gotoStory(page, "with-external-link");
    await expect(page).toHaveScreenshot(
      "drop-down-item-with-external-link.png",
    );
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("drop-down-item-right-to-left.png");
  });
});

test.describe("DropDownItem — dark", () => {
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
    await expect(page).toHaveScreenshot("drop-down-item-default-dark.png");
  });

  test("item types dark", async ({ page }) => {
    await gotoStory(page, "item-types");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("drop-down-item-item-types-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "drop-down-item-css-customization-dark.png",
    );
  });
});
