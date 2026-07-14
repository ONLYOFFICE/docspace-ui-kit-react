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

import { isMobile, isTablet, isTouchDevice } from "../../utils";
import { ModalDialogType } from "./ModalDialog.enums";
import { ModalDialogTypeDetailed } from "./ModalDialog.types";

let y1: null | number = null;

export const handleTouchStart = (e: TouchEvent) => {
  if (!(isTouchDevice && isMobile())) {
    y1 = null;
    return false;
  }

  const firstTouch = e.touches[0];

  const target = firstTouch.target as HTMLElement;

  if (target.id !== "modal-header-swipe") {
    y1 = null;
    return false;
  }

  y1 = firstTouch.clientY;
};

export const handleTouchMove = (e: TouchEvent, onClose?: () => void) => {
  if (!y1) return 0;

  const y2 = e.touches[0].clientY;
  if (y2 - y1 > 120) onClose?.();

  return y1 - y2;
};

const getCurrentSizeName = () => {
  if (isMobile()) return "mobile";

  if (isTablet()) return "tablet";

  return "desktop";
};

export const getCurrentDisplayType = (
  propsDisplayType: ModalDialogType,
  propsDisplayTypeDetailed?: ModalDialogTypeDetailed,
) => {
  if (!propsDisplayTypeDetailed) return propsDisplayType;

  const detailedDisplayType = propsDisplayTypeDetailed[getCurrentSizeName()];

  if (detailedDisplayType) return detailedDisplayType;
  return propsDisplayType;
};

export const parseChildren = (
  children: (React.ReactElement | null)[] | React.ReactElement | null,
  headerDisplayName: string,
  bodyDisplayName: string,
  footerDisplayName: string,
  containerDisplayName: string,
) => {
  let header = null;
  let body = null;
  let footer = null;
  let container = null;

  if (children) {
    React.Children.map(children, (child: React.ReactElement | null) => {
      if (!child) return;
      const type:
        | React.JSXElementConstructor<{
            name?: string;
            displayName?: string;
          }>
        | string = child?.type;

      const childType =
        child &&
        type &&
        typeof type !== "string" &&
        // @ts-expect-error display name can be exist
        (type.displayName || type.name);

      switch (childType) {
        case headerDisplayName:
          header = child;
          break;
        case bodyDisplayName:
          body = child;
          break;
        case footerDisplayName:
          footer = child;
          break;
        case containerDisplayName:
          container = child;
          break;
        default:
          break;
      }
    });
  }

  return [header, body, footer, container];
};
