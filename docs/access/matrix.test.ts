import { describe, expect, it } from "vitest";

import { MATRICES, PORTAL_TYPES, ROOM_ROLES } from "./matrix";

// The tables are typed, but `columns` narrows a table to fewer columns than
// its axis has, and a cell outside them would silently never be drawn.
describe("access matrices", () => {
  for (const [name, matrix] of Object.entries(MATRICES)) {
    const axis: readonly { key: string }[] =
      matrix.axis === "type" ? PORTAL_TYPES : ROOM_ROLES;
    const columns: readonly string[] =
      "columns" in matrix ? matrix.columns : axis.map((column) => column.key);

    it(`${name}: every allowed key is one of its columns`, () => {
      for (const row of matrix.rows) {
        for (const key of row.allowed as readonly string[]) {
          expect(columns, `${row.action}: ${key}`).toContain(key);
        }
      }
    });

    it(`${name}: no action is listed twice`, () => {
      const actions = matrix.rows.map((row) => row.action);
      expect(new Set(actions).size).toBe(actions.length);
    });
  }
});
