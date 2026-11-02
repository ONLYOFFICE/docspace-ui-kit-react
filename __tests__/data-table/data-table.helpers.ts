import { type Locator, type Page, expect } from "@playwright/test";

// Shared by the DataTable specs. Not a spec itself: Playwright collects only
// `*.spec.ts`.

const BASE = "ui-data-display-datatable";

/** Opens a story and waits until its play function, if any, is done. */
export async function gotoStory(
  page: Page,
  story: string,
  { globals }: { globals?: string } = {},
) {
  const query = globals ? `&globals=${globals}` : "";
  await page.goto(`/iframe.html?id=${BASE}--${story}&viewMode=story${query}`);
  // Storybook answers 200 for an unknown id and shows its error display
  // instead of the story: fail on that now, not on a timeout further down.
  await page.waitForSelector("body.sb-show-main, body.sb-show-errordisplay", {
    state: "attached",
  });
  await expect(page.locator("body")).not.toHaveClass(/sb-show-errordisplay/);
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
  await page.evaluate(() => document.fonts.ready);
}

/** The table, or the one with this test id when a story has several. */
export const tableOf = (page: Page, testId = "data-table") =>
  page.getByTestId(testId);

/** Width of every rendered header cell, by column id, in pixels. */
export const headerWidths = (table: Locator) =>
  table.evaluate((root) =>
    Object.fromEntries(
      [...root.querySelectorAll<HTMLElement>('[role="columnheader"]')].map(
        (cell) => [cell.dataset.columnId, cell.getBoundingClientRect().width],
      ),
    ),
  ) as Promise<Record<string, number>>;

/** The ids of the rendered columns, in order. */
export const renderedColumns = (table: Locator) =>
  table.evaluate((root) =>
    [...root.querySelectorAll<HTMLElement>('[role="columnheader"]')].map(
      (cell) => cell.dataset.columnId,
    ),
  );

/**
 * The invariant the table exists for: every cell of every rendered row,
 * skeleton rows included, starts and ends where its header cell does.
 * Returns the worst miss in pixels and how many rows were compared.
 */
export const alignment = (table: Locator) =>
  table.evaluate((root) => {
    const heads = [
      ...root.querySelectorAll<HTMLElement>('[role="columnheader"]'),
    ].map((cell) => cell.getBoundingClientRect());
    const rows = [
      ...root.querySelectorAll<HTMLElement>('[role="rowgroup"] [role="row"]'),
    ].filter((row) => !row.closest('[data-testid="data-table-header"]'));

    let worst = 0;
    let mismatchedCount = 0;
    for (const row of rows) {
      const cells = [...row.querySelectorAll<HTMLElement>('[role="cell"]')];
      if (cells.length !== heads.length) mismatchedCount += 1;
      cells.forEach((cell, i) => {
        const box = cell.getBoundingClientRect();
        const head = heads[i];
        if (!head) return;
        worst = Math.max(
          worst,
          Math.abs(box.left - head.left),
          Math.abs(box.right - head.right),
        );
      });
    }
    return { worst, rows: rows.length, mismatchedCount };
  });

/** Asserts the invariant, and that the story actually has rows to compare. */
export async function expectAligned(table: Locator) {
  const { worst, rows, mismatchedCount } = await alignment(table);
  expect(rows, "rows to compare").toBeGreaterThan(0);
  expect(mismatchedCount, "rows whose cell count differs").toBe(0);
  expect(worst, "worst edge miss, px").toBeLessThanOrEqual(0.5);
}

/** Whether anything on the page, or the table itself, scrolls sideways. */
export const horizontalOverflow = (page: Page, testId = "data-table") =>
  page.evaluate((id) => {
    const doc = document.scrollingElement as HTMLElement;
    const table = document.querySelector<HTMLElement>(`[data-testid="${id}"]`);
    return {
      page: doc.scrollWidth - doc.clientWidth,
      table: table ? table.scrollWidth - table.clientWidth : 0,
    };
  }, testId);

export async function expectNoHorizontalOverflow(
  page: Page,
  testId = "data-table",
) {
  const overflow = await horizontalOverflow(page, testId);
  expect(overflow.page, "page overflow, px").toBeLessThanOrEqual(0);
  expect(overflow.table, "table overflow, px").toBeLessThanOrEqual(0);
}

/** Drags a column's resize edge by `dx` pixels with the real mouse. */
export async function dragEdge(
  page: Page,
  table: Locator,
  columnId: string,
  dx: number,
) {
  const edge = table.getByTestId(`data-table-resize-${columnId}`);
  const box = await edge.boundingBox();
  if (!box) throw new Error(`no resize edge for ${columnId}`);
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y, { steps: 12 });
  await page.mouse.up();
  // The grid is committed on pointerup; give React the frame.
  await page.waitForTimeout(100);
}

/** The raw record under a localStorage key, parsed, or null. */
export const storedRecord = (page: Page, key: string) =>
  page.evaluate((k) => {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : null;
  }, key) as Promise<{ v: number; widths: Record<string, number> } | null>;

/** Shares of the flexible area, as the resize edges report them, by column. */
export const shares = (table: Locator) =>
  table.evaluate((root) =>
    Object.fromEntries(
      [...root.querySelectorAll<HTMLElement>('[role="separator"]')].map(
        (edge) => [
          edge.dataset.testid?.replace("data-table-resize-", ""),
          Number(edge.getAttribute("aria-valuenow")),
        ],
      ),
    ),
  ) as Promise<Record<string, number>>;

export const MIN_FILL = 210;
export const MIN_FLEX = 110;
