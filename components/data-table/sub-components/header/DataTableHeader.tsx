import classNames from "classnames";

import type {
  DataTableColumn,
  DataTableHeaderContext,
  DataTableSort,
} from "../../DataTable.types";
import styles from "../../DataTable.module.scss";
import type { ResizeHandleBindings } from "../../hooks/useColumnResize";

import { HeaderCell } from "./HeaderCell";

/** What the header needs to draw and drive the resize handles. */
export type HeaderResize = {
  /** Whether the column's trailing edge has a handle. */
  canResize: (columnId: string) => boolean;
  /** The column's share of the flexible area, in whole percent. */
  valueOf: (columnId: string) => number;
  /** Event handlers for the column's handle. */
  bind: (columnId: string) => ResizeHandleBindings;
  /** The column whose handle is being dragged. */
  resizingId: string | null;
};

type DataTableHeaderProps<T> = {
  columns: DataTableColumn<T>[];
  sort?: DataTableSort;
  onSortChange?: (sortKey: string) => void;
  compact: boolean;
  resize?: HeaderResize;
  id?: string;
  className?: string;
};

export const DataTableHeader = <T,>({
  columns,
  sort,
  onSortChange,
  compact,
  resize,
  id,
  className,
}: DataTableHeaderProps<T>) => {
  const context: DataTableHeaderContext = { sort, compact };

  return (
    <div
      id={id}
      role="rowgroup"
      className={classNames(styles.header, "table-container_header", className)}
      data-testid="data-table-header"
    >
      <div role="row" className={styles.headerRow}>
        {columns.map((column) => (
          <HeaderCell
            key={column.id}
            column={column}
            sort={sort}
            onSortChange={onSortChange}
            context={context}
            resize={resize}
          />
        ))}
      </div>
    </div>
  );
};
