import classNames from "classnames";

import type { ResizeHandleBindings } from "../../hooks/useColumnResize";
import styles from "../../DataTable.module.scss";

type ResizeHandleProps = ResizeHandleBindings & {
  columnId: string;
  /** Accessible name: the column's title. */
  label: string;
  /** The column's share of the flexible area, in whole percent. */
  valueNow: number;
  /** Whether this handle is being dragged. */
  active: boolean;
};

/**
 * The edge of a column header that resizes it: a separator a pointer drags
 * and a keyboard moves. It sits over the end of the header cell, outside the
 * sort button, so a press on it never sorts.
 */
export const ResizeHandle = ({
  columnId,
  label,
  valueNow,
  active,
  ...bindings
}: ResizeHandleProps) => (
  // A focusable separator is the ARIA splitter pattern; an <hr> cannot take
  // focus or the arrow keys.
  <div
    role="separator"
    aria-orientation="vertical"
    aria-label={label}
    aria-valuenow={valueNow}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuetext={`${valueNow}%`}
    tabIndex={0}
    className={classNames(styles.resizeHandle, "not-selectable", {
      [styles.isActive]: active,
    })}
    data-testid={`data-table-resize-${columnId}`}
    {...bindings}
  />
);
