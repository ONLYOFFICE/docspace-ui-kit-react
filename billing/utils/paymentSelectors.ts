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

import type { TBalance } from "../types";
import type { DateTime } from "luxon";
import { formatDate as formatDateUtil } from "../../utils/date";

/**
 * Pure derivations for payment card / wallet state.
 *
 * Single source of truth shared by every payment store (ui-kit billing store
 * and the client PaymentStore) so the logic is defined exactly once. The
 * functions take primitives only and have no store/context dependency.
 */

export type TCardStatusInput = {
  isNonProfit?: boolean;
  isFreeTariff?: boolean;
  walletCustomerEmail?: string | null;
};

export const getCardLinkedOnFreeTariff = (
  isFreeTariff?: boolean,
  walletCustomerEmail?: string | null,
): boolean => !!isFreeTariff && !!walletCustomerEmail;

export const getCardLinkedOnNonProfit = (
  isNonProfit?: boolean,
  walletCustomerEmail?: string | null,
): boolean => {
  if (!isNonProfit) return false;
  if (!walletCustomerEmail) return false;

  return true;
};

export const getIsCardLinkedToPortal = ({
  isNonProfit,
  isFreeTariff,
  walletCustomerEmail,
}: TCardStatusInput): boolean =>
  getCardLinkedOnNonProfit(isNonProfit, walletCustomerEmail) ||
  getCardLinkedOnFreeTariff(isFreeTariff, walletCustomerEmail) ||
  (!isNonProfit && !isFreeTariff);

export const getIsPayer = (
  userEmail?: string | null,
  walletCustomerEmail?: string | null,
): boolean => {
  if (!userEmail || !walletCustomerEmail) return false;

  return userEmail.toLowerCase() === walletCustomerEmail.toLowerCase();
};

export const formatPaymentDate = (date: DateTime, timeType?: "start" | "end"): string => {
  if (!timeType) {
    return formatDateUtil(date, "yyyy-MM-dd'T'HH:mm:ss", { locale: "en" });
  }

  const dateStr = formatDateUtil(date, "yyyy-MM-dd", { locale: "en" });
  const timeTypeValue = timeType === "start" ? "00:00:00" : "23:59:59";

  return `${dateStr}T${timeTypeValue}`;
};

export const getWalletBalanceAmount = (data: TBalance): number => {
  const balance = data && typeof data !== "number" ? data : null;
  if (balance?.subAccounts && balance.subAccounts.length > 0)
    return balance.subAccounts[0].amount ?? 0;

  return 0.0;
};

export const getWalletBalanceCurrency = (data: TBalance): string => {
  const balance = data && typeof data !== "number" ? data : null;
  if (balance?.subAccounts && balance.subAccounts.length > 0)
    return balance.subAccounts[0].currency ?? "USD";

  return "USD";
};
