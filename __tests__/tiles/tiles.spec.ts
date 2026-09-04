import { type Page, expect, test } from "@playwright/test";

const COMPONENTS = [
  { id: "ui-tiles-basetile", name: "base-tile" },
  { id: "ui-tiles-filetile", name: "file-tile" },
  { id: "ui-tiles-foldertile", name: "folder-tile" },
  { id: "ui-tiles-roomtile", name: "room-tile" },
  { id: "ui-tiles-templatetile", name: "template-tile" },
  { id: "ui-tiles-tilecontainer", name: "tile-container" },
  { id: "ui-tiles-tilecontent", name: "tile-content" },
];

async function gotoStory(page: Page, storyBase: string, storyId: string) {
  const url = `/iframe.html?id=${storyBase}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

for (const { id, name } of COMPONENTS) {
  test.describe(`${name} — light`, () => {
    test("default", async ({ page }) => {
      await gotoStory(page, id, "default");
      await expect(page).toHaveScreenshot(`${name}-default.png`);
    });

    test("css customization", async ({ page }) => {
      await gotoStory(page, id, "css-customization");
      await expect(page).toHaveScreenshot(`${name}-css-customization.png`);
    });
  });

  test.describe(`${name} — dark`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        document.addEventListener("DOMContentLoaded", () => {
          document.body.classList.add("dark");
        });
      });
    });

    test("default dark", async ({ page }) => {
      await gotoStory(page, id, "default");
      await page.evaluate(() => document.body.classList.add("dark"));
      await expect(page).toHaveScreenshot(`${name}-default-dark.png`);
    });

    test("css customization dark", async ({ page }) => {
      await gotoStory(page, id, "css-customization");
      await page.evaluate(() => document.body.classList.add("dark"));
      await expect(page).toHaveScreenshot(`${name}-css-customization-dark.png`);
    });
  });
}
