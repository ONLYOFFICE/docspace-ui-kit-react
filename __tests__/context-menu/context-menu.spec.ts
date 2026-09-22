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

async function openMenu(page: Page) {
  await page.click('[data-testid="trigger"]', { button: "right" });
  const menu = page.locator(".p-contextmenu").first();
  await menu.waitFor({ state: "visible" });
  return menu;
}

const MOBILE_VIEWPORT = { width: 320, height: 568 };

async function openMobileMenu(page: Page, storyId: string) {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await gotoStory(page, storyId);
  await page.click('[data-testid="trigger"]');
  await page.locator(".p-contextmenu").first().waitFor({ state: "visible" });
}

test.describe("ContextMenu — item variants (light)", () => {
  test("with item descriptions", async ({ page }) => {
    await gotoStory(page, "with-item-descriptions");
    const menu = await openMenu(page);
    await expect(menu).toHaveScreenshot(
      "context-menu-with-item-descriptions.png",
    );
  });

  test("item variants", async ({ page }) => {
    await gotoStory(page, "item-variants");
    const menu = await openMenu(page);
    await expect(menu).toHaveScreenshot("context-menu-item-variants.png");
  });

  test("max height", async ({ page }) => {
    await gotoStory(page, "max-height");
    const menu = await openMenu(page);
    await expect(menu).toHaveScreenshot("context-menu-max-height.png");
  });

  test("mobile with header", async ({ page }) => {
    await openMobileMenu(page, "mobile-with-header");
    await expect(page).toHaveScreenshot("context-menu-mobile-with-header.png");
  });

  test("mobile with avatar header", async ({ page }) => {
    await openMobileMenu(page, "mobile-with-avatar-header");
    await expect(page).toHaveScreenshot(
      "context-menu-mobile-with-avatar-header.png",
    );
  });
});

test.describe("ContextMenu — item variants (dark)", () => {
  test("with item descriptions dark", async ({ page }) => {
    await gotoStory(page, "with-item-descriptions");
    await page.evaluate(() => document.body.classList.add("dark"));
    const menu = await openMenu(page);
    await expect(menu).toHaveScreenshot(
      "context-menu-with-item-descriptions-dark.png",
    );
  });

  test("item variants dark", async ({ page }) => {
    await gotoStory(page, "item-variants");
    await page.evaluate(() => document.body.classList.add("dark"));
    const menu = await openMenu(page);
    await expect(menu).toHaveScreenshot("context-menu-item-variants-dark.png");
  });

  test("max height dark", async ({ page }) => {
    await gotoStory(page, "max-height");
    await page.evaluate(() => document.body.classList.add("dark"));
    const menu = await openMenu(page);
    await expect(menu).toHaveScreenshot("context-menu-max-height-dark.png");
  });

  test("mobile with header dark", async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await gotoStory(page, "mobile-with-header");
    await page.evaluate(() => document.body.classList.add("dark"));
    await page.click('[data-testid="trigger"]');
    await page.locator(".p-contextmenu").first().waitFor({ state: "visible" });
    await expect(page).toHaveScreenshot(
      "context-menu-mobile-with-header-dark.png",
    );
  });
});

// the Docs page is the only Storybook page where the document itself scrolls
test.describe("ContextMenu — scrolled document", () => {
  const PRIMARY_TRIGGER =
    '#story--ui-overlays-contextmenu--default--primary-inner [data-testid="trigger"]';

  test.use({ viewport: { width: 1440, height: 700 } });

  test("opens next to the pointer and stays inside the viewport", async ({
    page,
  }) => {
    await page.goto(`/iframe.html?id=${STORY_BASE}--docs&viewMode=docs`);
    const trigger = page.locator(PRIMARY_TRIGGER);
    await trigger.waitFor({ state: "visible" });
    await page.waitForLoadState("networkidle");

    await trigger.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      document.scrollingElement!.scrollTop +=
        rect.top - (window.innerHeight - rect.height - 40);
    });
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);

    await trigger.click({ button: "right" });
    const menu = page.locator(".p-contextmenu").first();
    await menu.waitFor({ state: "visible" });

    const box = (await menu.boundingBox())!;
    const pointer = (await trigger.boundingBox())!;
    const pointerY = pointer.y + pointer.height / 2;
    const viewportHeight = page.viewportSize()!.height;

    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(viewportHeight);
    const gap = Math.min(
      Math.abs(box.y - pointerY),
      Math.abs(box.y + box.height - pointerY),
    );
    expect(gap).toBeLessThan(8);
  });

  test("arrow keys move the highlight without scrolling the page", async ({
    page,
  }) => {
    await page.goto(`/iframe.html?id=${STORY_BASE}--docs&viewMode=docs`);
    const trigger = page.locator(PRIMARY_TRIGGER);
    await trigger.waitFor({ state: "visible" });
    await trigger.click({ button: "right" });
    await page.locator(".p-contextmenu").first().waitFor({ state: "visible" });

    await page.getByRole("menuitem", { name: "Edit" }).hover();
    await page.mouse.move(1, 1);

    const before = await page.evaluate(() => window.scrollY);
    const focused = page.locator('[data-focused="true"]');
    await expect(focused).toHaveText("Edit");

    // one key per render: the listener reads the highlight from its own render
    await page.keyboard.press("ArrowDown");
    await expect(focused).toHaveText("Preview");
    await page.keyboard.press("ArrowDown");
    await expect(focused).toHaveText("Sharing settings");

    expect(await page.evaluate(() => window.scrollY)).toBe(before);
  });
});
