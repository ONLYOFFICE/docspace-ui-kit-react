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

import type { TTranslation } from "../../../utils/common";
import { truncateNumberToFraction } from "../../utils/common";

const truncateNumberToFractionNumeric = (
  value: number,
  fractionDigits: number,
) => {
  if (!Number.isFinite(value)) return value;

  const factor = 10 ** fractionDigits;
  return Math.trunc(value * factor) / factor;
};

export const formattedBalanceTokens = (
  language: string,
  amount: number,
  currency: string,
  maximumFractionDigits: number = 3,
) => {
  const truncatedStr = truncateNumberToFraction(amount, maximumFractionDigits);
  const truncated = Number(truncatedStr);

  const formatter = new Intl.NumberFormat(language, {
    style: "currency",
    currency,
    minimumFractionDigits: maximumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.formatToParts(truncated);
};

export const getEffectiveFraction = (
  value: number,
  isScientific: boolean = false,
  fractionDigits: number = 0,
): number => {
  const str = value.toString();

  if (isScientific) {
    const [mantissa, expPart] = str.split("e-");
    const exponent = Number(expPart);

    const mantissaFraction = mantissa.split(".")[1]?.length ?? 0;

    const actualFractionDigits = exponent + mantissaFraction;

    if (fractionDigits === 0) return actualFractionDigits;

    return Math.min(fractionDigits, actualFractionDigits);
  }

  const actualFractionLength = str.split(".")[1]?.length ?? 0;

  if (fractionDigits === 0) return actualFractionLength;

  return Math.min(fractionDigits, actualFractionLength);
};

export const formatterCurrencyWithoutTranction = (
  language: string,
  amount: number,
  currency: string,
  wholeFractionDigits?: number,
) => {
  const maximumFractionDigits = 8;

  let effectiveDigits = maximumFractionDigits;

  const str = amount.toString();
  const isScientific = /e/i.test(str);

  const isWholeNumber = isScientific
    ? false
    : Number.isFinite(amount) && Math.abs(amount - Math.trunc(amount)) < 1e-9;

  if (!isWholeNumber) {
    effectiveDigits = getEffectiveFraction(amount, isScientific);
  }

  const effectiveFractionDigits = isWholeNumber
    ? (wholeFractionDigits ?? 2)
    : effectiveDigits;

  const truncated = isScientific
    ? truncateNumberToFractionNumeric(amount, effectiveFractionDigits)
    : amount;

  const formatter = new Intl.NumberFormat(language, {
    style: "currency",
    currency,
    minimumFractionDigits: effectiveFractionDigits,
    maximumFractionDigits: effectiveFractionDigits,
  });

  return formatter.format(truncated);
};

export const accountingLedgersFormat = (
  language: string,
  amount: number,
  isCredit: boolean,
  currency: string,
) => {
  const value = formatterCurrencyWithoutTranction(language, amount, currency);

  return `${isCredit ? "+" : "-"}${value}`;
};

export const getServiceQuantity = (
  t: TTranslation,
  quantity: number,
  serviceUnit?: string,
) => {
  if (!serviceUnit) return "—";
  return t("Common:UnitCount", { unit: serviceUnit, count: quantity });
};
