import classNames from "classnames";

import SortDescReactSvg from "../../../../assets/sort.desc.react.svg";

import type {
  DataTableColumn,
  DataTableHeaderContext,
  DataTableSort,
} from "../../DataTable.types";
import styles from "../../DataTable.module.scss";

type HeaderCellProps<T> = {
  column: DataTableColumn<T>;
  sort?: DataTableSort;
  onSortChange?: (sortKey: string) => void;
  context: DataTableHeaderContext;
};

const ariaSortOf = (sort: DataTableSort | undefined, sortKey?: string) => {
  if (!sort || !sortKey || sort.key !== sortKey) return undefined;
  return sort.desc ? "descending" : "ascending";
};

export const HeaderCell = <T,>({
  column,
  sort,
  onSortChange,
  context,
}: HeaderCellProps<T>) => {
  const { id, title, header, sortKey, headerRef, headerClassName } = column;

  const ariaSort = ariaSortOf(sort, sortKey);
  const sortable = Boolean(sortKey && onSortChange);

  const renderContent = () => {
    if (header) return header(context);

    const text = (
      <span className={classNames(styles.headerText, "header-container-text")}>
        {title}
      </span>
    );

    if (!sortable || !sortKey) return text;

    return (
      <button
        type="button"
        className={styles.sortButton}
        onClick={() => onSortChange?.(sortKey)}
        data-testid={`data-table-sort-${id}`}
      >
        {text}
        <SortDescReactSvg className={styles.sortIcon} aria-hidden="true" />
      </button>
    );
  };

  return (
    <div
      ref={headerRef}
      role="columnheader"
      aria-sort={ariaSort}
      className={classNames(
        styles.headerCell,
        "table-container_header-cell",
        headerClassName,
        {
          [styles.isSorted]: Boolean(ariaSort),
          [styles.isAscending]: ariaSort === "ascending",
        },
      )}
      data-column-id={id}
      data-testid={`data-table-header-${id}`}
    >
      {renderContent()}
    </div>
  );
};
