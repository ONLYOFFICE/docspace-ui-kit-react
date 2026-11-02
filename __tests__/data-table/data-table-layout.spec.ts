import { expect, test } from "@playwright/test";

import {
  MIN_FILL,
  MIN_FLEX,
  dragEdge,
  expectAligned,
  expectNoHorizontalOverflow,
  gotoStory,
  headerWidths,
  shares,
  tableOf,
} from "./data-table.helpers";

const FLEX = ["Author", "Modified", "Size", "Type"];

const total = (widths: Record<string, number>) =>
  Object.values(widths).reduce((sum, width) => sum + width, 0);

test.describe("DataTable — the header and the rows stay aligned", () => {
  test("when the story loads", async ({ page }) => {
    await gotoStory(page, "default");
    await expectAligned(tableOf(page));
  });

  test("after a drag", async ({ page }) => {
    await gotoStory(page, "resizing");
    const table = tableOf(page);

    await dragEdge(page, table, "Name", 150);
    await expectAligned(table);
    await dragEdge(page, table, "Modified", -90);
    await expectAligned(table);
  });

  test("after a column is hidden and shown again", async ({ page }) => {
    await gotoStory(page, "default");
    const table = tableOf(page);
    // The label, as a user clicks it; the checkbox inside it is hidden.
    const typeItem = page.getByTestId("data-table-settings-Type");

    await table.getByTestId("data-table-settings-button").click();
    await typeItem.click();
    await expect(table.getByTestId("data-table-header-Type")).toHaveCount(0);
    await expectAligned(table);

    await typeItem.click();
    await expect(table.getByTestId("data-table-header-Type")).toHaveCount(1);
    await expectAligned(table);
  });

  test("at every window width, without scrolling sideways", async ({
    page,
  }) => {
    await gotoStory(page, "default");
    const table = tableOf(page);

    for (const width of [1440, 1200, 960, 800, 700, 560, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(150);
      await expectAligned(table);
      await expectNoHorizontalOverflow(page);
    }
  });

  test("while a virtualised list scrolls", async ({ page }) => {
    await gotoStory(page, "virtualized");
    const table = tableOf(page);
    const scroller = page.getByTestId("scroller");

    await expectAligned(table);

    // The wheel, in small steps.
    await scroller.hover();
    for (let i = 0; i < 6; i += 1) {
      await page.mouse.wheel(0, 250);
      await page.waitForTimeout(30);
    }
    await page.waitForTimeout(250);
    await expectAligned(table);

    // Jumps, far enough to draw skeleton rows on the way; those are rows too.
    for (const top of [100_000, 300_000, 0]) {
      await scroller.evaluate((el, to) => {
        el.scrollTop = to;
      }, top);
      await page.waitForTimeout(30);
      await expectAligned(table);
      await page.waitForTimeout(300);
      await expectAligned(table);
    }
  });
});

test.describe("DataTable — dragging an edge", () => {
  test.beforeEach(async ({ page }) => {
    await gotoStory(page, "resizing");
  });

  test("grows the column and shrinks the nearest neighbour first", async ({
    page,
  }) => {
    const table = tableOf(page);
    const before = await headerWidths(table);

    await dragEdge(page, table, "Name", 60);
    const after = await headerWidths(table);

    expect(after.Name).toBeCloseTo(before.Name + 60, 0);
    expect(after.Author).toBeCloseTo(before.Author - 60, 0);
    for (const id of ["Modified", "Size", "Type"]) {
      expect(after[id]).toBeCloseTo(before[id], 0);
    }
    expect(total(after)).toBeCloseTo(total(before), 0);
  });

  test("pushes every column on that side down to 110 px, never further", async ({
    page,
  }) => {
    const table = tableOf(page);
    const before = await headerWidths(table);

    await dragEdge(page, table, "Name", 2000);
    const after = await headerWidths(table);

    for (const id of FLEX) expect(after[id]).toBeCloseTo(MIN_FLEX, 0);
    expect(after.Settings).toBe(24);
    expect(total(after)).toBeCloseTo(total(before), 0);
    await expectNoHorizontalOverflow(page);
  });

  test("stops Name at 210 px, however far it is dragged", async ({ page }) => {
    const table = tableOf(page);
    const before = await headerWidths(table);

    await dragEdge(page, table, "Name", -2000);
    const after = await headerWidths(table);

    expect(after.Name).toBeCloseTo(MIN_FILL, 0);
    expect(after.Author).toBeCloseTo(before.Author + before.Name - MIN_FILL, 0);
    expect(total(after)).toBeCloseTo(total(before), 0);
  });

  test("past a minimum, shrinks the columns before the edge, nearest first", async ({
    page,
  }) => {
    const table = tableOf(page);
    const before = await headerWidths(table);

    // Size's edge far to the left: Size, then Modified, Author and Name give
    // way down to their minimums, and Type takes it all.
    await dragEdge(page, table, "Size", -3000);
    const after = await headerWidths(table);

    expect(after.Name).toBeCloseTo(MIN_FILL, 0);
    for (const id of ["Author", "Modified", "Size"]) {
      expect(after[id]).toBeCloseTo(MIN_FLEX, 0);
    }
    expect(after.Type).toBeCloseTo(
      total(before) - 24 - MIN_FILL - 3 * MIN_FLEX,
      0,
    );
    await expectNoHorizontalOverflow(page);
  });

  test("never moves a fixed column", async ({ page }) => {
    const table = tableOf(page);

    for (const [id, dx] of [
      ["Name", 400],
      ["Type", -400],
      ["Author", 2000],
    ] as const) {
      // Type is the last flexible column and has no edge; drag Size instead.
      await dragEdge(page, table, id === "Type" ? "Size" : id, dx);
      expect((await headerWidths(table)).Settings).toBe(24);
    }
  });

  test("moves 10 px a key press, 50 px with Shift", async ({ page }) => {
    const table = tableOf(page);
    const edge = table.getByTestId("data-table-resize-Name");
    const before = await headerWidths(table);

    await edge.focus();
    await page.keyboard.press("ArrowRight");
    expect((await headerWidths(table)).Name).toBeCloseTo(before.Name + 10, 0);

    await page.keyboard.press("Shift+ArrowRight");
    expect((await headerWidths(table)).Name).toBeCloseTo(before.Name + 60, 0);

    await page.keyboard.press("ArrowLeft");
    expect((await headerWidths(table)).Name).toBeCloseTo(before.Name + 50, 0);
  });

  test("resets to 40/60 on a double click", async ({ page }) => {
    const table = tableOf(page);

    await dragEdge(page, table, "Name", 200);
    expect((await shares(table)).Name).toBeGreaterThan(40);

    await table.getByTestId("data-table-resize-Author").dblclick();
    expect((await shares(table)).Name).toBe(40);
    const reset = await shares(table);
    for (const id of ["Author", "Modified", "Size"]) expect(reset[id]).toBe(15);
  });

  test("keeps the rows aligned in the middle of a drag, and in place", async ({
    page,
  }) => {
    const table = tableOf(page);
    const edge = table.getByTestId("data-table-resize-Name");
    const box = await edge.boundingBox();
    if (!box) throw new Error("no edge");

    // Mid-drag the grid changes through one CSS variable on the table, so the
    // rows follow without being replaced.
    const firstRow = table.getByTestId("data-table-row").first();
    await firstRow.evaluate((row) => {
      (window as { __rowNode?: Element }).__rowNode = row;
    });

    await page.mouse.move(box.x + 8, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + 108, box.y + box.height / 2, { steps: 20 });
    await expectAligned(table);
    await page.mouse.up();

    expect(
      await firstRow.evaluate(
        (row) => (window as { __rowNode?: Element }).__rowNode === row,
      ),
    ).toBe(true);
  });
});
