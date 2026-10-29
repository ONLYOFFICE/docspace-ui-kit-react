import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Navigation/Filter"
// → prefix: "ui-navigation-filter"
const STORY_BASE = "ui-navigation-filter";

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

test.describe("Filter — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("filter-default.png");
  });

  test("with filter chips", async ({ page }) => {
    await gotoStory(page, "with-filter-chips");
    await expect(page).toHaveScreenshot("filter-with-filter-chips.png");
  });

  test("panel option kinds", async ({ page }) => {
    await gotoStory(page, "panel-option-kinds");
    // The play function ticks a checkbox and applies, which closes the panel:
    // open it again on the applied filter. FilterBlock's `data-testid` never
    // reaches the DOM (ModalDialog takes `dataTestId`), so wait by role.
    await page.getByTestId("filter_icon_button").click();
    await page.getByRole("dialog").waitFor();
    await expect(page).toHaveScreenshot("filter-panel-option-kinds.png");
  });

  test("sort menu on tablet", async ({ page }) => {
    await gotoStory(page, "sort-menu-on-tablet");
    // The story opens the menu on mount and its play function picks a field,
    // which may close it: open it again if so.
    const option = page.getByTestId("filter_sort_option_AZ");
    if (!(await option.isVisible())) {
      await page.getByTestId("filter_sort_button").click();
    }
    await option.waitFor();
    await expect(page).toHaveScreenshot("filter-sort-menu-on-tablet.png");
  });

  test("with grouping row", async ({ page }) => {
    await gotoStory(page, "with-grouping-row");
    await page.waitForSelector('[data-testid="rooms_groups_overflow_trigger"]');
    await expect(page).toHaveScreenshot("filter-with-grouping-row.png");
  });

  test("with main button", async ({ page }) => {
    await gotoStory(page, "with-main-button");
    await expect(page).toHaveScreenshot("filter-with-main-button.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("filter-right-to-left.png");
  });

  test("disabled filter", async ({ page }) => {
    await gotoStory(page, "disabled-filter");
    await expect(page).toHaveScreenshot("filter-disabled.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("filter-css-customization.png");
  });
});

test.describe("Filter — dark", () => {
  test.beforeEach(async ({ page }) => {
    // The theme is set the way the dark-mode toolbar sets it, so the preview
    // decorator paints the story's surface and ThemeProvider themes it; a
    // class on <body> alone leaves a dark component on a white page.
    await page.addInitScript(() => {
      localStorage.setItem(
        "sb-addon-themes-3",
        JSON.stringify({ current: "dark" }),
      );
    });
  });

  test("disabled filter dark", async ({ page }) => {
    await gotoStory(page, "disabled-filter");
    await expect(page).toHaveScreenshot("filter-disabled-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("filter-css-customization-dark.png");
  });
});
