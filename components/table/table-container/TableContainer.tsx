import React from "react";
import classNames from "classnames";

import { groupRoleWhenNamed, pickAriaProps } from "../../../utils/aria-props";
import { TableContainerProps } from "../Table.types";
import styles from "./TableContainer.module.scss";

const TableContainer = (props: TableContainerProps) => {
  const { className, forwardedRef, useReactWindow, noSelect, children } = props;

  const classes = classNames(
    styles.tableContainer,
    className,
    "table-container",
    {
      [styles.useReactWindow]: useReactWindow,
      [styles.noSelect]: noSelect,
    },
  );

  return (
    <div
      {...pickAriaProps(props)}
      role={groupRoleWhenNamed(props)}
      id="table-container"
      className={classes}
      ref={forwardedRef}
      data-testid="table-container"
    >
      {children}
    </div>
  );
};

export { TableContainer };
