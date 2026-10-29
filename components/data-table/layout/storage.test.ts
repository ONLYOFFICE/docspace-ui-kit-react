import { afterEach, describe, expect, it, vi } from "vitest";

import { type LayoutColumn, restoreFractions } from "./engine";
import {
  DATA_TABLE_STORAGE_VERSION,
  createLocalStorageWidths,
  createMemoryWidths,
  parseWidthRecord,
  serializeWidthRecord,
} from "./storage";

const KEY = "filesColumnsWidths_ver-1=user";

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("parseWidthRecord", () => {
  it("reads the shares of a valid record", () => {
    expect(
      parseWidthRecord('{"v":2,"widths":{"Name":0.4,"Author":0.6}}'),
    ).toEqual({ Name: 0.4, Author: 0.6 });
  });

  it.each([
    ["nothing", null],
    ["an empty string", ""],
    ["text that is not JSON", "{oops"],
    ["the old pixel string", "320px 110px 0px 24px"],
    ["a JSON array", "[0.4,0.6]"],
    ["JSON null", "null"],
    ["another version", '{"v":1,"widths":{"Name":0.4}}'],
    ["no version", '{"widths":{"Name":0.4}}'],
    ["widths that are not an object", '{"v":2,"widths":[0.4]}'],
    ["no valid share at all", '{"v":2,"widths":{"Name":0,"Author":-1}}'],
  ])("reads %s as nothing stored", (_, raw) => {
    expect(parseWidthRecord(raw)).toBeNull();
  });

  it("drops invalid entries and keeps the rest", () => {
    expect(
      parseWidthRecord(
        '{"v":2,"widths":{"Name":0.5,"Author":"0.2","Size":null,"Type":-0.1,"Tags":0.5}}',
      ),
    ).toEqual({ Name: 0.5, Tags: 0.5 });
  });

  it("ignores extra fields", () => {
    expect(
      parseWidthRecord('{"v":2,"widths":{"Name":1},"savedAt":"2026-10-29"}'),
    ).toEqual({ Name: 1 });
  });
});

describe("serializeWidthRecord", () => {
  it("writes the versioned record, rounded to six decimals", () => {
    expect(
      JSON.parse(serializeWidthRecord({ Name: 1 / 3, Author: 2 / 3 })),
    ).toEqual({
      v: DATA_TABLE_STORAGE_VERSION,
      widths: { Name: 0.333333, Author: 0.666667 },
    });
  });

  it("leaves invalid shares out", () => {
    expect(
      JSON.parse(
        serializeWidthRecord({ Name: 0.7, Author: Number.NaN, Size: 0 }),
      ).widths,
    ).toEqual({ Name: 0.7 });
  });

  it("round-trips through parseWidthRecord", () => {
    const shares = { Name: 0.4, Author: 0.25, Size: 0.35 };

    expect(parseWidthRecord(serializeWidthRecord(shares))).toEqual(shares);
  });
});

describe("createLocalStorageWidths", () => {
  it("saves under its key and loads it back", () => {
    const storage = createLocalStorageWidths(KEY);
    storage.save({ Name: 0.4, Author: 0.6 });

    expect(storage.id).toBe(KEY);
    expect(JSON.parse(localStorage.getItem(KEY) ?? "")).toEqual({
      v: 2,
      widths: { Name: 0.4, Author: 0.6 },
    });
    expect(createLocalStorageWidths(KEY).load()).toEqual({
      Name: 0.4,
      Author: 0.6,
    });
  });

  it("loads nothing before anything is saved", () => {
    expect(createLocalStorageWidths(KEY).load()).toBeNull();
  });

  it("keeps two tables apart", () => {
    const files = createLocalStorageWidths("files");
    const trash = createLocalStorageWidths("trash");
    files.save({ Name: 0.7, Size: 0.3 });

    expect(trash.load()).toBeNull();
    expect(files.load()).toEqual({ Name: 0.7, Size: 0.3 });
  });

  it("forgets the record on clear", () => {
    const storage = createLocalStorageWidths(KEY);
    storage.save({ Name: 1 });
    storage.clear();

    expect(localStorage.getItem(KEY)).toBeNull();
    expect(storage.load()).toBeNull();
  });

  it("reads a record of the old table as nothing stored", () => {
    localStorage.setItem(KEY, "406.4px 120px 120px 0px 24px");

    expect(createLocalStorageWidths(KEY).load()).toBeNull();
  });

  it("uses the Storage it is given", () => {
    const storage = createLocalStorageWidths(KEY, () => sessionStorage);
    storage.save({ Name: 1 });

    expect(sessionStorage.getItem(KEY)).not.toBeNull();
    expect(localStorage.getItem(KEY)).toBeNull();
    sessionStorage.clear();
  });

  describe("when storage misbehaves", () => {
    const blocked = () => {
      throw new DOMException("The operation is insecure.", "SecurityError");
    };

    it("works with storage blocked", () => {
      const storage = createLocalStorageWidths(KEY, blocked);

      expect(storage.load()).toBeNull();
      expect(() => storage.save({ Name: 1 })).not.toThrow();
      expect(() => storage.clear()).not.toThrow();
    });

    it("works with no storage at all, as on the server", () => {
      const storage = createLocalStorageWidths(KEY, () => undefined);

      expect(storage.load()).toBeNull();
      expect(() => storage.save({ Name: 1 })).not.toThrow();
    });

    it("swallows a full storage", () => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      });

      expect(() =>
        createLocalStorageWidths(KEY).save({ Name: 1 }),
      ).not.toThrow();
    });

    it("reads nothing when getItem throws", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("broken");
      });

      expect(createLocalStorageWidths(KEY).load()).toBeNull();
    });
  });
});

describe("createMemoryWidths", () => {
  it("starts with what it is given, or with nothing", () => {
    expect(createMemoryWidths({ Name: 0.5, Size: 0.5 }).load()).toEqual({
      Name: 0.5,
      Size: 0.5,
    });
    expect(createMemoryWidths().load()).toBeNull();
  });

  it("saves and clears", () => {
    const storage = createMemoryWidths();
    storage.save({ Name: 0.6, Size: 0.4 });
    expect(storage.load()).toEqual({ Name: 0.6, Size: 0.4 });

    storage.clear();
    expect(storage.load()).toBeNull();
  });

  it("does not share objects with the caller", () => {
    const shares = { Name: 0.6, Size: 0.4 };
    const storage = createMemoryWidths();
    storage.save(shares);
    shares.Name = 0.9;

    const loaded = storage.load();
    expect(loaded).toEqual({ Name: 0.6, Size: 0.4 });
    if (loaded) loaded.Size = 0.1;
    expect(storage.load()).toEqual({ Name: 0.6, Size: 0.4 });
  });

  it("gives every adapter an id of its own", () => {
    expect(createMemoryWidths().id).not.toBe(createMemoryWidths().id);
  });
});

describe("with the engine", () => {
  const COLUMNS: LayoutColumn[] = [
    { id: "Name", width: { type: "fill" } },
    { id: "Author", width: { type: "flex" } },
    { id: "Size", width: { type: "flex" } },
    { id: "Menu", width: { type: "fixed", size: 68 } },
  ];

  it("restores what was saved", () => {
    const storage = createLocalStorageWidths(KEY);
    storage.save({ Name: 0.5, Author: 0.3, Size: 0.2 });

    expect(restoreFractions(COLUMNS, storage.load(), 1068)).toEqual({
      Name: 0.5,
      Author: 0.3,
      Size: 0.2,
    });
  });

  it("falls back to the defaults for another table's record", () => {
    // Groups' record read under the files key: no id matches.
    localStorage.setItem(
      KEY,
      '{"v":2,"widths":{"Title":0.5,"Members":0.2,"Head":0.3}}',
    );

    expect(
      restoreFractions(COLUMNS, createLocalStorageWidths(KEY).load(), 1068),
    ).toEqual(restoreFractions(COLUMNS, null, 1068));
  });
});
