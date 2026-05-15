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

// Done in a similar way to server code
// https://github.com/ONLYOFFICE/DocSpace-server/blob/master/common/ASC.Common/Utils/CommonFileSizeComment.cs
export const getPowerFromBytes = (bytes: number, maxPower = 6) => {
  const power = Math.floor(Math.log(bytes) / Math.log(1024));
  return power <= maxPower ? power : maxPower;
};

export const getSizeFromBytes = (bytes: number, power: number) => {
  const size = bytes / 1024 ** power;
  const truncateToTwo = Math.trunc(size * 100) / 100;

  return truncateToTwo;
};

export const getConvertedSize = (
  t: (key: string) => string,
  bytes: number,
  withoutSizeName: boolean = false,
) => {
  let power = 0;
  let resultSize = bytes;

  const sizeNames = [
    t("Common:Bytes"),
    t("Common:Kilobyte"),
    t("Common:Megabyte"),
    t("Common:Gigabyte"),
    t("Common:Terabyte"),
    t("Common:Petabyte"),
    t("Common:Exabyte"),
  ];

  if (bytes <= 0) return `${`0 ${t("Bytes")}`}`;

  if (bytes >= 1024) {
    power = getPowerFromBytes(bytes, sizeNames.length - 1);
    resultSize = getSizeFromBytes(bytes, power);
  }

  if (withoutSizeName) return `${resultSize}`;

  return `${resultSize} ${sizeNames[power]}`;
};

export const calculateTotalPrice = (
  quantity: number,
  unitPrice: number,
): number => {
  return Number((quantity * unitPrice).toFixed(2));
};

export const truncateNumberToFraction = (
  value: number,
  digits: number = 2,
): string => {
  const [intPart, fracPart = ""] = value.toString().split(".");
  const truncated = fracPart.slice(0, digits).padEnd(digits, "0");
  return `${intPart}.${truncated}`;
};

export const formatCurrencyValue = (
  language: string,
  amount: number,
  currency: string,
  fractionDigits: number = 3,
) => {
  const truncatedStr = truncateNumberToFraction(amount, fractionDigits);
  const truncated = Number(truncatedStr);

  const formatter = new Intl.NumberFormat(language, {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  return formatter.format(truncated);
};

