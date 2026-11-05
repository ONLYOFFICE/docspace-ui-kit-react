import { type Page, expect, test } from "@playwright/test";

// The group menu and its item have a Storybook title each:
//   "UI/Data display/TableGroupMenu" -> "ui-data-display-tablegroupmenu"
//   "UI/Data display/GroupMenuItem"  -> "ui-data-display-groupmenuitem"
// The screenshots keep the names they had when both were part of Table.
const BASE = {
  groupMenu: "ui-data-display-tablegroupmenu",
  groupMenuItem: "ui-data-display-groupmenuitem",
} as const;

async function gotoStory(page: Page, base: string, storyId: string) {
  const url = `/iframe.html?id=${base}--${storyId}&viewMode=story`;
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

type Case = { name: string; base: string; story: string; shot: string };

const CASES: Case[] = [
  {
    name: "group menu",
    base: BASE.groupMenu,
    story: "default",
    shot: "table-group-menu",
  },
  {
    name: "group menu indeterminate",
    base: BASE.groupMenu,
    story: "indeterminate",
    shot: "table-group-menu-indeterminate",
  },
  {
    name: "group menu info panel open",
    base: BASE.groupMenu,
    story: "info-panel-open",
    shot: "table-group-menu-info-panel-open",
  },
  {
    name: "group menu right to left",
    base: BASE.groupMenu,
    story: "right-to-left",
    shot: "table-group-menu-right-to-left",
  },
  {
    name: "group menu css customization",
    base: BASE.groupMenu,
    story: "css-customization",
    shot: "table-group-menu-css-customization",
  },
  {
    name: "group menu item",
    base: BASE.groupMenuItem,
    story: "default",
    shot: "table-group-menu-item",
  },
  {
    name: "group menu item with dropdown",
    base: BASE.groupMenuItem,
    story: "with-dropdown",
    shot: "table-group-menu-item-with-dropdown",
  },
];

test.describe("TableGroupMenu — light", () => {
  for (const { name, base, story, shot } of CASES) {
    test(name, async ({ page }) => {
      await gotoStory(page, base, story);
      await expect(page).toHaveScreenshot(`${shot}.png`);
    });
  }
});

test.describe("TableGroupMenu — dark", () => {
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

  for (const { name, base, story, shot } of CASES) {
    test(`${name} dark`, async ({ page }) => {
      await gotoStory(page, base, story);
      await expect(page).toHaveScreenshot(`${shot}-dark.png`);
    });
  }
});
