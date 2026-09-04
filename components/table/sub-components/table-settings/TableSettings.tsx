import React, { useRef, useState } from "react";
import classNames from "classnames";

import SettingsDeskReactSvgUrl from "../../../../assets/settings.desc.react.svg";

import { IconButton } from "../../../icon-button";
import { DropDown } from "../../../drop-down";
import { Checkbox } from "../../../checkbox";

import { TTableColumn, TableSettingsProps } from "../../Table.types";
import styles from "./TableSettings.module.scss";

const TableSettings = ({ columns, disableSettings }: TableSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  const onClick = () => {
    if (!disableSettings) setIsOpen((s) => !s);
  };

  const clickOutsideAction = (e: Event) => {
    const path = e.composedPath && e.composedPath();
    const dropDownItem = path
      ? path.find((x: EventTarget) => x === ref.current)
      : null;
    if (dropDownItem) return;

    setIsOpen(false);
  };

  return (
    <div
      className={styles.tableSettings}
      ref={ref}
      data-testid="table-settings"
    >
      <IconButton
        className={classNames(styles.tableSettingsIcon, {
          [styles.isDisabled]: disableSettings,
        })}
        size={12}
        isFill
        iconNode={<SettingsDeskReactSvgUrl />}
        onClick={onClick}
        isDisabled={disableSettings}
        dataTestId="table-settings-button"
      />
      <DropDown
        directionX="left"
        open={isOpen}
        clickOutsideAction={clickOutsideAction}
        forwardedRef={ref}
        withBackdrop={false}
        eventTypes={["click", "mousedown"]}
      >
        {columns.map((column: TTableColumn) => {
          if (column.isDisabled) return;

          const onChange = () => column.onChange?.(column.key);

          return (
            column.onChange && (
              <Checkbox
                className={classNames(
                  styles.tableSettingsCheckbox,
                  "table-container_settings-checkbox not-selectable",
                )}
                isChecked={column.enable}
                onChange={onChange}
                key={column.key}
                label={column.title}
                dataTestId={`table_settings_${column.key}`}
              />
            )
          );
        })}
      </DropDown>
    </div>
  );
};

export { TableSettings };
