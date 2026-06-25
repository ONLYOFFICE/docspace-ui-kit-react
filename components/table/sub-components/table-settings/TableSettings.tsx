/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
