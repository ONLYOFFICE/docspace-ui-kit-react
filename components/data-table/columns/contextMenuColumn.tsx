import {
  DATA_TABLE_CONTEXT_MENU_CELL_CLASS,
  DATA_TABLE_SETTINGS_WIDTH,
} from "../DataTable.constants";
import type { DataTableColumn } from "../DataTable.types";
import { RowContextMenu } from "../sub-components/context-menu/RowContextMenu";

type ContextMenuColumnOptions = {
  /** Id of the column.
   * @default "ContextMenu" */
  id?: string;
};

/**
 * A `fixed` column holding each row's menu button, for a table without a
 * settings button; with one, `settingsColumn({ withContextMenu: true })`
 * shares its column instead. The menu itself is described per row, by the
 * `contextMenu` that `getRowProps` returns or `DataTableRow` is given.
 */
export const contextMenuColumn = <T,>({
  id = "ContextMenu",
}: ContextMenuColumnOptions = {}): DataTableColumn<T> => ({
  id,
  title: "",
  width: { type: "fixed", size: DATA_TABLE_SETTINGS_WIDTH },
  cell: () => <RowContextMenu />,
  cellClassName: DATA_TABLE_CONTEXT_MENU_CELL_CLASS,
});
