/**
 * Where a DataTable keeps its column widths between visits.
 *
 * Only the shares of the `fill`/`flex` columns are stored, keyed by column id,
 * as `{ "v": 2, "widths": { "<id>": <share> } }`. Shares do not depend on the
 * window width, so a narrow and a wide window reading one record draw the same
 * proportions, and an info panel opening needs no second record. Keying by id
 * means a record written by another table, or by an older column set, cannot
 * misplace widths: unknown ids are ignored and missing ones are shown by the
 * engine's rules (`restoreFractions`).
 *
 * The version starts at 2 because the old table stored a pixel string such as
 * `"320px 110px 0px 24px"`; that and anything else unrecognised reads as
 * "nothing stored".
 */

import type { ColumnFractions } from "./engine";

/** Version of the stored record; anything else is ignored. */
export const DATA_TABLE_STORAGE_VERSION = 2;

/** The stored record. */
export type WidthRecord = {
  /** Always `DATA_TABLE_STORAGE_VERSION`. */
  v: typeof DATA_TABLE_STORAGE_VERSION;
  /** Share of the flexible area per column id. */
  widths: ColumnFractions;
};

/** Where a table keeps its column shares. */
export interface WidthStorage {
  /**
   * Identifies the stored record, such as its storage key. A table reads the
   * record again only when this changes, so an adapter recreated on every
   * render with the same id costs nothing.
   */
  readonly id: string;
  /** The stored shares, or null when nothing usable is stored. */
  load(): ColumnFractions | null;
  /** Stores the shares. A failure to write is swallowed: the layout is simply not remembered. */
  save(fractions: ColumnFractions): void;
  /** Forgets the stored shares. */
  clear(): void;
}

const SHARE_DIGITS = 6;

const isValidShare = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * The shares in a stored string, or null when it is missing, not JSON, of
 * another version, or holds no valid share. Invalid entries are dropped one by
 * one rather than discarding the record.
 */
export const parseWidthRecord = (
  raw: string | null | undefined,
): ColumnFractions | null => {
  if (!raw) return null;

  let record: unknown;
  try {
    record = JSON.parse(raw);
  } catch {
    return null;
  }

  if (
    !isPlainObject(record) ||
    record.v !== DATA_TABLE_STORAGE_VERSION ||
    !isPlainObject(record.widths)
  )
    return null;

  const shares: ColumnFractions = {};
  Object.entries(record.widths).forEach(([id, share]) => {
    if (isValidShare(share)) shares[id] = share;
  });

  return Object.keys(shares).length ? shares : null;
};

/** The string stored for these shares, rounded to six decimals. */
export const serializeWidthRecord = (fractions: ColumnFractions): string => {
  const widths: ColumnFractions = {};
  Object.entries(fractions).forEach(([id, share]) => {
    if (isValidShare(share)) widths[id] = Number(share.toFixed(SHARE_DIGITS));
  });

  const record: WidthRecord = { v: DATA_TABLE_STORAGE_VERSION, widths };
  return JSON.stringify(record);
};

const browserLocalStorage = (): Storage | undefined =>
  typeof window === "undefined" ? undefined : window.localStorage;

/**
 * Keeps the shares under `key` in `localStorage`, or in the `Storage` that
 * `getStorage` returns (`() => window.sessionStorage`, for one).
 *
 * Every access is guarded: with no `window` (server rendering), with storage
 * blocked (reading `window.localStorage` throws in some privacy modes) or full,
 * the table still works and only forgets its layout. The key has to be unique
 * per table and per user, since it is the only thing that tells two layouts
 * apart.
 */
export const createLocalStorageWidths = (
  key: string,
  getStorage: () => Storage | null | undefined = browserLocalStorage,
): WidthStorage => {
  const storage = (): Storage | null => {
    try {
      return getStorage() ?? null;
    } catch {
      return null;
    }
  };

  return {
    id: key,
    load() {
      try {
        return parseWidthRecord(storage()?.getItem(key));
      } catch {
        return null;
      }
    },
    save(fractions) {
      try {
        storage()?.setItem(key, serializeWidthRecord(fractions));
      } catch {
        // Full or blocked: the layout is simply not remembered.
      }
    },
    clear() {
      try {
        storage()?.removeItem(key);
      } catch {
        // Blocked: there is nothing to clear that could be read back.
      }
    },
  };
};

let memoryCount = 0;

/**
 * Keeps the shares in memory, for as long as the adapter lives: for tests,
 * stories, and tables that should remember a layout for one session only.
 * Each adapter has an id of its own.
 */
export const createMemoryWidths = (initial?: ColumnFractions): WidthStorage => {
  memoryCount += 1;
  let stored: string | null = initial ? serializeWidthRecord(initial) : null;

  return {
    id: `memory-${memoryCount}`,
    load: () => parseWidthRecord(stored),
    save(fractions) {
      stored = serializeWidthRecord(fractions);
    },
    clear() {
      stored = null;
    },
  };
};
