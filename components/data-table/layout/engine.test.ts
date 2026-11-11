import { describe, expect, it } from "vitest";

import {
  type ColumnFractions,
  type LayoutColumn,
  getCompactColumns,
  getDefaultFractions,
  getEdgeOffset,
  getFlexibleArea,
  getMinWidth,
  getRequiredWidth,
  hasResizeHandle,
  hideColumn,
  isCompact,
  isFill,
  isFlexible,
  reconcileColumns,
  resizeColumn,
  restoreFractions,
  showColumn,
  toFractions,
  toLogicalDelta,
  toPixels,
} from "./engine";

const fill = (id = "Name", min?: number): LayoutColumn => ({
  id,
  width: min === undefined ? { type: "fill" } : { type: "fill", min },
});
const flex = (id: string, min?: number): LayoutColumn => ({
  id,
  width: min === undefined ? { type: "flex" } : { type: "flex", min },
});
const fixed = (id: string, size: number): LayoutColumn => ({
  id,
  width: { type: "fixed", size },
});

const round = (record: Record<string, number>, digits = 2) =>
  Object.fromEntries(
    Object.entries(record).map(([k, v]) => [k, Number(v.toFixed(digits))]),
  );

/** Shares that give exactly these flexible widths. */
const sharesFor = (columns: LayoutColumn[], widths: Record<string, number>) =>
  toFractions(columns, widths);

const sumOf = (record: Record<string, number>) =>
  Object.values(record).reduce((a, b) => a + b, 0);

// Name, Author, Modified, Size and a 68 px context-menu column, as in the
// resize picture of the spec. A 1068 px container leaves 1000 px flexible.
const SPEC_COLUMNS = [
  fill(),
  flex("Author"),
  flex("Modified"),
  flex("Size"),
  fixed("Menu", 68),
];
const SPEC_WIDTH = 1068;
const EVEN = sharesFor(SPEC_COLUMNS, {
  Name: 400,
  Author: 200,
  Modified: 200,
  Size: 200,
});

describe("getMinWidth", () => {
  it("defaults to 210 for fill, 110 for flex and the size for fixed", () => {
    expect(getMinWidth(fill())).toBe(210);
    expect(getMinWidth(flex("Author"))).toBe(110);
    expect(getMinWidth(fixed("Menu", 68))).toBe(68);
  });

  it("takes an explicit minimum", () => {
    expect(getMinWidth(fill("Name", 300))).toBe(300);
    expect(getMinWidth(flex("Tags", 150))).toBe(150);
  });
});

describe("getDefaultFractions", () => {
  it("gives fill 40 % and splits 60 % between the flex columns", () => {
    expect(round(getDefaultFractions(SPEC_COLUMNS, SPEC_WIDTH), 4)).toEqual({
      Name: 0.4,
      Author: 0.2,
      Modified: 0.2,
      Size: 0.2,
    });
  });

  it("tops a flex share below 110 up from the fill column", () => {
    const columns = [
      fill(),
      ...["A", "B", "C", "D", "E"].map((id) => flex(id)),
    ];
    // 800 px: 60 % / 5 = 96 px each, below 110.
    const pixels = toPixels(columns, getDefaultFractions(columns, 800), 800);

    expect(round(pixels)).toEqual({
      Name: 250,
      A: 110,
      B: 110,
      C: 110,
      D: 110,
      E: 110,
    });
  });

  it("keeps plain 40/60 shares when the minimums do not fit", () => {
    const columns = [
      fill(),
      ...["A", "B", "C", "D", "E"].map((id) => flex(id)),
    ];

    expect(round(getDefaultFractions(columns, 500), 4)).toEqual({
      Name: 0.4,
      A: 0.12,
      B: 0.12,
      C: 0.12,
      D: 0.12,
      E: 0.12,
    });
  });

  it("splits equally when there is no fill column", () => {
    expect(
      round(getDefaultFractions([flex("A"), flex("B"), flex("C")], 900), 4),
    ).toEqual({ A: 0.3333, B: 0.3333, C: 0.3333 });
  });

  it("gives the whole area to a lone fill column", () => {
    expect(getDefaultFractions([fill(), fixed("Menu", 68)], 1000)).toEqual({
      Name: 1,
    });
  });

  it("has no shares without flexible columns", () => {
    expect(getDefaultFractions([fixed("Menu", 68)], 1000)).toEqual({});
  });
});

describe("toPixels", () => {
  it("lays the shares over the flexible area and keeps fixed sizes", () => {
    expect(round(toPixels(SPEC_COLUMNS, EVEN, SPEC_WIDTH))).toEqual({
      Name: 400,
      Author: 200,
      Modified: 200,
      Size: 200,
      Menu: 68,
    });
  });

  it("freezes a column below its minimum and shares the rest again", () => {
    const shares = { Name: 0.9, Author: 0.05, Modified: 0.025, Size: 0.025 };

    expect(round(toPixels(SPEC_COLUMNS, shares, SPEC_WIDTH))).toEqual({
      Name: 670,
      Author: 110,
      Modified: 110,
      Size: 110,
      Menu: 68,
    });
  });

  it("keeps the proportions on another container width", () => {
    const pixels = toPixels(SPEC_COLUMNS, EVEN, 2068);

    expect(round(pixels)).toEqual({
      Name: 800,
      Author: 400,
      Modified: 400,
      Size: 400,
      Menu: 68,
    });
  });
});

describe("compact mode", () => {
  const columns = [fill(), flex("Author"), flex("Modified"), flex("Size")];

  it("follows the spec: 210 + 110 * 3 = 540 still fits, 539 does not", () => {
    expect(getRequiredWidth(columns)).toBe(540);
    expect(isCompact(columns, 540)).toBe(false);
    expect(isCompact(columns, 539)).toBe(true);
  });

  it("counts fixed columns too", () => {
    const withMenu = [...columns, fixed("Menu", 68)];

    expect(isCompact(withMenu, 608)).toBe(false);
    expect(isCompact(withMenu, 607)).toBe(true);
  });

  it("keeps the fixed and the fill columns", () => {
    const withSystem = [fixed("Index", 33), ...columns, fixed("Menu", 68)];

    expect(getCompactColumns(withSystem).map((c) => c.id)).toEqual([
      "Index",
      "Name",
      "Menu",
    ]);
  });

  it("keeps the first flexible column when there is no fill column", () => {
    expect(
      getCompactColumns([flex("A"), flex("B"), fixed("Menu", 68)]).map(
        (c) => c.id,
      ),
    ).toEqual(["A", "Menu"]);
  });
});

describe("resizeColumn", () => {
  const resize = (id: string, delta: number, shares = EVEN) =>
    round(
      toPixels(
        SPEC_COLUMNS,
        resizeColumn(SPEC_COLUMNS, shares, SPEC_WIDTH, id, delta),
        SPEC_WIDTH,
      ),
    );

  it("grows the column and shrinks the next one, cascading at 110", () => {
    expect(resize("Name", 100)).toEqual({
      Name: 500,
      Author: 110,
      Modified: 190,
      Size: 200,
      Menu: 68,
    });
  });

  it("stops when every column on the right is at its minimum (fill container)", () => {
    expect(resize("Name", 10_000)).toEqual({
      Name: 670,
      Author: 110,
      Modified: 110,
      Size: 110,
      Menu: 68,
    });
  });

  it("moving left shrinks this column and those before it, the next one grows", () => {
    expect(resize("Modified", -10_000)).toEqual({
      Name: 210,
      Author: 110,
      Modified: 110,
      Size: 570,
      Menu: 68,
    });
  });

  it("cascades to the left once the dragged column is at its minimum", () => {
    expect(resize("Author", -150)).toEqual({
      Name: 340,
      Author: 110,
      Modified: 350,
      Size: 200,
      Menu: 68,
    });
  });

  it("never changes a fixed column in the way", () => {
    const columns = [fill(), fixed("Check", 30), flex("Author"), flex("Size")];
    const shares = sharesFor(columns, { Name: 400, Author: 300, Size: 300 });
    const pixels = toPixels(
      columns,
      resizeColumn(columns, shares, 1030, "Name", 250),
      1030,
    );

    expect(round(pixels)).toEqual({
      Name: 650,
      Check: 30,
      Author: 110,
      Size: 240,
    });
  });

  it("skips a column that is not resizable", () => {
    const columns: LayoutColumn[] = [
      fill(),
      { ...flex("Type"), resizable: false },
      flex("Size"),
    ];
    const shares = sharesFor(columns, { Name: 400, Type: 300, Size: 300 });
    const pixels = toPixels(
      columns,
      resizeColumn(columns, shares, 1000, "Name", 100),
      1000,
    );

    expect(round(pixels)).toEqual({ Name: 500, Type: 300, Size: 200 });
    expect(hasResizeHandle(columns, "Type")).toBe(false);
  });

  it("leaves the shares alone without a handle or a movement", () => {
    expect(resizeColumn(SPEC_COLUMNS, EVEN, SPEC_WIDTH, "Size", 50)).toBe(EVEN);
    expect(resizeColumn(SPEC_COLUMNS, EVEN, SPEC_WIDTH, "Menu", 50)).toBe(EVEN);
    expect(resizeColumn(SPEC_COLUMNS, EVEN, SPEC_WIDTH, "Name", 0)).toBe(EVEN);
    // Compact: no handles are drawn, and the shares must survive.
    expect(resizeColumn(SPEC_COLUMNS, EVEN, 300, "Name", 50)).toBe(EVEN);
  });

  it("draws handles only between resizable columns", () => {
    expect(
      SPEC_COLUMNS.filter((c) => hasResizeHandle(SPEC_COLUMNS, c.id)).map(
        (c) => c.id,
      ),
    ).toEqual(["Name", "Author", "Modified"]);
  });
});

describe("getEdgeOffset", () => {
  it("is the width of the column and every column before it", () => {
    expect(getEdgeOffset(SPEC_COLUMNS, EVEN, SPEC_WIDTH, "Name")).toBe(400);
    expect(getEdgeOffset(SPEC_COLUMNS, EVEN, SPEC_WIDTH, "Modified")).toBe(800);
    expect(getEdgeOffset(SPEC_COLUMNS, EVEN, SPEC_WIDTH, "Menu")).toBe(
      SPEC_WIDTH,
    );
  });
});

describe("toLogicalDelta", () => {
  it("flips the pointer movement in right-to-left", () => {
    expect(toLogicalDelta(30, false)).toBe(30);
    expect(toLogicalDelta(30, true)).toBe(-30);
  });
});

describe("hideColumn", () => {
  it("gives the width to the left neighbour, so nothing else moves", () => {
    const rest = SPEC_COLUMNS.filter((c) => c.id !== "Modified");
    const shares = hideColumn(SPEC_COLUMNS, EVEN, SPEC_WIDTH, "Modified");

    expect(Object.keys(shares)).toEqual(["Name", "Author", "Size"]);
    expect(round(toPixels(rest, shares, SPEC_WIDTH))).toEqual({
      Name: 400,
      Author: 400,
      Size: 200,
      Menu: 68,
    });
  });

  it("gives it to the right neighbour when there is none on the left", () => {
    const columns = [flex("A"), flex("B"), flex("C")];
    const shares = sharesFor(columns, { A: 300, B: 300, C: 400 });
    const rest = columns.slice(1);

    expect(
      round(toPixels(rest, hideColumn(columns, shares, 1000, "A"), 1000)),
    ).toEqual({ B: 600, C: 400 });
  });

  it("gives a hidden fixed column's size to the flexible column on its left", () => {
    const columns = [fill(), fixed("Badge", 40), flex("Size")];
    const shares = sharesFor(columns, { Name: 560, Size: 400 });
    const rest = [columns[0], columns[2]];

    expect(
      round(toPixels(rest, hideColumn(columns, shares, 1000, "Badge"), 1000)),
    ).toEqual({ Name: 600, Size: 400 });
  });

  it("moves the share itself before the container is measured", () => {
    const shares = hideColumn(SPEC_COLUMNS, EVEN, 0, "Modified");

    expect(round(shares, 4)).toEqual({ Name: 0.4, Author: 0.4, Size: 0.2 });
  });
});

describe("showColumn", () => {
  // The spec's example: 807 px of flexible area plus a 24 px settings column.
  const SETTINGS = fixed("Settings", 24);
  const WIDTH = 807 + 24;

  it("takes the width from the column on its left, down to that one's minimum", () => {
    const before = [fill(), flex("Author"), flex("Size"), SETTINGS];
    const after = [
      fill(),
      flex("Author"),
      flex("Modified"),
      flex("Size"),
      SETTINGS,
    ];
    const shares = sharesFor(before, { Name: 449, Author: 239, Size: 119 });

    // 807 / 4 = 201.75 px asked for; Author can give 239 - 110 = 129.
    expect(
      round(
        toPixels(after, showColumn(after, shares, WIDTH, "Modified"), WIDTH),
      ),
    ).toEqual({
      Name: 449,
      Author: 110,
      Modified: 129,
      Size: 119,
      Settings: 24,
    });
  });

  it("takes 807 / 4 = 202 px from the widest column when its left one cannot give a minimum (spec example)", () => {
    const before = [fill(), flex("Author"), flex("Size"), SETTINGS];
    const after = [
      fill(),
      flex("Author"),
      flex("Modified"),
      flex("Size"),
      SETTINGS,
    ];
    // Author can give 150 - 110 = 40 px, short of Modified's 110.
    const shares = sharesFor(before, { Name: 449, Author: 150, Size: 208 });

    expect(
      round(
        toPixels(after, showColumn(after, shares, WIDTH, "Modified"), WIDTH),
      ),
    ).toEqual({
      Name: 247.25,
      Author: 150,
      Modified: 201.75,
      Size: 208,
      Settings: 24,
    });
  });

  it("resets when the new column would be below its minimum", () => {
    const before = [
      fill(),
      flex("Author"),
      flex("Modified"),
      flex("Size"),
      SETTINGS,
    ];
    // With the default minimums an equal share always fits once the columns
    // do; a wider minimum of its own is what the share can fall short of.
    const after = [
      fill(),
      flex("Author"),
      { id: "Created", width: { type: "flex", min: 250 } } as LayoutColumn,
      flex("Modified"),
      flex("Size"),
      SETTINGS,
    ];
    const shares = sharesFor(before, {
      Name: 330,
      Author: 239,
      Modified: 121,
      Size: 117,
    });

    // 807 / 5 = 161.4 px < 250.
    expect(showColumn(after, shares, WIDTH, "Created")).toEqual(
      getDefaultFractions(after, WIDTH),
    );
  });

  it("resets when the widest column would drop below its minimum", () => {
    const before = [fill(), flex("Author"), flex("Size"), SETTINGS];
    const after = [
      fill(),
      flex("Author"),
      flex("Modified"),
      flex("Size"),
      SETTINGS,
    ];
    // Author is at its minimum, so the widest gives: 377 - 201.75 < 210.
    const shares = sharesFor(before, { Name: 377, Author: 110, Size: 320 });

    expect(showColumn(after, shares, WIDTH, "Modified")).toEqual(
      getDefaultFractions(after, WIDTH),
    );
  });

  it("takes a fixed column's size from the flexible column next to it", () => {
    const before = [fill(), flex("Size")];
    const after = [fixed("Index", 40), fill(), flex("Size")];
    const shares = sharesFor(before, { Name: 600, Size: 400 });

    expect(
      round(toPixels(after, showColumn(after, shares, 1000, "Index"), 1000)),
    ).toEqual({ Index: 40, Name: 560, Size: 400 });
  });

  it("runs the rule on the shares while the layout is compact", () => {
    const after = [fill(), flex("Author"), flex("Modified"), flex("Size")];
    const shares = { Name: 0.5, Author: 0.3, Size: 0.2 };

    // 1 / 4 = 0.25, taken from Author on its left, whose share is larger.
    expect(round(showColumn(after, shares, 300, "Modified"), 4)).toEqual({
      Name: 0.5,
      Author: 0.05,
      Modified: 0.25,
      Size: 0.2,
    });
  });

  it("takes the share from the widest column while compact when its left one has less", () => {
    const after = [fill(), flex("Author"), flex("Modified"), flex("Size")];
    const shares = { Name: 0.6, Author: 0.2, Size: 0.2 };

    // Author's 0.2 is not above 0.25, so Name gives it.
    expect(round(showColumn(after, shares, 300, "Modified"), 4)).toEqual({
      Name: 0.35,
      Author: 0.2,
      Modified: 0.25,
      Size: 0.2,
    });
  });

  it("resets before the container is measured", () => {
    const after = [fill(), flex("Author"), flex("Size")];

    expect(showColumn(after, { Name: 0.6, Author: 0.4 }, 0, "Size")).toEqual(
      getDefaultFractions(after, 0),
    );
  });

  // My documents at 1124 px of flexible area: Name, Modified and Size shown,
  // Author, Created and Type hidden - six flexible columns in all.
  const DOCS_WIDTH = 1124 + 24;

  it("divides by every flexible column, hidden ones included, and moves no other than the giver", () => {
    const before = [fill(), flex("Modified"), flex("Size"), SETTINGS];
    const after = [
      fill(),
      flex("Modified"),
      flex("Size"),
      flex("Type"),
      SETTINGS,
    ];
    const shares = sharesFor(before, { Name: 450, Modified: 337, Size: 337 });

    // 1124 / 6 = 187.33 from Size, on Type's left; by the visible count,
    // 1124 / 4 = 281 would be more than Size can give.
    expect(
      round(
        toPixels(
          after,
          showColumn(after, shares, DOCS_WIDTH, "Type", 6),
          DOCS_WIDTH,
        ),
      ),
    ).toEqual({
      Name: 450,
      Modified: 337,
      Size: 149.67,
      Type: 187.33,
      Settings: 24,
    });
  });

  it("resets when only one flexible column was visible", () => {
    const after = [fill(), flex("Size"), SETTINGS];

    expect(showColumn(after, { Name: 1 }, DOCS_WIDTH, "Size", 6)).toEqual(
      getDefaultFractions(after, DOCS_WIDTH),
    );
  });

  it("takes the width from the last of the widest columns", () => {
    const before = [fill(), flex("Modified"), flex("Size"), SETTINGS];
    const after = [
      fill(),
      flex("Modified"),
      flex("Size"),
      flex("Type"),
      SETTINGS,
    ];
    const shares = sharesFor(before, { Name: 324, Modified: 400, Size: 400 });

    expect(
      round(
        toPixels(
          after,
          showColumn(after, shares, DOCS_WIDTH, "Type", 6),
          DOCS_WIDTH,
        ),
      ),
    ).toEqual({
      Name: 324,
      Modified: 400,
      Size: 212.67,
      Type: 187.33,
      Settings: 24,
    });
  });
});

describe("reconcileColumns", () => {
  it("hides the removed columns and shows the added ones", () => {
    const next = [
      fill(),
      flex("Author"),
      flex("Size"),
      flex("Type"),
      fixed("Menu", 68),
    ];
    const before = sharesFor(SPEC_COLUMNS, {
      Name: 520,
      Author: 160,
      Modified: 160,
      Size: 160,
    });
    const shares = reconcileColumns(SPEC_COLUMNS, next, before, SPEC_WIDTH);

    // Modified's 160 px go to Author. Type then asks 1000 / 4 = 250 px; Size,
    // on its left, has only 50 px above its minimum, so the widest, Name,
    // gives them.
    expect(round(toPixels(next, shares, SPEC_WIDTH))).toEqual({
      Name: 270,
      Author: 320,
      Size: 160,
      Type: 250,
      Menu: 68,
    });
  });

  it("keeps the shares when the columns only move", () => {
    const moved = [
      flex("Size"),
      fill(),
      flex("Author"),
      flex("Modified"),
      fixed("Menu", 68),
    ];

    expect(
      round(reconcileColumns(SPEC_COLUMNS, moved, EVEN, SPEC_WIDTH), 9),
    ).toEqual(round(EVEN, 9));
  });

  it("keeps the shares when a fixed column changes its size", () => {
    const wider = [...SPEC_COLUMNS.slice(0, 4), fixed("Menu", 80)];

    expect(
      round(reconcileColumns(SPEC_COLUMNS, wider, EVEN, SPEC_WIDTH), 9),
    ).toEqual(round(EVEN, 9));
  });

  it("moves shares, not pixels, while the layout is compact", () => {
    // 300 px cannot hold 210 + 3 * 110 + 68.
    const next = SPEC_COLUMNS.filter((c) => c.id !== "Modified");
    const shares = reconcileColumns(SPEC_COLUMNS, next, EVEN, 300);

    expect(round(shares, 4)).toEqual({ Name: 0.4, Author: 0.4, Size: 0.2 });
  });
});

describe("restoreFractions", () => {
  it("gives the defaults without a record", () => {
    expect(restoreFractions(SPEC_COLUMNS, null, SPEC_WIDTH)).toEqual(
      getDefaultFractions(SPEC_COLUMNS, SPEC_WIDTH),
    );
  });

  it("gives the defaults for a record of another table", () => {
    const groups = { Title: 0.5, Members: 0.25, Head: 0.25 };

    expect(restoreFractions(SPEC_COLUMNS, groups, SPEC_WIDTH)).toEqual(
      getDefaultFractions(SPEC_COLUMNS, SPEC_WIDTH),
    );
  });

  it("restores the stored shares and ignores unknown ids", () => {
    const stored = { ...EVEN, Erasure: 0.3 };

    expect(
      round(restoreFractions(SPEC_COLUMNS, stored, SPEC_WIDTH), 4),
    ).toEqual(round(EVEN, 4));
  });

  it("normalises shares that do not sum to 1", () => {
    const stored = { Name: 40, Author: 20, Modified: 20, Size: 20 };

    expect(
      round(restoreFractions(SPEC_COLUMNS, stored, SPEC_WIDTH), 4),
    ).toEqual(round(EVEN, 4));
  });

  it("shows a column the record does not know by the show rule", () => {
    const stored = sharesFor(
      SPEC_COLUMNS.filter((c) => c.id !== "Modified"),
      { Name: 550, Author: 250, Size: 200 },
    );
    const pixels = toPixels(
      SPEC_COLUMNS,
      restoreFractions(SPEC_COLUMNS, stored, SPEC_WIDTH),
      SPEC_WIDTH,
    );

    // 1000 / 4 = 250 px asked for Modified; Author, on its left, gives
    // 250 - 110 = 140.
    expect(round(pixels)).toEqual({
      Name: 550,
      Author: 110,
      Modified: 140,
      Size: 200,
      Menu: 68,
    });
  });

  it("treats invalid values as unknown", () => {
    const stored = {
      Name: Number.NaN,
      Author: -1,
      Modified: "0.5" as unknown as number,
      Size: Number.POSITIVE_INFINITY,
    };

    expect(restoreFractions(SPEC_COLUMNS, stored, SPEC_WIDTH)).toEqual(
      getDefaultFractions(SPEC_COLUMNS, SPEC_WIDTH),
    );
  });
});

describe("invariants over random operations", () => {
  // mulberry32: a small seeded generator, so a failure replays exactly.
  const random = (seed: number) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const POOL: LayoutColumn[] = [
    fixed("Index", 33),
    fill(),
    flex("Author"),
    flex("Created"),
    flex("Modified", 130),
    flex("Size"),
    flex("Type"),
    fixed("Menu", 68),
  ];

  const check = (
    columns: LayoutColumn[],
    shares: ColumnFractions,
    width: number,
    step: string,
  ) => {
    const flexibleIds = columns.filter(isFlexible).map((c) => c.id);

    expect(Object.keys(shares).sort(), step).toEqual([...flexibleIds].sort());
    if (flexibleIds.length) expect(sumOf(shares), step).toBeCloseTo(1, 9);
    Object.values(shares).forEach((v) =>
      expect(v, step).toBeGreaterThanOrEqual(0),
    );

    if (isCompact(columns, width) || !flexibleIds.length) return;

    const pixels = toPixels(columns, shares, width);
    expect(sumOf(pixels), step).toBeCloseTo(width, 6);
    columns.forEach((c) =>
      expect(pixels[c.id], `${step}: ${c.id}`).toBeGreaterThanOrEqual(
        getMinWidth(c) - 1e-6,
      ),
    );
  };

  it.each([1, 2, 3, 4, 5, 6, 7, 8])(
    "keeps the shares whole and the total width fixed (seed %i)",
    (seed) => {
      const next = random(seed);
      let columns = POOL.filter(() => next() > 0.3);
      if (!columns.some(isFill)) columns = [fill(), ...columns];
      let width = 600 + Math.floor(next() * 1400);
      let shares = getDefaultFractions(columns, width);

      for (let step = 0; step < 400; step += 1) {
        const roll = next();
        let label: string;

        if (roll < 0.5) {
          const column = columns[Math.floor(next() * columns.length)];
          const delta = (next() - 0.5) * 800;
          label = `#${step} resize ${column.id} by ${delta.toFixed(1)}`;
          const before = toPixels(columns, shares, width);
          shares = resizeColumn(columns, shares, width, column.id, delta);

          if (!isCompact(columns, width)) {
            const after = toPixels(columns, shares, width);
            columns
              .filter((c) => !isFlexible(c))
              .forEach((c) => expect(after[c.id], label).toBe(before[c.id]));
          }
        } else if (roll < 0.65 && columns.length > 2) {
          const candidates = columns.filter((c) => !isFill(c));
          const column = candidates[Math.floor(next() * candidates.length)];
          label = `#${step} hide ${column.id}`;
          shares = hideColumn(columns, shares, width, column.id);
          columns = columns.filter((c) => c !== column);
        } else if (roll < 0.8) {
          const hidden = POOL.filter(
            (c) => !columns.some((x) => x.id === c.id),
          );
          if (!hidden.length) continue;
          const column = hidden[Math.floor(next() * hidden.length)];
          label = `#${step} show ${column.id}`;
          const after = POOL.filter(
            (c) => c === column || columns.some((x) => x.id === c.id),
          );
          shares = showColumn(after, shares, width, column.id);
          columns = after;
        } else {
          width = 400 + Math.floor(next() * 1600);
          label = `#${step} container ${width}`;
        }

        check(columns, shares, width, label);
      }
    },
  );

  it("only grows the column on the other side of the boundary", () => {
    const next = random(42);

    for (let step = 0; step < 300; step += 1) {
      const width = 900 + Math.floor(next() * 900);
      const shares = getDefaultFractions(SPEC_COLUMNS, width);
      const handles = SPEC_COLUMNS.filter((c) =>
        hasResizeHandle(SPEC_COLUMNS, c.id),
      );
      const column = handles[Math.floor(next() * handles.length)];
      const delta = (next() - 0.5) * 600;
      const index = SPEC_COLUMNS.indexOf(column);

      const before = toPixels(SPEC_COLUMNS, shares, width);
      const after = toPixels(
        SPEC_COLUMNS,
        resizeColumn(SPEC_COLUMNS, shares, width, column.id, delta),
        width,
      );
      const grown = SPEC_COLUMNS.filter(
        (c) => after[c.id] > before[c.id] + 1e-6,
      );

      expect(grown.length).toBeLessThanOrEqual(1);
      if (grown.length) {
        const grownIndex = SPEC_COLUMNS.indexOf(grown[0]);
        expect(grownIndex).toBe(delta > 0 ? index : index + 1);
      }
      expect(getFlexibleArea(SPEC_COLUMNS, width)).toBeCloseTo(
        sumOf(after) - 68,
        6,
      );
    }
  });
});
