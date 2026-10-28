import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Overlays/Tooltip" → "ui-overlays-tooltip"
const STORY_BASE = "ui-overlays-tooltip";

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

test.describe("Tooltip — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("tooltip-default.png");
  });

  test("custom styling", async ({ page }) => {
    await gotoStory(page, "custom-styling");
    await expect(page).toHaveScreenshot("tooltip-custom-styling.png");
  });

  test("shared by many anchors", async ({ page }) => {
    await gotoStory(page, "shared-by-many-anchors");
    await expect(page).toHaveScreenshot("tooltip-shared-by-many-anchors.png");
  });

  test("fixed content", async ({ page }) => {
    await gotoStory(page, "fixed-content");
    await expect(page).toHaveScreenshot("tooltip-fixed-content.png");
  });

  test("anchored by selector", async ({ page }) => {
    await gotoStory(page, "anchored-by-selector");
    await expect(page).toHaveScreenshot("tooltip-anchored-by-selector.png");
  });

  test("clickable content", async ({ page }) => {
    await gotoStory(page, "clickable-content");
    await expect(page).toHaveScreenshot("tooltip-clickable-content.png");
  });

  test("delayed appearance", async ({ page }) => {
    await gotoStory(page, "delayed-appearance");
    await expect(page).toHaveScreenshot("tooltip-delayed-appearance.png");
  });

  test("controlled open", async ({ page }) => {
    await gotoStory(page, "controlled-open");
    await expect(page).toHaveScreenshot("tooltip-controlled-open.png");
  });

  test("opened from code", async ({ page }) => {
    await gotoStory(page, "opened-from-code");
    await expect(page).toHaveScreenshot("tooltip-opened-from-code.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    // The story only renders the anchor -- react-tooltip mounts the bubble on
    // hover, so without this the locator below waits for something that never
    // appears.
    await page.getByText("Hover to see custom tooltip").hover();
    const tooltip = page.locator(".__react_component_tooltip").first();
    await tooltip.waitFor({ state: "visible" });
    // Compare only the tooltip element to avoid full-page position flakiness
    await expect(tooltip).toHaveScreenshot("tooltip-css-customization.png");
  });
});

test.describe("Tooltip — dark", () => {
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
    await expect(page).toHaveScreenshot("tooltip-default-dark.png");
  });

  test("custom styling dark", async ({ page }) => {
    await gotoStory(page, "custom-styling");
    await expect(page).toHaveScreenshot("tooltip-custom-styling-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.getByText("Hover to see custom tooltip").hover();
    const tooltip = page.locator(".__react_component_tooltip").first();
    await tooltip.waitFor({ state: "visible" });
    // Compare only the tooltip element to avoid full-page position flakiness
    await expect(tooltip).toHaveScreenshot(
      "tooltip-css-customization-dark.png",
    );
  });
});
