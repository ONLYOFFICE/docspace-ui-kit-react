import { createContext, use } from "react";

import type { DataTableColumn } from "./DataTable.types";

/** What the parts a consumer places in a column, such as the settings menu, read from the table. */
export type DataTableContextValue = {
  /** Every column, hidden ones included. */
  columns: DataTableColumn<unknown>[];
  /** Whether the table is in compact mode. */
  compact: boolean;
  /** The table's `onColumnVisibilityChange`. */
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
};

export const DataTableContext = createContext<DataTableContextValue | null>(
  null,
);

/** The enclosing table's context; null outside a DataTable. */
export const useDataTableContext = () => use(DataTableContext);
