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
import { FREE_BACKUP, MANAGER, ROOM, YEAR_KEY, TOTAL_SIZE } from "../constants";

export { TOTAL_SIZE };

class CurrentQuotasStore {
  private paymentApi: PaymentApi;

  private abortControllers: AbortController[] = [];

  currentPortalQuota: QuotaDto | null = null;

  currentPortalQuotaFeatures: Map<string, TenantQuotaFeatureDto> = new Map();

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

  setIsLoaded = (isLoaded: boolean) => {
    this.isLoaded = isLoaded;
  };

  get currentQuotaId() {
    return this.currentPortalQuota?.id ?? null;
  }

  get isFreeTariff() {
    return !!this.currentPortalQuota?.free;
  }

  get isNonProfit() {
    return !!this.currentPortalQuota?.nonProfit;
  }

  get isYearTariff() {
    const result = this.currentPortalQuotaFeatures.get(YEAR_KEY) as
      | TBooleanPaymentFeature
      | undefined;
    return !!result?.value;
  }

  get currentTariffPlanTitle() {
    return this.currentPortalQuota?.title ?? "";
  }

  get currentPlanCost() {
    if (this.currentPortalQuota?.price) {
      return {
        value: this.currentPortalQuota.price.value,
        currencySymbol: this.currentPortalQuota.price.currencySymbol,
      };
    }
    return { value: 0, currencySymbol: "" };
  }

  get maxCountManagersByQuota() {
    const result = this.currentPortalQuotaFeatures.get(MANAGER) as
      | TNumericPaymentFeature
      | undefined;
    return result?.value ?? 0;
  }

  get addedManagersCount() {
    const result = this.currentPortalQuotaFeatures.get(MANAGER) as
      | TNumericPaymentFeature
      | undefined;
    return result?.used?.value ?? 0;
  }

  get usedTotalStorageSizeCount() {
    const result = this.currentPortalQuotaFeatures.get(TOTAL_SIZE) as
      | TNumericPaymentFeature
      | undefined;
    return result?.used?.value ?? 0;
  }

  get maxTotalSizeByQuota() {
    const result = this.currentPortalQuotaFeatures.get(TOTAL_SIZE) as
      | TNumericPaymentFeature
      | undefined;
    if (!result?.value) return -1;
    return result.value;
  }

  get isStorageTariffLimit() {
    if (this.maxTotalSizeByQuota === -1) return false;

    return (
      (this.usedTotalStorageSizeCount / this.maxTotalSizeByQuota) * 100 >= 90 &&
      this.usedTotalStorageSizeCount >= this.maxTotalSizeByQuota
    );
  }

  get maxFreeBackups() {
    const result = this.currentPortalQuotaFeatures.get(FREE_BACKUP) as
      | TNumericPaymentFeature
      | undefined;

    return result?.value ?? 0;
  }

  get quotaCharacteristics() {
    const characteristics: TenantQuotaFeatureDto[] = [];
    const roomFeature = this.currentPortalQuotaFeatures.get(ROOM);
    const managerFeature = this.currentPortalQuotaFeatures.get(MANAGER);
    const totalSizeFeature = this.currentPortalQuotaFeatures.get(TOTAL_SIZE);

    if (roomFeature) characteristics.push(roomFeature);
    if (managerFeature) characteristics.push(managerFeature);
    if (totalSizeFeature) characteristics.push(totalSizeFeature);

    return characteristics;
  }

  setPortalQuotaValue = (res: QuotaDto) => {
    this.currentPortalQuota = res;
    this.currentPortalQuotaFeatures = new Map(
      (res.features ?? []).map((f) => [f.id ?? "", f]),
    );
    this.setIsLoaded(true);
  };

  fetchPortalQuota = async (isRefresh?: boolean) => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getQuotaPaymentInformation(
        { refresh: isRefresh },
        {
          signal: abortController.signal,
        },
      );

      if (!res?.data?.response) return;

      const quota = res.data.response as unknown as QuotaDto;
      this.setPortalQuotaValue(quota);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };
}

export default CurrentQuotasStore;
