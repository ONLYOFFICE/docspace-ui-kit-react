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

import React from "react";
import { isChrome, browserVersion } from "react-device-detect";
import { ReactSVG } from "react-svg";
import classNames from "classnames";

import { Button, ButtonSize } from "../../../button";
import { DropDown } from "../../../drop-down";
import { DropDownItem } from "../../../drop-down-item";
import { TGroupMenuItem } from "../../Table.types";
import styles from "./GroupMenuItem.module.scss";

const DESKTOP_WIDTH = 1024;
const ITEM_HEIGHT_DESKTOP = 32;
const ITEM_HEIGHT_TABLET_MOBILE = 36;

const GroupMenuItem = React.memo(
  ({
    item,
    isBlocked,
    dataTestId,
  }: {
    item: TGroupMenuItem;
    isBlocked?: boolean;
    dataTestId?: string;
  }) => {
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);

    const [open, setOpen] = React.useState(false);

    const {
      label,
      disabled,
      onClick,
      iconUrl,
      title,
      withDropDown,
      options,
      id,
      isMobileView,
      fixedDropdownStyles,
    } = item;

    // Detect if we're below desktop width (tablet or mobile) - only used when fixedDropdownStyles is true
    const isTabletOrBelow =
      fixedDropdownStyles &&
      typeof window !== "undefined" &&
      window.innerWidth < DESKTOP_WIDTH;

    const onClickOutside = () => {
      setOpen(false);
    };

    const onClickAction = (e: React.MouseEvent) => {
      if (isBlocked) return;

      onClick?.(e);

      if (withDropDown) {
        setOpen(true);
      }
    };

    return disabled ? null : (
      <div
        data-testid={dataTestId ?? "group-menu-item"}
        className={styles.groupMenuItem}
      >
        <Button
          id={id}
          className={classNames(styles.button, styles.overrideNativeStyles, {
            [styles.oldChrome]: isChrome && +browserVersion <= 85,
            [styles.isBlocked]: isBlocked,
          })}
          label={label}
          title={title || label}
          isDisabled={isBlocked}
          onClick={onClickAction}
          icon={
            <ReactSVG src={iconUrl} className="combo-button_selected-icon" />
          }
          ref={buttonRef as React.RefObject<HTMLButtonElement>}
          size={ButtonSize.extraSmall}
          testId="group-menu-item-button"
        />
        {withDropDown ? (
          <DropDown
            open={open}
            clickOutsideAction={onClickOutside}
            forwardedRef={
              buttonRef as unknown as React.RefObject<HTMLDivElement>
            }
            zIndex={250}
            maxHeight={
              fixedDropdownStyles
                ? isTabletOrBelow
                  ? Math.min(options?.length || 5, 5) *
                    ITEM_HEIGHT_TABLET_MOBILE
                  : Math.min(options?.length || 5, 5) * ITEM_HEIGHT_DESKTOP
                : undefined
            }
            isMobileView={isMobileView}
            isNoFixedHeightOptions={fixedDropdownStyles}
            disableScrollbarPadding={fixedDropdownStyles}
            useFlexibleHeight={fixedDropdownStyles}
            withoutBackground={!isMobileView}
            style={
              fixedDropdownStyles && !isMobileView
                ? { width: "161px" }
                : undefined
            }
          >
            {options?.map((option) => {
              const { key, ...rest } = option;

              return (
                <DropDownItem
                  key={key}
                  {...rest}
                  setOpen={setOpen}
                  truncateText
                  stopMouseDownPropagation={fixedDropdownStyles}
                />
              );
            })}
          </DropDown>
        ) : null}
      </div>
    );
  },
);

export { GroupMenuItem };
