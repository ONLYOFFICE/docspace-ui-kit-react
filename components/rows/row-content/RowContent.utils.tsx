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

export const getSideInfo = (
  content: React.ReactElement<{
    containerWidth?: string;
    children?: React.ReactElement;
  }>[],
  convert: boolean,
  interfaceDirection: string = "ltr",
) => {
  const info: React.ReactElement[] = [];
  let child = null;
  const lastIndex = content.length - 1;

  content.forEach(
    (
      element: React.ReactElement<{
        containerWidth?: string;
        children?: React.ReactElement;
      }>,
      index: number,
    ) => {
      if (index > 1) {
        if (!convert && index === lastIndex) {
          child = element;
        } else if (React.isValidElement(element) && "props" in element) {
          const children = element.props.children;
          if (children !== undefined && children !== null) {
            info.push(children as React.JSX.Element);
          }
        }
      }
    },
  );

  if (interfaceDirection === "rtl") {
    info.reverse();
  }

  return interfaceDirection === "ltr" ? (
    <>
      {info.join(" | ")}
      {child}
    </>
  ) : (
    <>
      {child}
      {info.join(" | ")}
    </>
  );
};
