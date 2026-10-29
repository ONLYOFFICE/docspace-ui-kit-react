import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Overlays/ModalDialog" → "ui-overlays-modaldialog"
const STORY_BASE = "ui-overlays-modaldialog";

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

test.describe("ModalDialog — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("modal-dialog-default.png");
  });

  test("aside display", async ({ page }) => {
    await gotoStory(page, "aside-display");
    await expect(page).toHaveScreenshot("modal-dialog-aside-display.png");
  });

  test("large modal", async ({ page }) => {
    await gotoStory(page, "large-modal");
    await expect(page).toHaveScreenshot("modal-dialog-large-modal.png");
  });

  test("css customization", async ({ page }) => {
    // The play function opens the restyled dialog, closes it and leaves the
    // restyled side panel open: that is the shot.
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("modal-dialog-css-customization.png");
  });
});

// A story whose play function opens the dialog is shot as play leaves it; the
// rest still start closed behind a trigger the test clicks.
test.describe("ModalDialog — new stories", () => {
  test("with back button", async ({ page }) => {
    await gotoStory(page, "with-back-button");
    await expect(page).toHaveScreenshot("modal-dialog-with-back-button.png");
  });

  test("backdrop click disabled", async ({ page }) => {
    await gotoStory(page, "backdrop-click-disabled");
    await page.getByRole("button", { name: "Show", exact: true }).click();
    await expect(page).toHaveScreenshot(
      "modal-dialog-backdrop-click-disabled.png",
    );
  });

  test("form dialog", async ({ page }) => {
    await gotoStory(page, "form-dialog");
    await page.getByRole("button", { name: "Show", exact: true }).click();
    await expect(page).toHaveScreenshot("modal-dialog-form-dialog.png");
  });

  test("two footer rows", async ({ page }) => {
    await gotoStory(page, "two-footer-rows");
    await expect(page).toHaveScreenshot("modal-dialog-two-footer-rows.png");
  });

  test("aside with container", async ({ page }) => {
    await gotoStory(page, "aside-with-container");
    // Play leaves the panel open on its first view; show the container.
    await page.getByRole("button", { name: "Open details" }).click();
    await expect(page).toHaveScreenshot(
      "modal-dialog-aside-with-container.png",
    );
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("modal-dialog-right-to-left.png");
  });
});

test.describe("ModalDialog — dark", () => {
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
    await expect(page).toHaveScreenshot("modal-dialog-default-dark.png");
  });

  test("aside display dark", async ({ page }) => {
    await gotoStory(page, "aside-display");
    await expect(page).toHaveScreenshot("modal-dialog-aside-display-dark.png");
  });

  test("large modal dark", async ({ page }) => {
    await gotoStory(page, "large-modal");
    await expect(page).toHaveScreenshot("modal-dialog-large-modal-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot(
      "modal-dialog-css-customization-dark.png",
    );
  });
});
