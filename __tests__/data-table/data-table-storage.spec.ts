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

// RememberedWidths: two tables, each in localStorage under its own key.
const FILES_KEY = "storybook-data-table-files";
const TRASH_KEY = "storybook-data-table-trash";

const files = (page: Page) => tableOf(page, "data-table-files");
const trash = (page: Page) => tableOf(page, "data-table-trash");

/** Each flexible column's width as a share of the flexible ones together. */
const proportions = async (page: Page, testId: string) => {
  const widths = await headerWidths(tableOf(page, testId));
  const flexible = Object.entries(widths).filter(([id]) => id !== "Settings");
  const sum = flexible.reduce((total, [, width]) => total + width, 0);
  return Object.fromEntries(flexible.map(([id, w]) => [id, w / sum]));
};

const expectSameProportions = (
  a: Record<string, number>,
  b: Record<string, number>,
) => {
  expect(Object.keys(b)).toEqual(Object.keys(a));
  for (const id of Object.keys(a)) expect(b[id]).toBeCloseTo(a[id], 2);
};

test.describe("DataTable — remembering the widths", () => {
  test("a reload brings the proportions back", async ({ page }) => {
    await gotoStory(page, "remembered-widths");
    await dragEdge(page, files(page), "Name", 120);
    await dragEdge(page, files(page), "Size", -60);
    const before = await proportions(page, "data-table-files");

    await page.reload();
    await gotoStory(page, "remembered-widths");

    expectSameProportions(before, await proportions(page, "data-table-files"));
    await expectAligned(files(page));
  });

  test("stores shares of the table, not pixels, and only flexible columns", async ({
    page,
  }) => {
    await gotoStory(page, "remembered-widths");
    expect(await storedRecord(page, FILES_KEY)).toBeNull();

    await dragEdge(page, files(page), "Name", 120);
    const record = await storedRecord(page, FILES_KEY);

    expect(record?.v).toBe(2);
    expect(Object.keys(record?.widths ?? {})).toEqual([
      "Name",
      "Author",
      "Modified",
      "Size",
      "Type",
    ]);
    const sum = Object.values(record?.widths ?? {}).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);
  });

  test("two tables on one page keep their own records", async ({ page }) => {
    await gotoStory(page, "remembered-widths");

    await dragEdge(page, files(page), "Name", 150);

    expect(await storedRecord(page, TRASH_KEY)).toBeNull();
    expect((await shares(trash(page))).Name).toBe(40);

    await dragEdge(page, trash(page), "Name", -100);
    const filesRecord = await storedRecord(page, FILES_KEY);
    const trashRecord = await storedRecord(page, TRASH_KEY);
    expect(filesRecord?.widths.Name).toBeGreaterThan(0.4);
    expect(trashRecord?.widths.Name).toBeLessThan(0.4);
  });

  for (const [name, raw] of [
    ["broken JSON", "{not json"],
    ["the old table's pixel string", "300px 180px 180px 180px 180px 24px"],
    ["a record of another version", '{"v":1,"widths":{"Name":0.9}}'],
  ] as const) {
    test(`reads ${name} as nothing stored, and leaves it as it is`, async ({
      page,
    }) => {
      await page.addInitScript(
        ([key, value]) => localStorage.setItem(key, value),
        [FILES_KEY, raw] as const,
      );
      await gotoStory(page, "remembered-widths");

      expect((await shares(files(page))).Name).toBe(40);
      await expectAligned(files(page));
      // Rendering never writes: the record is still the one it found.
      expect(
        await page.evaluate((key) => localStorage.getItem(key), FILES_KEY),
      ).toBe(raw);
    });
  }
});

test.describe("DataTable — two windows on one record", () => {
  test("a narrower window shows the same proportions, without overflow", async ({
    context,
  }) => {
    const wide = await context.newPage();
    const narrow = await context.newPage();
    await wide.setViewportSize({ width: 1440, height: 900 });
    await narrow.setViewportSize({ width: 900, height: 900 });

    await gotoStory(wide, "remembered-widths");
    await gotoStory(narrow, "remembered-widths");

    // Shares the narrower window can honour without breaking a minimum.
    await dragEdge(wide, files(wide), "Name", -100);
    const record = await storedRecord(wide, FILES_KEY);

    // The other window reads the record when it mounts, not while open.
    await narrow.reload();
    await gotoStory(narrow, "remembered-widths");

    expectSameProportions(
      await proportions(wide, "data-table-files"),
      await proportions(narrow, "data-table-files"),
    );
    await expectAligned(files(narrow));
    await expectNoHorizontalOverflow(narrow, "data-table-files");

    // Opening it rewrote nothing.
    expect(await storedRecord(narrow, FILES_KEY)).toEqual(record);
  });

  test("a narrower window that cannot honour the shares keeps the minimums", async ({
    context,
  }) => {
    const wide = await context.newPage();
    await wide.setViewportSize({ width: 1440, height: 900 });
    await gotoStory(wide, "remembered-widths");
    // Name wide enough that at 900 px Author would fall below 110 px.
    await dragEdge(wide, files(wide), "Name", 300);
    const record = await storedRecord(wide, FILES_KEY);

    const narrow = await context.newPage();
    await narrow.setViewportSize({ width: 900, height: 900 });
    await gotoStory(narrow, "remembered-widths");

    const widths = await headerWidths(files(narrow));
    expect(widths.Name).toBeGreaterThanOrEqual(210 - 0.5);
    for (const id of ["Author", "Modified", "Size", "Type"]) {
      expect(widths[id]).toBeGreaterThanOrEqual(110 - 0.5);
    }
    await expectAligned(files(narrow));
    await expectNoHorizontalOverflow(narrow, "data-table-files");
    expect(await storedRecord(narrow, FILES_KEY)).toEqual(record);
  });

  test("a window too narrow for the columns turns compact and keeps the record", async ({
    context,
  }) => {
    const wide = await context.newPage();
    await wide.setViewportSize({ width: 1440, height: 900 });
    await gotoStory(wide, "remembered-widths");
    await dragEdge(wide, files(wide), "Name", 200);
    const record = await storedRecord(wide, FILES_KEY);
    const wideProportions = await proportions(wide, "data-table-files");

    const phone = await context.newPage();
    await phone.setViewportSize({ width: 560, height: 900 });
    await gotoStory(phone, "remembered-widths");

    expect(await renderedColumns(files(phone))).toEqual(["Name", "Settings"]);
    await expectNoHorizontalOverflow(phone, "data-table-files");
    expect(await storedRecord(phone, FILES_KEY)).toEqual(record);

    // Wider again: the remembered proportions, untouched by the compact view.
    await phone.setViewportSize({ width: 1440, height: 900 });
    await phone.waitForTimeout(200);
    expectSameProportions(
      wideProportions,
      await proportions(phone, "data-table-files"),
    );
  });

  test("the last window to resize wins, and the other follows on its next mount", async ({
    context,
  }) => {
    const a = await context.newPage();
    const b = await context.newPage();
    await gotoStory(a, "remembered-widths");
    await gotoStory(b, "remembered-widths");

    await dragEdge(a, files(a), "Name", 200);
    await dragEdge(b, files(b), "Name", -100);
    const fromB = await storedRecord(b, FILES_KEY);

    // A still shows its own layout until it mounts again.
    expect((await shares(files(a))).Name).toBeGreaterThan(40);

    await a.reload();
    await gotoStory(a, "remembered-widths");
    expect(await storedRecord(a, FILES_KEY)).toEqual(fromB);
    expect((await shares(files(a))).Name).toBeLessThan(40);
  });
});
