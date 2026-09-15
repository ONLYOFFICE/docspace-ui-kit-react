import { type Page, expect, test } from "@playwright/test";

// Title: "CollapsibleCard"
const STORY_BASE = "ui-data-display-collapsiblecard";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("CollapsibleCard -- light", () => {
  test("collapsed", async ({ page }) => {
    await gotoStory(page, "collapsed");
    await expect(page).toHaveScreenshot("collapsible-card-collapsed.png");
  });

  test("expanded", async ({ page }) => {
    await gotoStory(page, "expanded");
    await expect(page).toHaveScreenshot("collapsible-card-expanded.png");
  });
});

test.describe("CollapsibleCard -- dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("collapsed dark", async ({ page }) => {
    await gotoStory(page, "collapsed");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("collapsible-card-collapsed-dark.png");
  });

  test("expanded dark", async ({ page }) => {
    await gotoStory(page, "expanded");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("collapsible-card-expanded-dark.png");
  });
});
