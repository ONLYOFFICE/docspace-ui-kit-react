/**
 * Column-width engine of DataTable: pure functions, no React and no DOM.
 *
 * The state is a share of the flexible area per `fill`/`flex` column id
 * (`ColumnFractions`, summing to 1). `fixed` columns have no state: they are
 * always their own size. Pixels are derived from the shares and the container
 * width by `toPixels`, which resolves the shares the way CSS grid resolves the
 * `minmax(<min>px, <share>fr)` tracks `grid.ts` emits, so what this module
 * computes is what the browser draws.
 *
 * The rules come from the design spec of the table header:
 * - a reset gives the `fill` column 40 % and splits 60 % between the `flex` ones;
 * - a drag moves the boundary between a column and the next resizable one,
 *   shrinking the columns on the side the pointer moves to, nearest first, each
 *   down to its minimum, while the column on the other side grows;
 * - a hidden column hands its width to its left neighbour;
 * - a shown column takes 60 % of the flexible area divided by the number of
 *   flexible columns, from the widest one, or the layout resets when that
 *   breaks a minimum;
 * - when the minimums no longer fit, only `fill` and `fixed` columns render.
 */

import {
  DATA_TABLE_FILL_SHARE,
  DATA_TABLE_MIN_COLUMN_WIDTH,
  DATA_TABLE_MIN_FILL_WIDTH,
} from "../DataTable.constants";

/** How a column takes its width. */
export type ColumnWidth =
  /** The wide column (Name): 40 % on a reset, kept in compact mode. */
  | { type: "fill"; min?: number }
  /** A resizable column whose share of the flexible area is persisted. */
  | { type: "flex"; min?: number }
  /** A column of a constant size, never resized and never persisted. */
  | { type: "fixed"; size: number };

/** What the engine needs to know about a visible column. */
export type LayoutColumn = {
  /** Identifier, the key of the column's share. */
  id: string;
  /** How the column takes its width. */
  width: ColumnWidth;
  /** Whether a drag may change the column. Ignored for `fixed` columns.
   * @default true */
  resizable?: boolean;
};

/** Share of the flexible area per `fill`/`flex` column id, summing to 1. */
export type ColumnFractions = Record<string, number>;

/** Width in pixels per column id. */
export type ColumnPixels = Record<string, number>;

const EPSILON = 1e-6;

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

/** Whether the column takes part in the shares, that is, is not `fixed`. */
export const isFlexible = (column: LayoutColumn) =>
  column.width.type !== "fixed";

/** Whether the column is a `fill` column. */
export const isFill = (column: LayoutColumn) => column.width.type === "fill";

const isResizable = (column: LayoutColumn) =>
  isFlexible(column) && column.resizable !== false;

const isValidShare = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

/** Narrowest the column may be, in pixels; a `fixed` column's size. */
export const getMinWidth = (column: LayoutColumn): number => {
  switch (column.width.type) {
    case "fixed":
      return column.width.size;
    case "fill":
      return column.width.min ?? DATA_TABLE_MIN_FILL_WIDTH;
    default:
      return column.width.min ?? DATA_TABLE_MIN_COLUMN_WIDTH;
  }
};

/** Total width of the `fixed` columns. */
export const getFixedWidth = (columns: LayoutColumn[]) =>
  sum(columns.filter((c) => !isFlexible(c)).map(getMinWidth));

/** Width left for the `fill`/`flex` columns once the `fixed` ones are placed. */
export const getFlexibleArea = (
  columns: LayoutColumn[],
  containerWidth: number,
) => Math.max(0, containerWidth - getFixedWidth(columns));

/** Width every column needs at its minimum, `fixed` ones included. */
export const getRequiredWidth = (columns: LayoutColumn[]) =>
  sum(columns.map(getMinWidth));

/**
 * Whether the columns no longer fit at their minimums, so that only the `fill`
 * and `fixed` ones render (the design's "hide all columns" state). The limit is
 * inclusive: a container exactly as wide as the minimums still fits.
 *
 * A container of width 0 is collapsed rather than narrow; callers measure
 * before asking.
 */
export const isCompact = (columns: LayoutColumn[], containerWidth: number) =>
  getRequiredWidth(columns) > containerWidth + EPSILON;

/**
 * The columns rendered in compact mode: every `fixed` one and the `fill` ones,
 * or the first flexible one when there is no `fill` column.
 */
export const getCompactColumns = (columns: LayoutColumn[]) => {
  const fills = columns.filter(isFill);
  const kept = fills.length ? fills : columns.filter(isFlexible).slice(0, 1);

  return columns.filter((c) => !isFlexible(c) || kept.includes(c));
};

/** Scales positive weights of the flexible columns to shares summing to 1. */
const normalize = (
  columns: LayoutColumn[],
  weights: Record<string, number>,
): ColumnFractions => {
  const flexible = columns.filter(isFlexible);
  const valueOf = (c: LayoutColumn) => Math.max(0, weights[c.id] ?? 0);
  const total = sum(flexible.map(valueOf));
  const fractions: ColumnFractions = {};

  flexible.forEach((c) => {
    fractions[c.id] =
      total > EPSILON ? valueOf(c) / total : 1 / flexible.length;
  });

  return fractions;
};

/**
 * Shares after a reset: 40 % for the `fill` columns, 60 % split equally between
 * the `flex` ones, or equal shares when there is no `fill` column. When the
 * container is known and wide enough, a `flex` share below its minimum is
 * topped up from the `fill` columns.
 */
export const getDefaultFractions = (
  columns: LayoutColumn[],
  containerWidth: number,
): ColumnFractions => {
  const flexible = columns.filter(isFlexible);
  if (!flexible.length) return {};

  const fills = flexible.filter(isFill);
  const others = flexible.filter((c) => !isFill(c));
  const weights: Record<string, number> = {};

  if (!fills.length) {
    others.forEach((c) => {
      weights[c.id] = 1;
    });
    return normalize(columns, weights);
  }

  const fillShare = others.length ? DATA_TABLE_FILL_SHARE : 1;
  const otherShare = others.length ? (1 - fillShare) / others.length : 0;
  const area = getFlexibleArea(columns, containerWidth);
  const fits = area > 0 && area + EPSILON >= sum(flexible.map(getMinWidth));

  if (!fits) {
    // Unknown or too narrow: plain shares, so that a layout computed while
    // compact still looks right once the container grows.
    others.forEach((c) => {
      weights[c.id] = otherShare;
    });
    fills.forEach((c) => {
      weights[c.id] = fillShare / fills.length;
    });
    return normalize(columns, weights);
  }

  let othersWidth = 0;
  others.forEach((c) => {
    const width = Math.max(area * otherShare, getMinWidth(c));
    weights[c.id] = width;
    othersWidth += width;
  });
  fills.forEach((c) => {
    weights[c.id] = (area - othersWidth) / fills.length;
  });

  return normalize(columns, weights);
};

/**
 * Pixel width of every column. Flexible columns resolve the way CSS grid
 * resolves `minmax(<min>px, <share>fr)`: a column whose share of the free space
 * falls below its minimum is frozen at the minimum, and the rest is shared
 * again between the others, until no column is below its minimum.
 */
export const toPixels = (
  columns: LayoutColumn[],
  fractions: ColumnFractions,
  containerWidth: number,
): ColumnPixels => {
  const pixels: ColumnPixels = {};
  columns
    .filter((c) => !isFlexible(c))
    .forEach((c) => {
      pixels[c.id] = getMinWidth(c);
    });

  let free = getFlexibleArea(columns, containerWidth);
  let active = columns.filter(isFlexible);
  const shareOf = (c: LayoutColumn) => Math.max(0, fractions[c.id] ?? 0);

  while (active.length) {
    const total = sum(active.map(shareOf));
    const widthOf = (c: LayoutColumn) =>
      total > EPSILON ? (free * shareOf(c)) / total : 0;
    const frozen = active.filter((c) => widthOf(c) < getMinWidth(c) - EPSILON);

    if (!frozen.length) {
      active.forEach((c) => {
        pixels[c.id] = widthOf(c);
      });
      break;
    }

    frozen.forEach((c) => {
      pixels[c.id] = getMinWidth(c);
      free -= getMinWidth(c);
    });
    active = active.filter((c) => !frozen.includes(c));
  }

  return pixels;
};

/** Shares of the flexible columns from their pixel widths. */
export const toFractions = (
  columns: LayoutColumn[],
  pixels: ColumnPixels,
): ColumnFractions => normalize(columns, pixels);

/**
 * Whether the column draws a resize handle on its trailing edge: it is
 * resizable and some resizable column follows it.
 */
export const hasResizeHandle = (columns: LayoutColumn[], columnId: string) => {
  const index = columns.findIndex((c) => c.id === columnId);
  if (index < 0 || !isResizable(columns[index])) return false;

  return columns.slice(index + 1).some(isResizable);
};

/**
 * Turns a horizontal pointer movement into a movement along the reading
 * direction, which is what `resizeColumn` takes.
 */
export const toLogicalDelta = (deltaX: number, isRTL: boolean) =>
  isRTL ? -deltaX : deltaX;

/**
 * Moves the trailing edge of `columnId` by `delta` pixels along the reading
 * direction. A positive delta grows the column and shrinks the resizable
 * columns after it, nearest first, each down to its minimum; a negative one
 * grows the next resizable column and shrinks this one and those before it,
 * nearest first. The movement stops where every column on the shrinking side
 * is at its minimum, so the total width never changes. In compact mode there
 * is nothing to drag and the shares are returned as they are.
 */
export const resizeColumn = (
  columns: LayoutColumn[],
  fractions: ColumnFractions,
  containerWidth: number,
  columnId: string,
  delta: number,
): ColumnFractions => {
  if (
    !hasResizeHandle(columns, columnId) ||
    Math.abs(delta) < EPSILON ||
    isCompact(columns, containerWidth)
  )
    return fractions;

  const index = columns.findIndex((c) => c.id === columnId);
  const before = columns
    .slice(0, index + 1)
    .filter(isResizable)
    .reverse();
  const after = columns.slice(index + 1).filter(isResizable);

  const grower = delta > 0 ? columns[index] : after[0];
  const shrinkers = delta > 0 ? after : before;

  const pixels = toPixels(columns, fractions, containerWidth);
  let remaining = Math.abs(delta);

  for (const column of shrinkers) {
    if (remaining < EPSILON) break;

    const room = Math.max(0, pixels[column.id] - getMinWidth(column));
    const taken = Math.min(room, remaining);
    pixels[column.id] -= taken;
    remaining -= taken;
  }

  pixels[grower.id] += Math.abs(delta) - remaining;

  return toFractions(columns, pixels);
};

/**
 * Shares once `columnId` is hidden: its width goes to the nearest flexible
 * column on its left, or on its right when it is the first one, so nothing
 * else moves. The result is keyed by the remaining columns.
 *
 * Before the container is measured, or while the layout is compact and the
 * pixel widths say nothing about the shares, the share itself is moved.
 */
export const hideColumn = (
  columns: LayoutColumn[],
  fractions: ColumnFractions,
  containerWidth: number,
  columnId: string,
): ColumnFractions => {
  const index = columns.findIndex((c) => c.id === columnId);
  if (index < 0) return normalize(columns, fractions);

  const rest = columns.filter((_, i) => i !== index);
  const receiver =
    columns.slice(0, index).reverse().find(isFlexible) ??
    columns.slice(index + 1).find(isFlexible);

  if (containerWidth <= 0 || isCompact(columns, containerWidth)) {
    const weights = { ...fractions };
    if (receiver && isFlexible(columns[index])) {
      weights[receiver.id] =
        (weights[receiver.id] ?? 0) + (fractions[columnId] ?? 0);
    }
    return normalize(rest, weights);
  }

  const pixels = toPixels(columns, fractions, containerWidth);
  if (receiver) pixels[receiver.id] += pixels[columnId];

  return toFractions(rest, pixels);
};

/**
 * Shares once `columnId` is shown. `columnsAfter` lists the visible columns
 * with it; `fractions` are those of the columns before it appeared.
 *
 * A flexible column gets 60 % of the flexible area divided by the number of
 * flexible columns, itself included (the spec's 807 px and four columns give
 * 121 px); a `fixed` one gets its size. Either way the width comes from the
 * widest flexible column. If that leaves any column below its minimum, the
 * layout resets to the defaults instead.
 *
 * While the layout is compact the same rule runs on the shares, without the
 * minimum check, which only means something at a width where they fit. Before
 * the container is measured the layout resets.
 */
export const showColumn = (
  columnsAfter: LayoutColumn[],
  fractions: ColumnFractions,
  containerWidth: number,
  columnId: string,
): ColumnFractions => {
  const column = columnsAfter.find((c) => c.id === columnId);
  const reset = () => getDefaultFractions(columnsAfter, containerWidth);
  if (!column) return normalize(columnsAfter, fractions);

  const columnsBefore = columnsAfter.filter((c) => c !== column);
  const area = getFlexibleArea(columnsAfter, containerWidth);
  if (area <= 0) return reset();

  const flexibleAfter = columnsAfter.filter(isFlexible);
  const share =
    (flexibleAfter.some(isFill) ? 1 - DATA_TABLE_FILL_SHARE : 1) /
    flexibleAfter.length;

  if (isCompact(columnsAfter, containerWidth)) {
    if (!isFlexible(column)) return normalize(columnsAfter, fractions);

    const shares = normalize(columnsBefore, fractions);
    const widest = columnsBefore
      .filter(isFlexible)
      .reduce<LayoutColumn | null>(
        (best, c) => (!best || shares[c.id] > shares[best.id] ? c : best),
        null,
      );
    if (!widest || shares[widest.id] <= share) return reset();

    shares[widest.id] -= share;
    shares[column.id] = share;
    return normalize(columnsAfter, shares);
  }

  const width = isFlexible(column) ? area * share : getMinWidth(column);

  const pixels = toPixels(columnsBefore, fractions, containerWidth);
  const widest = columnsBefore
    .filter(isFlexible)
    .reduce<LayoutColumn | null>(
      (best, c) => (!best || pixels[c.id] > pixels[best.id] ? c : best),
      null,
    );
  if (!widest) return reset();

  pixels[widest.id] -= width;
  pixels[column.id] = width;

  const breaksMinimum =
    pixels[widest.id] < getMinWidth(widest) - EPSILON ||
    (isFlexible(column) && width < getMinWidth(column) - EPSILON);

  return breaksMinimum ? reset() : toFractions(columnsAfter, pixels);
};

/**
 * Shares for the visible columns after they changed from `prevColumns` to
 * `nextColumns`: every removed column is hidden and every added one shown, in
 * order, by the rules above. Columns that only moved or changed their width
 * spec keep their shares.
 */
export const reconcileColumns = (
  prevColumns: LayoutColumn[],
  nextColumns: LayoutColumn[],
  fractions: ColumnFractions,
  containerWidth: number,
): ColumnFractions => {
  const nextIds = new Set(nextColumns.map((c) => c.id));
  let current = prevColumns;
  let shares = fractions;

  prevColumns
    .filter((c) => !nextIds.has(c.id))
    .forEach((c) => {
      shares = hideColumn(current, shares, containerWidth, c.id);
      current = current.filter((x) => x.id !== c.id);
    });

  const present = new Set(current.map((c) => c.id));
  nextColumns
    .filter((c) => !present.has(c.id))
    .forEach((c) => {
      present.add(c.id);
      current = nextColumns.filter((x) => present.has(x.id));
      shares = showColumn(current, shares, containerWidth, c.id);
    });

  return normalize(nextColumns, shares);
};

/**
 * Shares for the visible columns from a stored record. Ids the record does not
 * know are shown one by one as if the user had just turned them on; ids it
 * holds for columns that are not visible are ignored. A missing record, or one
 * that knows none of the visible columns, gives the defaults.
 */
export const restoreFractions = (
  columns: LayoutColumn[],
  stored: ColumnFractions | null | undefined,
  containerWidth: number,
): ColumnFractions => {
  const known = columns.filter(
    (c) => isFlexible(c) && isValidShare(stored?.[c.id]),
  );
  if (!stored || !known.length) {
    return getDefaultFractions(columns, containerWidth);
  }

  const knownColumns = columns.filter(
    (c) => !isFlexible(c) || known.includes(c),
  );

  return reconcileColumns(
    knownColumns,
    columns,
    normalize(knownColumns, stored),
    containerWidth,
  );
};
