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

import type {
  TenantQuotaFeatureDto,
  Balance,
  QuotaDto,
} from "@onlyoffice/docspace-api-sdk";

/** Feature with a numeric value (e.g. manager count, storage size). */
export type TNumericPaymentFeature = TenantQuotaFeatureDto & { value: number };

/** Feature with a boolean value (e.g. SSO enabled). */
export type TBooleanPaymentFeature = TenantQuotaFeatureDto & { value: boolean };

/** Balance from the wallet API — can be a Balance object, 0, or null. */
export type TBalance = Balance | 0 | null;

/** QuotaDto extended with serviceName (returned by wallet service endpoints). */
export type TWalletServiceQuota = QuotaDto & { serviceName?: string };

export type TServiceFeatureWithPrice = TNumericPaymentFeature & {
  price: {
    value: number;
    currencySymbol?: string;
  };
  serviceName?: string;
};

export type TDocsConnectCardState = {
  subscribed: boolean;
  isTrial: boolean;
  trialDaysLeft: number;
  trialEndingSoon: boolean;
  trialExpired: boolean;
  trialEndDate: string;
  tariffPrice: number;
  tariffUsers: number;
  scheduledUsers: number | null;
  scheduledDate: string;
  deactivated: boolean;
  canceled: boolean;
};

export type TDocsConnectScheduledChange = {
  nextUsers: number;
  dueDate: string;
};

export type TDocsConnectPageState = {
  isPaid: boolean;
  expired: boolean;
  daysLeft: number;
  totalDays: number;
  spentPercent: number;
  endDate: string;
  currency: string;
  credits: number;
  planUsers: number;
  pricePerUser: number;
  basePricePerUser: number;
  devPackEnabled: boolean;
  monthlyCharge: number;
  scheduledChange: TDocsConnectScheduledChange | null;
  deactivated: boolean;
  canceled: boolean;
};

type TAiToolsChatPrice = {
  prompt: number;
  completion: number;
};

type TAiToolsEmbeddingPrice = {
  prompt: number;
};

type TAiToolsChatModelPrice = {
  id: string;
  alias: string;
  provider: string;
  image: string;
  link?: string;
  price: TAiToolsChatPrice;
};

type TAiToolsEmbeddingModelPrice = {
  id: string;
  alias: string;
  provider: string;
  image: string;
  link?: string;
  price: TAiToolsEmbeddingPrice;
};

type TAiToolsWebSearchPrice = {
  id: string;
  alias: string;
  provider: string;
  image: string;
  link?: string;
  price: number;
};

export type TAiToolsPrices = {
  currency?: {
    code: string;
    symbol: string;
  };
  chat?: TAiToolsChatModelPrice[];
  image?: TAiToolsChatModelPrice[];
  embedding?: TAiToolsEmbeddingModelPrice[];
  webSearch?: TAiToolsWebSearchPrice[];
};

export type TPaymentUser = {
  id: string;
  email: string;
  isOwner: boolean;
};

export type TUpcomingPaymentActionType = "edit-plan" | "edit-subscription";

export type TUpcomingPayment = {
  id: string;
  renewalDate: string;
  /** Short, localized "month day" date (no year), e.g. "July 1". */
  renewalDateShort: string;
  /** Raw ISO due date, used for filtering (e.g. current month). */
  dueDate: string;
  title: string;
  quantity: number;
  unitOfMeasure: string;
  amount: number;
  actionType?: TUpcomingPaymentActionType;
};

export type TUpcomingPaymentResponse = {
  id: number;
  name: string;
  title: string;
  unitOfMeasure: string;
  quantity: number;
  wallet: boolean;
  dueDate: string;
  amount: number;
  currency: string;
};

export type TServiceUsage = {
  service: string;
  serviceUnit: string;
  currency: string;
  totalQuantity: number;
  totalAmount: number;
  operationCount: number;
  title: string;
  /** Per-unit price for the service. */
  price: number;
  /** Whether the service is billed as a recurring subscription. */
  subscription: boolean;
};

/** A single month bucket from the monthly usage endpoint. */
export type TServiceUsageMonthly = {
  year: number;
  month: number;
  currency: string;
  totalAmount: number;
  operationCount: number;
};

/** Selectable period for the Usage page spending breakdown. */
export type TUsagePeriodKey =
  | "thisMonth"
  | "lastMonth"
  | "last3Months"
  | "last6Months"
  | "last12Months"
  | "thisYear"
  | "lastYear";

export type TPaymentRoutes = {
  portalPayments: string;
  services: string;
  aiServices: string;
  aiSearch: string;
  backup: string;
  diskStorage: string;
  wallet?: string;
};

export type TPaymentConfig = {
  language: string;
  routes?: TPaymentRoutes;
  logoText?: string;
  walletHelpUrl?: string;
  user?: TPaymentUser;
  mobileBreakpoint?: number;
  desktopBreakpoint?: number;
  openOnNewPage?: boolean;
  onServicesInit?: () => Promise<unknown>;
};

export type TPaymentNavigationEvent =
  | { action: "open-main-tariff" }
  | { action: "open-wallet" }
  | { action: "open-payment-method" }
  | { action: "open-services" }
  | { action: "open-disk-storage" }
  | { action: "open-ai-services" }
  | { action: "open-backup" };

