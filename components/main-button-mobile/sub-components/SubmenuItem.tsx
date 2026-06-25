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

import React, { useEffect, useLayoutEffect, useState } from "react";
import { DropDownItem } from "../../drop-down-item";
import { ActionOption, SubmenuItemProps } from "../MainButtonMobile.types";
import styles from "../MainButtonMobile.module.scss";
import classNames from "classnames";

const SubmenuItem = ({
  option,
  toggle,
  noHover,
  recalculateHeight,
  openedSubmenuKey,
  setOpenedSubmenuKey,
  openByDefault,
}: SubmenuItemProps) => {
  const [isOpenSubMenu, setIsOpenSubMenu] = useState(false);

  useLayoutEffect(() => {
    recalculateHeight();
  }, [isOpenSubMenu, recalculateHeight]);

  useEffect(() => {
    if (openedSubmenuKey === option.key) return;
    setIsOpenSubMenu(false);
  }, [openedSubmenuKey, option.key]);

  useEffect(() => {
    if (openByDefault) {
      setOpenedSubmenuKey(option.key);
      setIsOpenSubMenu(true);
    }
  }, [openByDefault, option.key, setOpenedSubmenuKey]);

  const onClick = () => {
    setOpenedSubmenuKey(option.key);
    setIsOpenSubMenu((v) => !v);
  };

  return (
    <div key={`mobile-submenu-${option.key}`}>
      <DropDownItem
        id={option.id}
        key={option.key}
        label={option.label}
        className={classNames(styles.dropDownItem, option.className, {
          "is-separator": option.isSeparator,
          "main-button_drop-down": !option.isSeparator,
        })}
        onClick={onClick}
        icon={option.icon}
        isActive={isOpenSubMenu}
        isSubMenu
        noHover={noHover}
      />
      {isOpenSubMenu
        ? option.items?.map((suboption: ActionOption) => {
            const subMenuOnClickAction = () => {
              toggle(false);
              setIsOpenSubMenu(false);
              suboption.onClick?.({ action: suboption.action });
            };

            return (
              <DropDownItem
                id={suboption.id}
                key={suboption.key}
                label={suboption.label}
                className={classNames(
                  styles.dropDownItem,
                  styles.sublevel,
                  suboption.className,
                  "main-button_drop-down",
                )}
                onClick={subMenuOnClickAction}
                icon={suboption.icon}
                withoutIcon={suboption.withoutIcon}
                noHover={noHover}
              />
            );
          })
        : null}
    </div>
  );
};

export default SubmenuItem;