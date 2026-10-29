import {
  type ColumnFractions,
  type LayoutColumn,
  getCompactColumns,
  getMinWidth,
  isFlexible,
} from "./engine";

/**
 * A share becomes `share * 100` fr. CSS grid gives fr tracks whose factors sum
 * to less than 1 only that part of the free space, so shares (summing to 1,
 * give or take rounding) are scaled well away from that edge.
 */
const FR_SCALE = 100;

const formatNumber = (value: number) => String(Number(value.toFixed(4)));

/**
 * The columns that render: all of them, or in compact mode only the `fixed`
 * ones and the `fill` ones.
 */
export const getRenderedColumns = <T extends LayoutColumn>(
  columns: T[],
  compact: boolean,
): T[] => (compact ? (getCompactColumns(columns) as T[]) : columns);

/**
 * The `grid-template-columns` value shared by the header and every row.
 *
 * A `fixed` column is `<size>px`; a flexible one is `minmax(<min>px, <share>fr)`,
 * so the browser keeps the proportions on any container width with no script
 * running, and resolves a share below the minimum the way `toPixels` does. In
 * compact mode the remaining flexible columns take whatever is left, with no
 * minimum, since by definition the minimums do not fit.
 */
export const buildGridTemplate = (
  columns: LayoutColumn[],
  fractions: ColumnFractions,
  compact: boolean,
): string =>
  getRenderedColumns(columns, compact)
    .map((column) => {
      if (!isFlexible(column)) return `${formatNumber(getMinWidth(column))}px`;
      if (compact) return "minmax(0px, 1fr)";

      const share = Math.max(0, fractions[column.id] ?? 0) * FR_SCALE;
      return `minmax(${formatNumber(getMinWidth(column))}px, ${formatNumber(share)}fr)`;
    })
    .join(" ");
