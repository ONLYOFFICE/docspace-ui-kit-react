import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Overlays/ContextMenu" → "ui-overlays-contextmenu"
const STORY_BASE = "ui-overlays-contextmenu";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("ContextMenu — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("context-menu-default.png");
  });

  test("simple menu", async ({ page }) => {
    await gotoStory(page, "simple-menu");
    await expect(page).toHaveScreenshot("context-menu-simple-menu.png");
  });

  test("with backdrop", async ({ page }) => {
    await gotoStory(page, "with-backdrop");
    await expect(page).toHaveScreenshot("context-menu-with-backdrop.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.click('[data-testid="trigger"]', { button: "right" });
    const menu = page.locator(".p-contextmenu").first();
    await menu.waitFor({ state: "visible" });
    await expect(menu).toHaveScreenshot("context-menu-css-customization.png");
  });
});

test.describe("ContextMenu — dark", () => {
  test("default dark", async ({ page }) => {
    await gotoStory(page, "default");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("context-menu-default-dark.png");
  });

  test("simple menu dark", async ({ page }) => {
    await gotoStory(page, "simple-menu");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("context-menu-simple-menu-dark.png");
  });

  test("with backdrop dark", async ({ page }) => {
    await gotoStory(page, "with-backdrop");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("context-menu-with-backdrop-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await page.click('[data-testid="trigger"]', { button: "right" });
    const menu = page.locator(".p-contextmenu").first();
    await menu.waitFor({ state: "visible" });
    await expect(menu).toHaveScreenshot(
      "context-menu-css-customization-dark.png",
    );
  });
});
