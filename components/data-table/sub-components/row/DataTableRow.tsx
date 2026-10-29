import { memo } from "react";
import classNames from "classnames";

import type { DataTableColumn } from "../../DataTable.types";
import styles from "../../DataTable.module.scss";

type DataTableRowProps<T> = {
  row: T;
  index: number;
  /** The rendered columns, the same array the header maps over. */
  columns: DataTableColumn<T>[];
  /** Id of the last rendered column that is not `fixed`. */
  lastColumnId: string | undefined;
  compact: boolean;
};

const DataTableRowPure = <T,>({
  row,
  index,
  columns,
  lastColumnId,
  compact,
}: DataTableRowProps<T>) => (
  <div
    role="row"
    className={classNames(styles.row, "table-container_row")}
    data-testid="data-table-row"
  >
    {columns.map((column) => (
      <div
        key={column.id}
        role="cell"
        className={classNames(
          styles.cell,
          "table-container_cell",
          column.cellClassName,
        )}
        data-column-id={column.id}
      >
        {column.cell(row, {
          index,
          isLast: column.id === lastColumnId,
          compact,
        })}
      </div>
    ))}
  </div>
);

/**
 * One row. Memoised on its props, so a row re-renders when its own data, its
 * index or the rendered columns change, not when another row does. Widths
 * never reach it: they come from the CSS variable on the table.
 */
export const DataTableRow = memo(DataTableRowPure) as typeof DataTableRowPure;
