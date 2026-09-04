import React from "react";
import classNames from "classnames";
import equal from "fast-deep-equal/react";

import { TableCellProps } from "../../Table.types";
import styles from "./TableCell.module.scss";

const TableCell = React.memo((props: TableCellProps) => {
  const {
    className,
    forwardedRef,
    style,
    checked,
    hasAccess,
    children,
    value,
    dataTestId,
    documentTitle,
  } = props;

  const classes = classNames(
    styles.tableCell,
    className,
    "table-container_cell",
    {
      [styles.checked]: checked,
      [styles.hasAccess]: hasAccess,
    },
  );

  const cellTestId = dataTestId ?? "table-cell";

  return (
    <div
      data-testid={cellTestId}
      className={classes}
      ref={forwardedRef}
      style={style}
      // @ts-expect-error: value used by DnD and maybe somewhere else;
      // TODO: Refactor logic to use data-value
      value={value}
      data-document-title={documentTitle}
    >
      {children}
    </div>
  );
}, equal);

export { TableCell };
