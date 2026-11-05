import {
  DATA_TABLE_CONTEXT_MENU_CELL_CLASS,
  DATA_TABLE_SETTINGS_WIDTH,
} from "../DataTable.constants";
import type { DataTableColumn } from "../DataTable.types";
import { RowContextMenu } from "../sub-components/context-menu/RowContextMenu";
import { ColumnSettings } from "../sub-components/settings/ColumnSettings";

type SettingsColumnOptions = {
  /** Accessible name and tooltip of the settings button. */
  title?: string;
  /** Id of the column.
   * @default "Settings" */
  id?: string;
  /** Puts each row's menu button in the column's cells, as the old table did. */
  withContextMenu?: boolean;
  /** Value of `data-testid` on each row's menu button, with `withContextMenu`.
   * @default "data-table-context-menu-button" */
  contextMenuButtonTestId?: string;
  /** Disables the settings button, as while rows are being reordered. */
  disabled?: boolean;
};

/**
 * A `fixed` column whose header is the settings button: the menu that shows
 * and hides the table's `hideable` columns. Its cells are empty, or hold the
 * row's menu button with `withContextMenu`. Place it where the button should
 * be, usually last.
 */
export const settingsColumn = <T,>({
  title,
  id = "Settings",
  withContextMenu = false,
  contextMenuButtonTestId,
  disabled = false,
}: SettingsColumnOptions = {}): DataTableColumn<T> => ({
  id,
  title: "",
  width: { type: "fixed", size: DATA_TABLE_SETTINGS_WIDTH },
  header: () => <ColumnSettings title={title} disabled={disabled} />,
  cell: withContextMenu
    ? () => <RowContextMenu buttonTestId={contextMenuButtonTestId} />
    : () => null,
  cellClassName: withContextMenu
    ? DATA_TABLE_CONTEXT_MENU_CELL_CLASS
    : undefined,
});
