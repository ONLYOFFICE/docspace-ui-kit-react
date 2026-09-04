import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Navigation/Link"
// sanitize() lowercases and replaces spaces/slashes with dashes — no camelCase split for title segments
// → prefix: "ui-navigation-link" (Link → link)
const STORY_BASE = "ui-navigation-link";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  // Guard: Storybook returns 200 even for missing stories
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("Link — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("link-default.png");
  });

  test("page links", async ({ page }) => {
    await gotoStory(page, "page-links");
    await expect(page).toHaveScreenshot("link-page-links.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("link-css-customization.png");
  });
});

test.describe("Link — dark", () => {
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
    await expect(page).toHaveScreenshot("link-default-dark.png");
  });

  test("page links dark", async ({ page }) => {
    await gotoStory(page, "page-links");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("link-page-links-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("link-css-customization-dark.png");
  });
});
