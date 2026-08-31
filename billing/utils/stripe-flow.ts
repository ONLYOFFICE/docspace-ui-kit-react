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

import { isIOS } from "react-device-detect";

import { toAbsoluteUrl } from "./url";

export const PAYMENT_CALLBACK_PATH = "/billing/payment-complete";

const POLL_INITIAL_INTERVAL_MS = 2000;
const POLL_MAX_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

export type TPollOptions = {
  initialIntervalMs?: number;
  maxIntervalMs?: number;
  timeoutMs?: number;
};

export const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });

export const pollUntil = async (
  check: () => Promise<boolean>,
  signal: AbortSignal,
  options?: TPollOptions,
) => {
  const {
    initialIntervalMs = POLL_INITIAL_INTERVAL_MS,
    maxIntervalMs = POLL_MAX_INTERVAL_MS,
    timeoutMs = POLL_TIMEOUT_MS,
  } = options ?? {};

  const startedAt = Date.now();
  let interval = initialIntervalMs;
  while (!signal.aborted) {
    if (await check()) return;
    if (signal.aborted) return;
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error("Polling timeout");
    }
    await sleep(interval, signal);
    interval = Math.min(interval * 2, maxIntervalMs);
  }
};

export type TStripeCheckoutDeps = {
  walletCodeCurrency: string;
  language: string;
  fetchCardLinked: (
    backUrl?: string,
    successUrl?: string,
  ) => Promise<string | null | undefined>;
};

export const openStripeCheckout = async (
  { walletCodeCurrency, language, fetchCardLinked }: TStripeCheckoutDeps,
  amount: string,
  service?: string,
  successParams?: Record<string, string>,
) => {
  const useSameTab = isIOS;

  const currency = walletCodeCurrency || "USD";
  const lang = language || "en";
  const backUrl = `${window.location.origin}${window.location.pathname}`;

  const serviceParam = service ? `&service=${service}` : "";
  const extraParams = successParams
    ? Object.entries(successParams)
        .map(([key, value]) => `&${key}=${encodeURIComponent(value)}`)
        .join("")
    : "";
  const successUrl = `${window.location.origin}${PAYMENT_CALLBACK_PATH}?currency=${currency}&amount=${amount}&type=wallet&language=${lang}${serviceParam}${extraParams}`;

  const linkUrl = await fetchCardLinked(backUrl, successUrl);

  if (!linkUrl) throw new Error("Missing Stripe checkout URL");

  const checkoutUrl = toAbsoluteUrl(linkUrl);

  if (useSameTab) window.location.href = checkoutUrl;
  else window.open(checkoutUrl, "_blank");
};

export type TTopUpCompletionDeps = {
  walletBalance: number;
  fetchCustomerInfo: (refresh?: boolean) => Promise<string | null | undefined>;
  fetchBalance: (isRefresh?: boolean) => Promise<number>;
};

export const waitForTopUpCompletion = async (
  {
    walletBalance: initialBalance,
    fetchCustomerInfo,
    fetchBalance,
  }: TTopUpCompletionDeps,
  signal: AbortSignal,
) => {
  await pollUntil(async () => {
    const email = await fetchCustomerInfo(true);
    return !!email;
  }, signal);

  await pollUntil(async () => {
    const newBalance = await fetchBalance(true);
    return newBalance > initialBalance;
  }, signal);
};

