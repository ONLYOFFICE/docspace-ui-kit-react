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

import { isTablet } from "../../utils";

const getItemHeight = (item: React.ReactElement) => {
  const isTabletDevice = isTablet();

  const height = (item?.props as { height?: number }).height ?? 32;
  const heightTablet =
    (item?.props as { heightTablet?: number }).heightTablet ?? 36;

  if (item && (item.props as { isSeparator: boolean }).isSeparator) {
    return isTabletDevice ? 16 : 12;
  }

  return isTabletDevice ? heightTablet : height;
};

const hideDisabledItems = (children: React.ReactNode) => {
  if (React.Children.count(children) > 0) {
    const enabledChildren = React.Children.map(children, (child) => {
      const props =
        child &&
        React.isValidElement(child) &&
        (child.props as { disabled?: boolean });
      if (props && !props?.disabled) return child;
    });

    const sizeEnabledChildren = enabledChildren?.length;

    const cleanChildren = React.Children.map(
      enabledChildren,
      (child, index) => {
        const props =
          child &&
          React.isValidElement(child) &&
          (child.props as { isSeparator?: boolean });
        if (props && !props?.isSeparator) return child;
        if (
          index !== 0 &&
          sizeEnabledChildren &&
          index !== sizeEnabledChildren - 1
        )
          return child;
      },
    );

    return cleanChildren;
  }
};

export { getItemHeight, hideDisabledItems };
