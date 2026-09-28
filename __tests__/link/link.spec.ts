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

  test("with text overflow", async ({ page }) => {
    await gotoStory(page, "with-text-overflow");
    await expect(page).toHaveScreenshot("link-with-text-overflow.png");
  });

  test("keyboard accessible action", async ({ page }) => {
    await gotoStory(page, "keyboard-accessible-action");
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: "Move to archive" }),
    ).toBeFocused();
    await expect(page).toHaveScreenshot("link-keyboard-accessible-action.png");
  });

  test("with tooltip", async ({ page }) => {
    await gotoStory(page, "with-tooltip");
    await page.getByTestId("link").hover();
    await expect(page.getByText("Opens the shared folder")).toBeVisible();
    await expect(page).toHaveScreenshot("link-with-tooltip.png");
  });

  test("custom color", async ({ page }) => {
    await gotoStory(page, "custom-color");
    await expect(page).toHaveScreenshot("link-custom-color.png");
  });

  test("text decorations", async ({ page }) => {
    await gotoStory(page, "text-decorations");
    await expect(page).toHaveScreenshot("link-text-decorations.png");
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
