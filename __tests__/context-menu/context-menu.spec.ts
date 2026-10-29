import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Overlays/ContextMenu" → "ui-overlays-contextmenu"
const STORY_BASE = "ui-overlays-contextmenu";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  // Storybook answers 200 for an unknown id and shows its error display
  // instead of the story: fail on that now, not on a timeout further down.
  await page.waitForSelector("body.sb-show-main, body.sb-show-errordisplay", {
    state: "attached",
  });
  await expect(page.locator("body")).not.toHaveClass(/sb-show-errordisplay/);
  // Screenshot the end state: wait until the story's play function, if it
  // has one, is done (playDelay.ts runs it at full speed under Playwright).
  // Under load Storybook may render the story a second time and run play
  // again, so the render has to stay finished for a while, not just get there.
  await page.waitForFunction(
    () => {
      const w = window as {
        __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } };
        __settled?: { render: unknown; since: number };
      };
      const render = w.__STORYBOOK_PREVIEW__?.currentRender;
      if (render?.phase !== "finished") {
        w.__settled = undefined;
        return false;
      }
      if (w.__settled?.render !== render) {
        w.__settled = { render, since: performance.now() };
      }
      return performance.now() - w.__settled.since > 500;
    },
    undefined,
    { polling: 50 },
  );
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await page.waitForLoadState("networkidle");
  // A tooltip or menu the play function left open was placed before the
  // web font arrived, a pixel off where it lands once the text settles; have
  // it place itself again on the final layout. floating-ui's autoUpdate, which
  // react-tooltip uses, listens for scroll, not resize.
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.dispatchEvent(new Event("resize"));
    window.dispatchEvent(new Event("scroll"));
  });
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
  // The theme is set the way the dark-mode toolbar sets it, so the preview
  // decorator paints the story's surface and ThemeProvider themes it; a
  // class on <body> alone leaves a dark component on a white page.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "sb-addon-themes-3",
        JSON.stringify({ current: "dark" }),
      );
    });
  });

  test("default dark", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("context-menu-default-dark.png");
  });

  test("simple menu dark", async ({ page }) => {
    await gotoStory(page, "simple-menu");
    await expect(page).toHaveScreenshot("context-menu-simple-menu-dark.png");
  });

  test("with backdrop dark", async ({ page }) => {
    await gotoStory(page, "with-backdrop");
    await expect(page).toHaveScreenshot("context-menu-with-backdrop-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
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
  // The story's play function opens the sheet itself, and its backdrop then
  // swallows a click on the trigger; click only while the sheet is shut, and
  // retry, since the play function may still be on its way to opening it.
  const menu = page.locator(".p-contextmenu").first();
  await expect(async () => {
    if (!(await menu.isVisible())) {
      await page.click('[data-testid="trigger"]', { timeout: 1000 });
    }
    await expect(menu).toBeVisible({ timeout: 1000 });
  }).toPass();
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

  test("anchored to element", async ({ page }) => {
    await gotoStory(page, "anchored-to-element");
    await page.click('[data-testid="trigger"]');
    await page.locator(".p-contextmenu").first().waitFor({ state: "visible" });
    await expect(page).toHaveScreenshot("context-menu-anchored-to-element.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await openMenu(page);
    await expect(page).toHaveScreenshot("context-menu-right-to-left.png");
  });
});

test.describe("ContextMenu — item variants (dark)", () => {
  // The theme is set the way the dark-mode toolbar sets it, so the preview
  // decorator paints the story's surface and ThemeProvider themes it; a
  // class on <body> alone leaves a dark component on a white page.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "sb-addon-themes-3",
        JSON.stringify({ current: "dark" }),
      );
    });
  });

  test("with item descriptions dark", async ({ page }) => {
    await gotoStory(page, "with-item-descriptions");
    const menu = await openMenu(page);
    await expect(menu).toHaveScreenshot(
      "context-menu-with-item-descriptions-dark.png",
    );
  });

  test("item variants dark", async ({ page }) => {
    await gotoStory(page, "item-variants");
    const menu = await openMenu(page);
    await expect(menu).toHaveScreenshot("context-menu-item-variants-dark.png");
  });

  test("max height dark", async ({ page }) => {
    await gotoStory(page, "max-height");
    const menu = await openMenu(page);
    await expect(menu).toHaveScreenshot("context-menu-max-height-dark.png");
  });

  test("mobile with header dark", async ({ page }) => {
    await openMobileMenu(page, "mobile-with-header");
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
