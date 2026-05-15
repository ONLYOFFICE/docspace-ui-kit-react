"use client";

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

import type React from "react";
import { isMobile } from "react-device-detect";

import { Backdrop } from "../backdrop";

import type { DropDownProps } from "./DropDown.types";
import { EnhancedComponent } from "./DropDown";

const DropDown = (props: DropDownProps) => {
  const {
    clickOutsideAction,
    open,
    withBackdrop = true,

    isAside,
    withBackground,
    eventTypes,
    forceCloseClickOutside,
    withoutBackground,

    showDisabledItems = false,
    isDefaultMode = true,
    fixedDirection = false,
    offsetX = 0,
    enableKeyboardEvents = true,
    usePortalBackdrop = false,
    shouldShowBackdrop = false,
  } = props;

  const toggleDropDown = (e: React.MouseEvent) => {
    clickOutsideAction?.({} as Event, !open);
    e.stopPropagation();
  };

  const eventTypesProp = forceCloseClickOutside
    ? {}
    : isMobile
      ? { eventTypes: ["click, touchend"] }
      : eventTypes
        ? { eventTypes }
        : {};

  const backDrop = withBackdrop ? (
    <Backdrop
      visible={open || false}
      zIndex={usePortalBackdrop ? 400 : 199}
      onClick={toggleDropDown}
      isAside={isAside}
      withBackground={withBackground}
      withoutBackground={withoutBackground}
      shouldShowBackdrop={shouldShowBackdrop}
    />
  ) : null;

  return (
    <>
      {!usePortalBackdrop ? backDrop : null}
      <EnhancedComponent
        {...eventTypesProp}
        showDisabledItems={showDisabledItems}
        isDefaultMode={isDefaultMode}
        fixedDirection={fixedDirection}
        offsetX={offsetX}
        enableKeyboardEvents={enableKeyboardEvents}
        backDrop={backDrop}
        {...props}
      />
    </>
  );
};

export { DropDown };
