// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type { TNumericPaymentFeature } from "@docspace/shared/api/portal/types";

export type TServiceFeatureWithPrice = TNumericPaymentFeature & {
  price: {
    value: number;
    currencySymbol?: string;
  };
  serviceName?: string;
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
  price: TAiToolsChatPrice;
};

type TAiToolsEmbeddingModelPrice = {
  id: string;
  alias: string;
  provider: string;
  image: string;
  price: TAiToolsEmbeddingPrice;
};

type TAiToolsWebSearchPrice = {
  id: string;
  alias: string;
  provider: string;
  image: string;
  price: number;
};

export type TAiToolsPrices = {
  currency?: {
    code: string;
    symbol: string;
  };
  chat?: TAiToolsChatModelPrice[];
  embedding?: TAiToolsEmbeddingModelPrice[];
  webSearch?: TAiToolsWebSearchPrice[];
};

/** Minimal config provided by the host application. Everything else is fetched internally. */
export type TPaymentConfig = {
  theme: any;
  language: string;
  expandArticle: boolean;
  logoText?: string;
  walletHelpUrl?: string;
  utcOffset?: string;
};

/** Full internal data shape — populated via API fetches, not passed in from outside. */
export type TPaymentExternalState = {
  language: string;
  userId: string;
  isOwner: boolean;
  walletHelpUrl: string;
  logoText: string;
  utcOffset: string;
  walletCustomerEmail: string;
  walletCustomerStatusNotActive: boolean;
  walletCustomerInfo: unknown;
  isFreeTariff: boolean;
  isNonProfit: boolean;
  isYearTariff: boolean;
  isGracePeriod: boolean;
  isNotPaidPeriod: boolean;
  isPaidPeriod: boolean;
  addedManagersCount: number;
  maxCountManagersByQuota: number;
  usedTotalStorageSizeCount: number;
  currentPlanCost: { value: number; currencySymbol?: string };
  planCost: { value: number; isoCurrencySymbol: string };
  stepAddingQuotaManagers: number | null;
  stepAddingQuotaTotalSize: number | null;
  previousStoragePlanSize: number | null;
  currentStoragePlanSize: number | null;
  hasScheduledStorageChange: boolean;
  nextStoragePlanSize: number | null;
  hasStorageSubscription: boolean;
  theme: any;
  expandArticle: boolean;
  currentTariffPlanTitle: string;
  tariffPlanTitle: string;
  customerId: string;
  portalTariffStatus: any;
  paymentDate: string;
  gracePeriodEndDate: string;
  delayDaysCount: number;
  isPaymentDateValid: boolean;
  portalPaymentQuotas: any;
  portalPaymentQuotasFeatures: any;
  quotaCharacteristics: any[];
  // Computed fields accessed via cast in components
  maxFreeBackups?: number;
  daysUntilStorageExpiry?: number;
  storageExpiryDate?: string;
};

export type TPaymentNavigationEvent =
  | { action: "open-main-tariff" }
  | { action: "open-wallet" }
  | { action: "open-payment-method" }
  | { action: "open-services" }
  | { action: "open-disk-storage" }
  | { action: "open-ai-services" }
  | { action: "open-backup" };
