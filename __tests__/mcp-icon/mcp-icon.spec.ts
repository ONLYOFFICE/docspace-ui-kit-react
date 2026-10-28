import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Data display/MCPIcon"
// → prefix: "ui-data-display-mcpicon"
const STORY_BASE = "ui-data-display-mcpicon";

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

test.describe("MCPIcon — light", () => {
  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("mcp-icon-css-customization.png");
  });

  test("broken image fallback", async ({ page }) => {
    await gotoStory(page, "broken-image-fallback");
    await expect(page).toHaveScreenshot("mcp-icon-broken-image-fallback.png");
  });

  test("with image node", async ({ page }) => {
    await gotoStory(page, "with-image-node");
    await expect(page).toHaveScreenshot("mcp-icon-with-image-node.png");
  });
});

test.describe("MCPIcon — dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("mcp-icon-css-customization-dark.png");
  });
});
