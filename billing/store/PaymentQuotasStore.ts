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
        {},
        {
          signal: abortController.signal,
          // TODO: move `additional` into the typed request once the SDK
          // regenerates PaymentApiGetPaymentQuotasRequest with this field.
          // Passed via axios params so it is appended to the query string.
          params: { additional: false },
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

