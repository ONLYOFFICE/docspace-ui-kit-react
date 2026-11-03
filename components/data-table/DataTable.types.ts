import type React from "react";

import type { ContextMenuModel } from "../context-menu";

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
  /** Whether the column settings menu offers to show and hide this column. */
  hideable?: boolean;
  /** The column's name in the settings menu, when `title` is not plain text. */
  settingsLabel?: string;
  /** Whether a drag may change the column's width. Ignored for `fixed` columns.
   * @default true */
  resizable?: boolean;
  /** Field the rows are sorted by when this header is clicked; makes the header a sort button. */
  sortKey?: string;
  /** Ref of the header cell element, for content that measures its column. */
  headerRef?: React.Ref<HTMLDivElement>;
  /** Applied to every cell of the column. */
  cellClassName?: string;
  /** Value of `data-testid` on the column's cell in a row. */
  cellTestId?: (row: T, index: number) => string;
  /** Applied to the column's header cell. */
  headerClassName?: string;
  /**
   * Renders the column's cell in a row that is still loading, instead of the
   * default bar; `null` leaves it empty.
   */
  skeleton?: () => React.ReactNode;
};

/**
 * Attributes put on every cell of a row. Drag and drop finds all the cells of
 * the row under the pointer by a class and marks them, so a row-wide value has
 * to be on each cell rather than on the row.
 */
export type DataTableCellProps = {
  /** Added to the class of every cell. */
  className?: string;
  /** Applied to every cell. */
  style?: React.CSSProperties;
  /** Written to every cell as a `value` attribute, which drag and drop reads. */
  value?: string;
  /** Written to every cell as `data-document-title`. */
  documentTitle?: string;
};

/**
 * The menu of a row. It opens on a right-click anywhere in the row and from the
 * button of `contextMenuColumn`; without that column in the table there is no
 * menu at all.
 */
export type DataTableRowContextMenu = {
  /** Items of the menu. The button is drawn only while there are some. */
  options?: ContextMenuModel[];
  /** Builds the items each time the menu opens, instead of `options`. */
  getModel?: () => ContextMenuModel[];
  /** Called as the menu opens, with `true` when a right-click opened it. */
  onOpen?: (isRightClick: boolean) => void;
  /** Called when the menu closes. */
  onClose?: () => void;
  /** Accessible name and tooltip of the button. */
  title?: string;
  /** URL of the badge image in the menu's header. */
  badgeUrl?: string;
  /** Value of `data-testid` on the menu. */
  testId?: string;
};

/** The state and handlers of one row, from `getRowProps` or given to `DataTableRow` directly. */
export type DataTableRowState = {
  /** Marks the row as selected: the `checked` class and `aria-selected`. */
  checked?: boolean;
  /** Marks the row as the one being acted on, such as the one whose menu is open. */
  active?: boolean;
  /** Marks the row as being dragged. */
  dragging?: boolean;
  /** Applied to the row. */
  className?: string;
  /** Applied to the row. Widths do not belong here: they come from the table. */
  style?: React.CSSProperties;
  /** Put on every cell of the row. */
  cellProps?: DataTableCellProps;
  /** The row's menu, for `contextMenuColumn`. */
  contextMenu?: DataTableRowContextMenu;
  /** Called on a click anywhere in the row. */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Called on a double click anywhere in the row. */
  onDoubleClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Called on a right-click before the row's menu opens; `preventDefault()` keeps it closed. */
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Called when the pointer enters the row. */
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Called when the pointer leaves the row. */
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Value of `data-testid` on the row. */
  testId?: string;
};

/** Props of `DataTableRow`. */
export type DataTableRowProps<T> = DataTableRowState & {
  /** The row, handed to every cell renderer. */
  row: T;
  /** Position of the row in `rows`. */
  index: number;
  /** Ref of the row element. */
  ref?: React.Ref<HTMLDivElement>;
};

/** What `renderRow` is given for one row. */
export type DataTableRenderRowProps<T> = {
  /** The row. */
  row: T;
  /** Position of the row in `rows`. */
  index: number;
  /** What `getRowProps` returned for the row; empty without it. */
  rowProps: DataTableRowState;
};

/** How a virtualised table finds its scroller and how many rows it renders. */
export type DataTableVirtualize = {
  /**
   * The element that scrolls the table. Without it, the nearest scrolling
   * ancestor, or the window when there is none.
   */
  scrollElement?: HTMLElement | null;
  /** Rows rendered beyond each edge of the visible ones.
   * @default 5 */
  overscan?: number;
  /** Applied to the element that holds the rows, the full height of the list. */
  innerClassName?: string;
  /**
   * Draws skeleton rows instead of the real ones while the list is flung
   * faster than 800 px between two scroll events, so heavy rows are not
   * rendered only to scroll away.
   * @default true */
  skeletonOnFastScroll?: boolean;
};

/** How a table asks for more rows as the user scrolls towards the end. */
export type DataTableLoadMore = {
  /** Whether there are rows beyond `rows` still to load. */
  hasMore: boolean;
  /**
   * Called when the view comes within `threshold` rows of the last loaded
   * one. A returned promise holds off the next call until it settles.
   */
  onLoadMore: () => Promise<unknown> | void;
  /** How many rows before the last loaded one the next page is asked for.
   * @default 15 */
  threshold?: number;
  /** Skeleton rows drawn after the loaded ones while `hasMore`.
   * @default 2 */
  skeletonRows?: number;
};

/** What a table's `apiRef` exposes. */
export type DataTableApi = {
  /** Scrolls until the row at `index` is in view; `align` says where. */
  scrollToIndex: (
    index: number,
    options?: { align?: "start" | "center" | "end" | "auto" },
  ) => void;
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
  /**
   * The state and handlers of a row: selection, its menu, attributes for every
   * cell. Keep the function stable between renders, or every row re-renders.
   */
  getRowProps?: (row: T, index: number) => DataTableRowState;
  /**
   * Renders a row instead of the default `DataTableRow`, to wrap it or to give
   * it state the consumer computes in a component of its own. Return a
   * `DataTableRow` for the row, with `rowProps` spread on it. Keep the function
   * stable between renders.
   */
  renderRow?: (props: DataTableRenderRowProps<T>) => React.ReactNode;
  /** Current sort, highlighted in the header. */
  sort?: DataTableSort;
  /** Called with a column's `sortKey` when its header is clicked. Without it, headers are not buttons. */
  onSortChange?: (sortKey: string) => void;
  /**
   * Called when the user ticks or unticks a column in the settings menu, and
   * with `true` when `sort` moves to a hidden `hideable` column. The table does
   * not hide anything itself: update the column's `visible`.
   */
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
  /** Called when the table enters or leaves compact mode, where only `fill` and `fixed` columns render. */
  onCompactChange?: (compact: boolean) => void;
  /**
   * Where the column widths are remembered. Without it the table still lays
   * out and resizes, and forgets the layout on unmount.
   */
  widthStorage?: WidthStorage;
  /**
   * Renders only the rows in and near the view, for long lists. `true` uses the
   * nearest scrolling ancestor; an object names the scroller and tunes it.
   */
  virtualize?: boolean | DataTableVirtualize;
  /** Loads more rows as the user scrolls towards the end; draws skeleton rows meanwhile. */
  loadMore?: DataTableLoadMore;
  /** Height of every row in pixels, the same for all of them. */
  rowHeight?: number;
  /** Ref to the table's methods, such as `scrollToIndex`. */
  apiRef?: React.Ref<DataTableApi>;
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
  /** Value of `data-testid` on the element that holds the rows. */
  bodyTestId?: string;
  /** Ref of the table element. */
  ref?: React.Ref<HTMLDivElement>;
}
