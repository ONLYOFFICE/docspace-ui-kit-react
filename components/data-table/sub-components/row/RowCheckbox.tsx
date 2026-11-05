import classNames from "classnames";

import { Checkbox } from "../../../checkbox";
import { Loader, LoaderTypes } from "../../../loader";

import type { DataTableRowCheckboxProps } from "../../DataTable.types";
import styles from "../../DataTable.module.scss";

/**
 * The item's icon, which turns into the row's checkbox while the pointer is
 * over it, the row is selected, or the checkbox has the keyboard focus. Put
 * it in a cell, usually at the start of the name.
 */
export const DataTableRowCheckbox = ({
  icon,
  checked = false,
  onChange,
  label,
  loading = false,
  disabled = false,
  className,
  testId = "data-table-row-checkbox",
}: DataTableRowCheckboxProps) => (
  <span
    className={classNames(styles.rowCheckbox, className, {
      [styles.isRowChecked]: checked,
      [styles.isDisabled]: disabled,
    })}
    data-testid={testId}
  >
    {loading ? (
      <Loader
        className={styles.rowCheckboxLoader}
        color=""
        size="20px"
        type={LoaderTypes.track}
        isDecorative
      />
    ) : (
      <>
        <span className={styles.rowCheckboxIcon}>{icon}</span>
        {disabled ? null : (
          <Checkbox
            className={styles.rowCheckboxInput}
            isChecked={checked}
            onChange={(event) => onChange?.(event.target.checked, event)}
            title={label}
            // The box is an icon with no text, so the input carries the name.
            {...({ "aria-label": label } as object)}
          />
        )}
      </>
    )}
  </span>
);
