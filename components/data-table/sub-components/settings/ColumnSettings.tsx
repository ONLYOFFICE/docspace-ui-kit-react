"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import SettingsDescReactSvg from "../../../../assets/settings.desc.react.svg";

import { Checkbox } from "../../../checkbox";
import { DropDown } from "../../../drop-down";

import { useDataTableContext } from "../../DataTable.context";
import type { DataTableColumn } from "../../DataTable.types";
import styles from "../../DataTable.module.scss";

type ColumnSettingsProps = {
  /** Accessible name and tooltip of the button. */
  title?: string;
};

const labelOf = (column: DataTableColumn<unknown>) =>
  column.settingsLabel ??
  (typeof column.title === "string" ? column.title : column.id);

/**
 * The settings button of a table, with the menu that shows and hides its
 * `hideable` columns. It reads the columns from the enclosing DataTable, so it
 * only works inside one, normally through `settingsColumn`.
 *
 * It is disabled in compact mode, where choosing columns would change nothing
 * visible, without `onColumnVisibilityChange`, and when no column is
 * hideable. The last visible flexible column cannot be unticked.
 */
export const ColumnSettings = ({ title }: ColumnSettingsProps) => {
  const table = useDataTableContext();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const columns = table?.columns ?? [];
  const items = columns.filter((column) => column.hideable);
  const disabled =
    !table ||
    table.compact ||
    !table.onColumnVisibilityChange ||
    items.length === 0;

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  if (!table) return null;

  const visibleFlexible = columns.filter(
    (column) => column.visible !== false && column.width.type !== "fixed",
  );

  const close = () => setOpen(false);

  const onClickOutside = (event: Event) => {
    const path = event.composedPath?.() ?? [];
    if (wrapperRef.current && path.includes(wrapperRef.current)) return;
    close();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "Escape" || !open) return;
    event.stopPropagation();
    close();
    buttonRef.current?.focus();
  };

  return (
    // Listens for Escape bubbling up from the menu's checkboxes.
    <div
      ref={wrapperRef}
      className={styles.settings}
      onKeyDown={onKeyDown}
      data-testid="data-table-settings"
    >
      <button
        ref={buttonRef}
        type="button"
        className={classNames(styles.settingsButton, "not-selectable")}
        aria-label={title}
        title={title}
        aria-haspopup="true"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
        data-testid="data-table-settings-button"
      >
        <SettingsDescReactSvg aria-hidden="true" />
      </button>
      <DropDown
        directionX="left"
        open={open}
        clickOutsideAction={onClickOutside}
        forwardedRef={wrapperRef}
        withBackdrop={false}
        eventTypes={["click", "mousedown"]}
      >
        {items.map((column) => {
          const checked = column.visible !== false;
          const isLastVisible =
            checked &&
            column.width.type !== "fixed" &&
            visibleFlexible.length === 1;

          return (
            <Checkbox
              key={column.id}
              className={classNames(styles.settingsCheckbox, "not-selectable")}
              isChecked={checked}
              isDisabled={isLastVisible}
              label={labelOf(column)}
              onChange={() =>
                table.onColumnVisibilityChange?.(column.id, !checked)
              }
              dataTestId={`data-table-settings-${column.id}`}
            />
          );
        })}
      </DropDown>
    </div>
  );
};
