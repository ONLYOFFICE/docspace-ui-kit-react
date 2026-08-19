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

import { DEFAULT_FONT_FAMILY, SYSTEM_FONT_FAMILY } from "../themes/constants";

export const RTL_LANGUAGES = Object.freeze([
  "ar",
  "arc",
  "dv",
  "fa",
  "ha",
  "he",
  "khw",
  "ks",
  "ku",
  "ps",
  "ur",
  "yi",
]);

export const isLanguageRtl = (lng: string) => {
  if (!lng) return;

  const splittedLng = lng.split("-");
  return RTL_LANGUAGES.includes(splittedLng[0]);
};

export const getDirectionByLanguage = (lng: string) => {
  return isLanguageRtl(lng) ? "rtl" : "ltr";
};

/* Returns correct text-align value depending on interface direction (ltr/rtl) */
export const getCorrectTextAlign = (
  currentTextAlign: string,
  interfaceDirection: "ltr" | "rtl" | string,
) => {
  if (!currentTextAlign) return interfaceDirection === "rtl" ? "right" : "left";

  if (interfaceDirection === "ltr") return currentTextAlign;

  switch (currentTextAlign) {
    case "left":
      return "right";
    case "right":
      return "left";
    default:
      return currentTextAlign;
  }
};

/* Returns correct four values style (margin/padding etc) depending on interface direction (ltr/rtl)
 * Not suitable for border-radius! */
export const getCorrectFourValuesStyle = (
  styleStr: string,
  interfaceDirection: "ltr" | "rtl" | string,
) => {
  if (interfaceDirection === "ltr") return styleStr;

  const styleArr = styleStr.split(" ");
  if (styleArr.length !== 4) return styleStr;

  const styleRightValue = styleArr[1];
  const styleLeftValue = styleArr[3];

  styleArr[1] = styleLeftValue;
  styleArr[3] = styleRightValue;

  return styleArr.join(" ");
};

/* Returns correct border-radius value depending on interface direction (ltr/rtl) */
export const getCorrectBorderRadius = (
  borderRadiusStr: string,
  interfaceDirection: "ltr" | "rtl" | string,
) => {
  if (interfaceDirection === "ltr") return borderRadiusStr;

  const borderRadiusArr = borderRadiusStr.split(" ");

  switch (borderRadiusArr.length) {
    // [10px] => "10px"
    case 1: {
      return borderRadiusStr;
    }
    // [10px 20px] => [20px 10px]
    case 2: {
      borderRadiusArr.splice(0, 0, borderRadiusArr.splice(1, 1)[0]);
      break;
    }
    // [10px 20px 30px] => [20px 10px 20px 30px]
    case 3: {
      borderRadiusArr.splice(0, 0, borderRadiusArr[1]);
      break;
    }
    // [10px 20px 30px 40px] => [20px 10px 40px 30px]
    case 4: {
      borderRadiusArr.splice(0, 0, borderRadiusArr.splice(1, 1)[0]);
      borderRadiusArr.splice(2, 0, borderRadiusArr.splice(3, 1)[0]);
      break;
    }
    default:
  }

  return borderRadiusArr.join(" ");
};

/* Returns system font family for arabic lang */
export const getFontFamilyDependingOnLanguage = (lng: string) => {
  const arabicLocale = "ar-SA";
  const shouldUseSystemFont = lng?.toLowerCase() === arabicLocale.toLowerCase();

  return shouldUseSystemFont ? SYSTEM_FONT_FAMILY : DEFAULT_FONT_FAMILY;
};
