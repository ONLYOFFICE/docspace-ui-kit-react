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

export type TPaymentUser = {
  id: string;
  email: string;
  isOwner: boolean;
};

export type TPaymentRoutes = {
  portalPayments: string;
  services: string;
  aiServices: string;
  backup: string;
  diskStorage: string;
};

/** Minimal config provided by the host application. Everything else is fetched internally. */
export type TPaymentConfig = {
  language: string;
  routes: TPaymentRoutes;
  logoText?: string;
  walletHelpUrl?: string;
  user?: TPaymentUser;
};

export type TPaymentNavigationEvent =
  | { action: "open-main-tariff" }
  | { action: "open-wallet" }
  | { action: "open-payment-method" }
  | { action: "open-services" }
  | { action: "open-disk-storage" }
  | { action: "open-ai-services" }
  | { action: "open-backup" };

