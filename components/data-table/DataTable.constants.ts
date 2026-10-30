/** Narrowest a `fill` column (Name) may become, in pixels. */
export const DATA_TABLE_MIN_FILL_WIDTH = 210;

/** Narrowest a `flex` column may become, in pixels. */
export const DATA_TABLE_MIN_COLUMN_WIDTH = 110;

/** Width of the column `settingsColumn` and `contextMenuColumn` make, in pixels. */
export const DATA_TABLE_SETTINGS_WIDTH = 24;

/**
 * Class of a cell holding a row's menu button, as the old table named it: the
 * client's styles and its drag and drop look for it.
 */
export const DATA_TABLE_CONTEXT_MENU_CELL_CLASS =
  "table-container_row-context-menu-wrapper";

/** Height of a body row, its bottom border included, in pixels. */
export const DATA_TABLE_ROW_HEIGHT = 48;

/** Rows a virtualised table renders beyond each edge of the visible ones. */
export const DATA_TABLE_OVERSCAN = 5;

/** Share of the flexible area the `fill` columns get on a reset; `flex` ones split the rest. */
export const DATA_TABLE_FILL_SHARE = 0.4;
