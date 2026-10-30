import type React from "react";
import { createContext, use } from "react";

import type { ContextMenuRefType } from "../context-menu";

import type {
  DataTableColumn,
  DataTableRowContextMenu,
} from "./DataTable.types";

/** What the parts a consumer places in a column, such as the settings menu, read from the table. */
export type DataTableContextValue = {
  /** Every column, hidden ones included. */
  columns: DataTableColumn<unknown>[];
  /** The columns the header and the rows render, in order. */
  renderedColumns: DataTableColumn<unknown>[];
  /** Id of the last rendered column that is not `fixed`. */
  lastColumnId: string | undefined;
  /** Whether the table is in compact mode. */
  compact: boolean;
  /** Whether only the rows near the view are rendered. */
  virtualized: boolean;
  /** The table's `onColumnVisibilityChange`. */
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
};

export const DataTableContext = createContext<DataTableContextValue | null>(
  null,
);

/** The enclosing table's context; null outside a DataTable. */
export const useDataTableContext = () => use(DataTableContext);

/** What the menu cell of a row shares with the row, which opens it on a right-click. */
export type DataTableRowContextValue = {
  /** The row's menu, as the row was given it. */
  contextMenu?: DataTableRowContextMenu;
  /** The mounted menu, set by the menu cell. */
  menuRef: React.RefObject<ContextMenuRefType | null>;
  /** The menu cell's element, clicked before the menu opens. */
  anchorRef: React.RefObject<HTMLDivElement | null>;
  /** Opens the menu at the event, as a right-click on the row does. */
  openMenu: (event: React.MouseEvent) => void;
};

export const DataTableRowContext =
  createContext<DataTableRowContextValue | null>(null);

/** The enclosing row's context; null outside a DataTableRow. */
export const useDataTableRowContext = () => use(DataTableRowContext);
