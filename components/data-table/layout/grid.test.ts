import { describe, expect, it } from "vitest";

import type { LayoutColumn } from "./engine";
import { buildGridTemplate, getRenderedColumns } from "./grid";

const COLUMNS: LayoutColumn[] = [
  { id: "Index", width: { type: "fixed", size: 33 } },
  { id: "Name", width: { type: "fill" } },
  { id: "Author", width: { type: "flex" } },
  { id: "Size", width: { type: "flex", min: 90 } },
  { id: "Menu", width: { type: "fixed", size: 68 } },
];

describe("buildGridTemplate", () => {
  it("emits px for fixed columns and minmax(min, share fr) for flexible ones", () => {
    expect(
      buildGridTemplate(COLUMNS, { Name: 0.4, Author: 0.3, Size: 0.3 }, false),
    ).toBe(
      "33px minmax(210px, 40fr) minmax(110px, 30fr) minmax(90px, 30fr) 68px",
    );
  });

  it("rounds the factors to four decimals", () => {
    expect(
      buildGridTemplate(
        COLUMNS,
        { Name: 1 / 3, Author: 1 / 3, Size: 1 / 3 },
        false,
      ),
    ).toBe(
      "33px minmax(210px, 33.3333fr) minmax(110px, 33.3333fr) minmax(90px, 33.3333fr) 68px",
    );
  });

  it("gives a column without a share 0fr, so it sits at its minimum", () => {
    expect(buildGridTemplate(COLUMNS, { Name: 0.5, Author: 0.5 }, false)).toBe(
      "33px minmax(210px, 50fr) minmax(110px, 50fr) minmax(90px, 0fr) 68px",
    );
  });

  it("keeps only fixed and fill columns in compact mode, with no minimum", () => {
    expect(buildGridTemplate(COLUMNS, { Name: 0.4 }, true)).toBe(
      "33px minmax(0px, 1fr) 68px",
    );
  });

  it("emits as many tracks as columns render", () => {
    [false, true].forEach((compact) => {
      const tracks = buildGridTemplate(
        COLUMNS,
        { Name: 0.4, Author: 0.3, Size: 0.3 },
        compact,
      ).split(/ (?![^(]*\))/);

      expect(tracks).toHaveLength(getRenderedColumns(COLUMNS, compact).length);
    });
  });
});

describe("getRenderedColumns", () => {
  it("returns the columns themselves outside compact mode", () => {
    expect(getRenderedColumns(COLUMNS, false)).toBe(COLUMNS);
  });

  it("keeps the caller's column type", () => {
    const columns = COLUMNS.map((c) => ({ ...c, title: c.id }));

    expect(getRenderedColumns(columns, true).map((c) => c.title)).toEqual([
      "Index",
      "Name",
      "Menu",
    ]);
  });
});
