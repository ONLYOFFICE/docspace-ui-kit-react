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

import { makeAutoObservable } from "mobx";
import type {
  PaymentApi,
  TenantQuotaFeatureDto,
  QuotaDto,
} from "@onlyoffice/docspace-api-sdk";
import type { TNumericPaymentFeature, TBooleanPaymentFeature } from "../types";
import { MANAGER, YEAR_KEY } from "../constants";
import { TOTAL_SIZE } from "./CurrentQuotasStore";
import type CurrentQuotasStore from "./CurrentQuotasStore";

class PaymentQuotasStore {
  private paymentApi: PaymentApi;

  private abortControllers: AbortController[] = [];

  currentQuotasStore: CurrentQuotasStore | null = null;

  portalPaymentQuotas: QuotaDto | null = null;

  portalPaymentQuotasFeatures: Map<string, TenantQuotaFeatureDto> = new Map();

  isLoaded = false;

  constructor(paymentApi: PaymentApi) {
    this.paymentApi = paymentApi;

    makeAutoObservable(this);
  }

  private addAbortController(controller: AbortController) {
    this.abortControllers.push(controller);
  }

  dispose = () => {
    for (const controller of this.abortControllers) {
      controller.abort();
    }
    this.abortControllers = [];
  };

  setCurrentQuotasStore = (store: CurrentQuotasStore) => {
    this.currentQuotasStore = store;
  };

  setIsLoaded = (isLoaded: boolean) => {
    this.isLoaded = isLoaded;
  };

  get usedTotalStorageSizeTitle() {
    return this.portalPaymentQuotasFeatures.get(TOTAL_SIZE)?.priceTitle;
  }

  get addedManagersCountTitle() {
    return this.portalPaymentQuotasFeatures.get(MANAGER)?.priceTitle;
  }

  get tariffPlanTitle() {
    return this.portalPaymentQuotas?.title ?? "";
  }

  get planCost() {
    const price = this.portalPaymentQuotas?.price;
    return {
      value: price?.value ?? 0,
      isoCurrencySymbol: price?.isoCurrencySymbol ?? "USD",
    };
  }

  get stepAddingQuotaManagers() {
    const result = this.portalPaymentQuotasFeatures.get(MANAGER) as
      | TNumericPaymentFeature
      | undefined;
    return result?.value ?? null;
  }

  get stepAddingQuotaTotalSize() {
    const result = this.portalPaymentQuotasFeatures.get(TOTAL_SIZE) as
      | TNumericPaymentFeature
      | undefined;
    return result?.value ?? null;
  }

  fetchPaymentQuotas = async () => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getPaymentQuotas(
        {
          wallet: false,
        },
        {
          signal: abortController.signal,
        },
      );

      if (!res?.data?.response) return;

      const quotas = res.data.response as unknown as QuotaDto[];

      type QuotaWithMap = QuotaDto & {
        featuresMap: Map<string, TenantQuotaFeatureDto>;
      };

      const quotasById = new Map<number, QuotaWithMap>(
        quotas.map((q) => [
          q.id,
          {
            ...q,
            featuresMap: new Map(
              (q.features ?? []).map((f) => [f.id ?? "", f]),
            ),
          },
        ]),
      );

      const quotasByYear = new Map<boolean, QuotaWithMap>(
        Array.from(quotasById.values()).map((q) => {
          const yearFeature = q.featuresMap.get(YEAR_KEY) as
            | TBooleanPaymentFeature
            | undefined;
          return [yearFeature?.value ?? false, q];
        }),
      );

      const isFreeTariff = this.currentQuotasStore?.isFreeTariff ?? true;
      const currentQuotaId = this.currentQuotasStore?.currentQuotaId ?? null;

      let matchedQuota: QuotaWithMap | undefined;

      if (isFreeTariff) {
        matchedQuota = quotasByYear.get(false);
      } else if (currentQuotaId !== null) {
        matchedQuota = quotasById.get(currentQuotaId);
      }
      if (!matchedQuota) {
        matchedQuota = quotasByYear.get(true);
      }

      if (!matchedQuota) return;

      this.portalPaymentQuotas = matchedQuota;
      this.portalPaymentQuotasFeatures = matchedQuota.featuresMap;

      this.setIsLoaded(true);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };
}

export default PaymentQuotasStore;
