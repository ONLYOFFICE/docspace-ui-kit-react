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

import { FC, useCallback, useRef, useState } from "react";
import classNames from "classnames";

import { useUnmount } from "../../hooks/useUnmount";

import { DropDown } from "../drop-down";
import { DropDownItem } from "../drop-down-item";
import { Text } from "../text";
import { Tag } from "../tag";

import styles from "./Tags.module.scss";
import type { DropDownTagsProps } from "./Tags.types";

export const TagsDropdown: FC<DropDownTagsProps> = ({
  removeTagIcon = false,
  onClick,
  advancedOptions,
  ...tagProps
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const tagRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  const onClickOutside = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    if (
      (!!target &&
        typeof target.className !== "object" &&
        target.className?.includes("advanced-tag")) ||
      !isMountedRef.current
    )
      return;

    setOpenDropdown(false);
  }, []);

  const openDropdownAction = () => {
    setOpenDropdown(true);
  };

  const onClickAction = useCallback(
    (e: React.MouseEvent | React.ChangeEvent) => {
      const { roomType, providerType, isDisabled, isDeleted } = tagProps;

      if (onClick && !isDisabled && !isDeleted) {
        const target = e.target as HTMLDivElement;
        const label = target.dataset.tag;

        if (!label) return;

        onClick({ roomType, label, providerType });
        setOpenDropdown(false);
      }
    },
    [onClick, tagProps],
  );

  useUnmount(() => {
    isMountedRef.current = false;
  });

  return (
    <>
      <Tag ref={tagRef} onClick={openDropdownAction} {...tagProps} />
      <DropDown
        open={openDropdown}
        forwardedRef={tagRef}
        clickOutsideAction={onClickOutside}
        isDefaultMode
        directionY="both"
      >
        {advancedOptions.map((tag) => (
          <DropDownItem
            className="tag__dropdown-item tag"
            key={tag}
            onClick={onClickAction}
            data-tag={tag}
            testId={"tag_dropdown_item"}
          >
            <Text
              className={classNames(styles.dropdownText, {
                [styles.removeTagIcon]: removeTagIcon,
              })}
              fontWeight={600}
              fontSize="12px"
              truncate
            >
              {tag}
            </Text>
          </DropDownItem>
        ))}
      </DropDown>
    </>
  );
};
