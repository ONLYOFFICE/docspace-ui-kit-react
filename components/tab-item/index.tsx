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

import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { Text } from "../text";
import styles from "./TabItem.module.scss";
import { TTabItemProps } from "./TabItem.types";

const TabItem = ({
  label,
  onSelect,
  isActive: isActiveInit = false,
  isDisabled,
  className,
  allowNoSelection,
  withMultiSelect = false,
  dataTestId,
  lockLastSelection = false,
  ...rest
}: TTabItemProps) => {
  const [isActive, setIsActive] = useState(isActiveInit);

  const onSelectItem = useCallback(
    (itemIsActive: boolean) => {
      if (!allowNoSelection) {
        setIsActive(itemIsActive);
      }
    },
    [allowNoSelection],
  );

  const onItemClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    if (lockLastSelection && isActive) return;

    if (!(isActive && !withMultiSelect)) {
      onSelectItem(!isActive);
    }
    onSelect?.(e);
  };

  useEffect(() => {
    onSelectItem(isActiveInit);
  }, [isActiveInit, onSelectItem]);

  return (
    <div
      className={classNames(
        styles.tabItem,
        {
          [styles.active]: isActive,
          [styles.disabled]: isDisabled,
        },
        className,
        "tab-item",
      )}
      onClick={onItemClick}
      aria-selected={isActive}
      data-testid={dataTestId ?? "tab-item"}
      {...rest}
    >
      <Text
        className={classNames(styles.tabItemText, {
          [styles.active]: isActive,
        })}
        noSelect
        truncate
        fontSize="13px"
        fontWeight={600}
        lineHeight="20px"
        data-testid="tab-item-text"
      >
        {label}
      </Text>
    </div>
  );
};

export { TabItem };
