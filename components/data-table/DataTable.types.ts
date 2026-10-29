import type React from "react";

import type { ColumnWidth } from "./layout/engine";
import type { WidthStorage } from "./layout/storage";

/** What a cell renderer is told besides its row. */
export type DataTableCellContext = {
  /** Position of the row in `rows`. */
  index: number;
  /**
   * Whether this is the last rendered column that is not `fixed`: the cell
   * where trailing content such as quick buttons belongs.
   */
  isLast: boolean;
  /** Whether the table is in compact mode, rendering only its `fill` and `fixed` columns. */
  compact: boolean;
};

/** What a header renderer is told. */
export type DataTableHeaderContext = {
  /** The table's current sort, if any. */
  sort?: DataTableSort;
  /** Whether the table is in compact mode. */
  compact: boolean;
};

/** The table's sort, as the consumer holds it; the table never sorts rows itself. */
export type DataTableSort = {
  /** The `sortKey` of the column the rows are sorted by. */
  key: string;
  /** Whether the order is descending. */
  desc: boolean;
};

/** One column: how it is sized, what its header says and how its cells render. */
export type DataTableColumn<T> = {
  /** Identifier of the column: the React key and the key its width is stored under. */
  id: string;
  /** Header text. Also the column's name in the column settings menu. */
  title: React.ReactNode;
  /** Renders the column's cell for one row. */
  cell: (row: T, context: DataTableCellContext) => React.ReactNode;
  /** Renders the header cell's content instead of `title`, for a checkbox or a settings button. */
  header?: (context: DataTableHeaderContext) => React.ReactNode;
  /** How the column takes its width: `fill` (the wide one), `flex` (resizable, stored) or `fixed`. */
  width: ColumnWidth;
  /** Whether the column is shown. A hidden column renders nothing, in the header or the rows.
   * @default true */
  visible?: boolean;
  /** Whether a drag may change the column's width. Ignored for `fixed` columns.
   * @default true */
  resizable?: boolean;
  /** Field the rows are sorted by when this header is clicked; makes the header a sort button. */
  sortKey?: string;
  /** Ref of the header cell element, for content that measures its column. */
  headerRef?: React.Ref<HTMLDivElement>;
  /** Applied to every cell of the column. */
  cellClassName?: string;
  /** Applied to the column's header cell. */
  headerClassName?: string;
};

export interface DataTableProps<T> {
  /**
   * Every column, in order, system columns (checkbox, settings, context menu)
   * included. Hidden ones stay in the list with `visible: false`. Keep the array
   * stable between renders (`useMemo`): a new array re-renders every row.
   */
  columns: DataTableColumn<T>[];
  /** The rows, rendered in this order. */
  rows: T[];
  /** Stable key of a row. */
  getRowKey: (row: T, index: number) => React.Key;
  /** Current sort, highlighted in the header. */
  sort?: DataTableSort;
  /** Called with a column's `sortKey` when its header is clicked. Without it, headers are not buttons. */
  onSortChange?: (sortKey: string) => void;
  /**
   * Where the column widths are remembered. Without it the table still lays
   * out and resizes, and forgets the layout on unmount.
   */
  widthStorage?: WidthStorage;
  /** Accessible name of the table. */
  ariaLabel?: string;
  /** Id of the table element. */
  id?: string;
  /** Applied to the table element. */
  className?: string;
  /** Id of the header element. */
  headerId?: string;
  /** Applied to the header element. */
  headerClassName?: string;
  /** Value of `data-testid` on the table element. */
  testId?: string;
  /** Ref of the table element. */
  ref?: React.Ref<HTMLDivElement>;
}
