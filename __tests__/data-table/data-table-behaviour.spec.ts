import { type Page, expect, test } from "@playwright/test";

import {
  dragEdge,
  expectAligned,
  expectNoHorizontalOverflow,
  gotoStory,
  headerWidths,
  renderedColumns,
  shares,
  storedRecord,
  tableOf,
} from "./data-table.helpers";

const ALL = ["Name", "Author", "Modified", "Size", "Type", "Settings"];
// The settings column, Name at 210 px and four columns at 110 px.
const COMPACT_BELOW = 24 + 210 + 4 * 110;

test.describe("DataTable — a small screen", () => {
  test("turns compact exactly below the minimums, and comes back as it was", async ({
    page,
  }) => {
    await gotoStory(page, "default");
    const table = tableOf(page);
    const before = await shares(table);

    // Everything around the table is fixed padding, so the window width that
    // gives the table a given width is that width plus the difference.
    const viewport = page.viewportSize();
    if (!viewport) throw new Error("no viewport");
    const box = await table.boundingBox();
    if (!box) throw new Error("no table");
    const around = viewport.width - box.width;

    await page.setViewportSize({
      width: Math.ceil(COMPACT_BELOW + around),
      height: viewport.height,
    });
    await expect.poll(() => renderedColumns(table)).toEqual(ALL);
    await expectNoHorizontalOverflow(page);

    await page.setViewportSize({
      width: Math.ceil(COMPACT_BELOW + around) - 2,
      height: viewport.height,
    });
    await expect
      .poll(() => renderedColumns(table))
      .toEqual(["Name", "Settings"]);
    await expect(
      table.getByTestId("data-table-settings-button"),
    ).toBeDisabled();
    await expect(table.getByRole("separator")).toHaveCount(0);
    await expectAligned(table);
    await expectNoHorizontalOverflow(page);

    await page.setViewportSize(viewport);
    await expect.poll(() => renderedColumns(table)).toEqual(ALL);
    expect(await shares(table)).toEqual(before);
    await expectAligned(table);
  });
});

test.describe("DataTable — the info panel", () => {
  const KEY = "storybook-data-table-info-panel";

  test("narrows the table without changing its proportions or its record", async ({
    page,
  }) => {
    await gotoStory(page, "with-info-panel");
    const table = tableOf(page);

    await dragEdge(page, table, "Name", 80);
    const record = await storedRecord(page, KEY);
    const before = await shares(table);
    const grid = () =>
      table.evaluate((el) => el.style.getPropertyValue("--data-table-grid"));
    const gridBefore = await grid();
    const width = (await headerWidths(table)).Name;

    await page.getByRole("button", { name: "Open the info panel" }).click();
    await expect
      .poll(async () => (await headerWidths(table)).Name)
      .toBeLessThan(width);

    expect(await shares(table)).toEqual(before);
    await expectAligned(table);
    expect(await storedRecord(page, KEY)).toEqual(record);

    await page.getByRole("button", { name: "Close the info panel" }).click();
    await expect.poll(grid).toBe(gridBefore);
    expect(await storedRecord(page, KEY)).toEqual(record);
  });

  test("turns a narrow table compact while it is open", async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 900 });
    await gotoStory(page, "with-info-panel");
    const table = tableOf(page);

    await page.getByRole("button", { name: "Open the info panel" }).click();
    await expect
      .poll(() => renderedColumns(table))
      .toEqual(["Name", "Settings"]);
    await expectNoHorizontalOverflow(page);

    await page.getByRole("button", { name: "Close the info panel" }).click();
    await expect.poll(() => renderedColumns(table)).toEqual(ALL);
  });
});

const loadStatus = async (page: Page) => {
  const text = (await page.getByTestId("load-status").textContent()) ?? "";
  const [, loaded, requests] = text.match(/(\d+) of \d+ loaded, (\d+)/) ?? [];
  return { loaded: Number(loaded), requests: Number(requests) };
};

const domRows = (page: Page) =>
  page.evaluate(() => ({
    rows: document.querySelectorAll('[data-testid="data-table-row"]').length,
    skeletons: document.querySelectorAll(
      '[data-testid="data-table-skeleton-row"]',
    ).length,
  }));

const scrollTo = (page: Page, top: number | "end") =>
  page.getByTestId("scroller").evaluate((el, to) => {
    el.scrollTop = to === "end" ? el.scrollHeight : to;
  }, top);

test.describe("DataTable — loading more as the list scrolls", () => {
  test("asks once per page, however often the scroller fires", async ({
    page,
  }) => {
    await gotoStory(page, "infinite-scroll");
    // The story's play function has loaded the second page.
    await expect
      .poll(() => loadStatus(page))
      .toEqual({
        loaded: 200,
        requests: 1,
      });

    // Twenty scroll events at the end, in one go, so all of them land within
    // one request's flight (600 ms) however loaded the machine is.
    await page.getByTestId("scroller").evaluate((el) => {
      for (let i = 0; i < 20; i += 1) {
        el.scrollTop = el.scrollHeight;
        el.dispatchEvent(new Event("scroll"));
      }
    });
    await expect
      .poll(async () => (await domRows(page)).skeletons)
      .toBeGreaterThan(0);
    await expect(page.getByTestId("data-table-body")).toHaveAttribute(
      "aria-busy",
      "true",
    );

    await expect
      .poll(() => loadStatus(page))
      .toEqual({
        loaded: 300,
        requests: 2,
      });

    // The view is now 100 rows from the end: nothing more is asked for.
    await page.waitForTimeout(1500);
    expect(await loadStatus(page)).toEqual({ loaded: 300, requests: 2 });
  });

  test("loads every page to the end, then stops", async ({ page }) => {
    test.setTimeout(90_000);
    await gotoStory(page, "infinite-scroll");

    for (let i = 0; i < 20; i += 1) {
      await scrollTo(page, "end");
      await page.waitForTimeout(700);
      const { rows } = await domRows(page);
      expect(rows, "rows in the DOM").toBeLessThan(40);
      if ((await loadStatus(page)).loaded === 1000) break;
    }

    await scrollTo(page, "end");
    await page.waitForTimeout(800);
    expect(await loadStatus(page)).toEqual({ loaded: 1000, requests: 9 });
    expect((await domRows(page)).skeletons).toBe(0);
    await expect(page.getByText("Scan 01000.pdf")).toBeVisible();
  });
});

test.describe("DataTable — a long virtualised list", () => {
  test("keeps the DOM small anywhere in 10 000 rows", async ({ page }) => {
    await gotoStory(page, "virtualized");

    for (const top of [0, 12_345, 240_000, 479_000, "end" as const]) {
      await scrollTo(page, top);
      await page.waitForTimeout(350);
      const { rows } = await domRows(page);
      expect(rows).toBeGreaterThan(5);
      expect(rows).toBeLessThan(40);
    }
    await expect(page.getByText("Scan 10000.pdf")).toBeVisible();
  });

  test("brings a row to just under the header", async ({ page }) => {
    await gotoStory(page, "virtualized");
    await scrollTo(page, 0);

    await page.getByRole("button", { name: "Go to row 5000" }).click();
    await page.waitForTimeout(300);

    const underHeader = await page.evaluate(() => {
      const header = document
        .querySelector('[data-testid="data-table-header"]')
        ?.getBoundingClientRect();
      if (!header) return null;
      return document
        .elementFromPoint(header.left + 40, header.bottom + 10)
        ?.closest('[role="row"]')
        ?.querySelector('[role="cell"]')?.textContent;
    });
    expect(underHeader).toBe("Scan 05000.pdf");
  });

  test("draws skeleton rows during a fling, then the rows", async ({
    page,
  }) => {
    await gotoStory(page, "virtualized");
    await scrollTo(page, 0);
    await page.waitForTimeout(300);

    await scrollTo(page, 50_000);
    await expect
      .poll(() => domRows(page), { timeout: 150 })
      .toMatchObject({ rows: 0 });
    expect((await domRows(page)).skeletons).toBeGreaterThan(5);
    await expectAligned(tableOf(page));

    await expect.poll(() => domRows(page)).toMatchObject({ skeletons: 0 });
    expect((await domRows(page)).rows).toBeGreaterThan(5);
  });
});

test.describe("DataTable — right to left", () => {
  test.beforeEach(async ({ page }) => {
    await gotoStory(page, "right-to-left", { globals: "direction:rtl" });
  });

  test("an edge follows the pointer", async ({ page }) => {
    const table = tableOf(page);
    const before = (await headerWidths(table)).Name;

    // Name's edge is on its left: dragging it left widens Name.
    await dragEdge(page, table, "Name", -80);
    expect((await headerWidths(table)).Name).toBeCloseTo(before + 80, 0);

    await dragEdge(page, table, "Name", 80);
    expect((await headerWidths(table)).Name).toBeCloseTo(before, 0);
    await expectAligned(table);
    await expectNoHorizontalOverflow(page);
  });

  test("the arrow keys move the edge the way they point", async ({ page }) => {
    const table = tableOf(page);
    const before = (await headerWidths(table)).Name;

    await table.getByTestId("data-table-resize-Name").focus();
    await page.keyboard.press("ArrowLeft");
    expect((await headerWidths(table)).Name).toBeCloseTo(before + 10, 0);
    await page.keyboard.press("ArrowRight");
    expect((await headerWidths(table)).Name).toBeCloseTo(before, 0);
  });

  test("the settings menu opens inside the window", async ({ page }) => {
    await tableOf(page).getByTestId("data-table-settings-button").click();
    const item = page.getByTestId("data-table-settings-Author");
    await expect(item).toBeVisible();
    const box = await item.boundingBox();
    expect(box?.x).toBeGreaterThanOrEqual(0);
  });
});

test.describe("DataTable — the keyboard", () => {
  test("sorts from a header with Enter and Space", async ({ page }) => {
    await gotoStory(page, "default");
    const table = tableOf(page);
    const header = (id: string) => table.getByTestId(`data-table-header-${id}`);

    await table.getByTestId("data-table-sort-Modified").focus();
    await page.keyboard.press("Enter");
    await expect(header("Modified")).toHaveAttribute("aria-sort", "ascending");
    await page.keyboard.press("Space");
    await expect(header("Modified")).toHaveAttribute("aria-sort", "descending");
  });

  test("opens and closes the settings menu, giving the focus back", async ({
    page,
  }) => {
    await gotoStory(page, "default");
    const button = tableOf(page).getByTestId("data-table-settings-button");

    await button.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("data-table-settings-Author")).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "true");

    await page
      .getByTestId("data-table-settings-Author")
      .getByRole("checkbox")
      .focus();
    await page.keyboard.press("Escape");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();
  });
});
