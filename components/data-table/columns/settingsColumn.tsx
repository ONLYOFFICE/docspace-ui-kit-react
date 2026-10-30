import { DATA_TABLE_SETTINGS_WIDTH } from "../DataTable.constants";
import type { DataTableColumn } from "../DataTable.types";
import { ColumnSettings } from "../sub-components/settings/ColumnSettings";

type SettingsColumnOptions = {
  /** Accessible name and tooltip of the settings button. */
  title?: string;
  /** Id of the column.
   * @default "Settings" */
  id?: string;
};

/**
 * A `fixed` column whose header is the settings button: the menu that shows
 * and hides the table's `hideable` columns. Its cells are empty. Place it
 * where the button should be, usually last.
 */
export const settingsColumn = <T,>({
  title,
  id = "Settings",
}: SettingsColumnOptions = {}): DataTableColumn<T> => ({
  id,
  title: "",
  width: { type: "fixed", size: DATA_TABLE_SETTINGS_WIDTH },
  header: () => <ColumnSettings title={title} />,
  cell: () => null,
});
