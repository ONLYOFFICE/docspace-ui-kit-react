"use client";

import { memo } from "react";
import classNames from "classnames";

import { RectangleSkeleton } from "../../../rectangle";

import { useDataTableContext } from "../../DataTable.context";
import type { DataTableColumn } from "../../DataTable.types";
import styles from "../../DataTable.module.scss";

const renderSkeleton = (column: DataTableColumn<unknown>) => {
  if (column.skeleton) return column.skeleton();
  if (column.width.type === "fixed") return null;
  return (
    <RectangleSkeleton
      width="100%"
      height="16px"
      className={styles.skeletonBar}
    />
  );
};

/**
 * A row that is not loaded yet, or that a fast scroll skips: a bar in every
 * rendered column, on the same grid as the real rows. Hidden from assistive
 * technology; the table reports `aria-busy` while a page loads.
 */
export const SkeletonRow = memo(() => {
  const table = useDataTableContext();
  if (!table) return null;

  return (
    <div
      role="row"
      aria-hidden="true"
      className={classNames(styles.row, "table-container_body-loader")}
      data-testid="data-table-skeleton-row"
    >
      {table.renderedColumns.map((column) => (
        <div
          key={column.id}
          role="cell"
          className={classNames(styles.cell, styles.skeletonCell)}
          data-column-id={column.id}
        >
          {renderSkeleton(column)}
        </div>
      ))}
    </div>
  );
});

SkeletonRow.displayName = "SkeletonRow";
