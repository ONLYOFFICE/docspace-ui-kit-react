import classNames from "classnames";

import { DATA_TABLE_ROW_ACTIONS_CLASS } from "../../DataTable.constants";
import type { DataTableRowActionsProps } from "../../DataTable.types";

/**
 * Content a row shows only while it is under the pointer, selected, acted on
 * or holds the focus, such as a share button. On a device without a pointer
 * that hovers it always shows.
 */
export const DataTableRowActions = ({
  children,
  className,
}: DataTableRowActionsProps) => (
  <span className={classNames(DATA_TABLE_ROW_ACTIONS_CLASS, className)}>
    {children}
  </span>
);
