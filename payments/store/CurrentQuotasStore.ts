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
      const res = await this.paymentApi.getQuotaPaymentInformation(isRefresh, {
        signal: abortController.signal,
      });

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

