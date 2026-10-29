import classNames from "classnames";

import type {
  DataTableColumn,
  DataTableHeaderContext,
  DataTableSort,
} from "../../DataTable.types";
import styles from "../../DataTable.module.scss";

import { HeaderCell } from "./HeaderCell";

type DataTableHeaderProps<T> = {
  columns: DataTableColumn<T>[];
  sort?: DataTableSort;
  onSortChange?: (sortKey: string) => void;
  compact: boolean;
  id?: string;
  className?: string;
};

export const DataTableHeader = <T,>({
  columns,
  sort,
  onSortChange,
  compact,
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
          />
        ))}
      </div>
    </div>
  );
};
