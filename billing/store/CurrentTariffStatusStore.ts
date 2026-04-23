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
import {
  type PaymentApi,
  type PortalQuotaApi,
  type Tariff,
  type Quota,
  type CustomerInfoDto,
  PaymentMethodStatus,
} from "@onlyoffice/docspace-api-sdk";
import {
  dateDiff,
  formatDateLocalized,
  getAppTimezone,
  isValidDate,
  now,
} from "../../utils/date";

class CurrentTariffStatusStore {
  private portalQuotaApi: PortalQuotaApi;

  private paymentApi: PaymentApi;

  private abortControllers: AbortController[] = [];

  portalTariffStatus: Tariff | null = null;

  private _walletQuotas: Quota[] = [];

  private _previousWalletQuota: Quota[] = [];

  payerInfo: CustomerInfoDto = {
    portalId: null,
    paymentMethodStatus: 0,
    email: null,
    payer: undefined,
  };

  isLoaded = false;

  language = "en";

  constructor(portalQuotaApi: PortalQuotaApi, paymentApi: PaymentApi) {
    this.portalQuotaApi = portalQuotaApi;
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

  setLanguage = (language: string) => {
    this.language = language;
  };

  setIsLoaded = (isLoaded: boolean) => {
    this.isLoaded = isLoaded;
  };

  get isGracePeriod() {
    // TariffState.Delay = 2
    return (this.portalTariffStatus?.state as unknown as number) === 2;
  }

  get isPaidPeriod() {
    // TariffState.Paid = 1
    return (this.portalTariffStatus?.state as unknown as number) === 1;
  }

  get isNotPaidPeriod() {
    // TariffState.NotPaid = 3
    return (this.portalTariffStatus?.state as unknown as number) === 3;
  }

  get customerId() {
    return this.portalTariffStatus?.customerId ?? "";
  }

  get isPaymentDateValid() {
    const dueDate = this.portalTariffStatus?.dueDate;
    if (!dueDate) return false;
    return isValidDate(dueDate);
  }

  get paymentDate() {
    const dueDate = this.portalTariffStatus?.dueDate;
    if (!dueDate) return "";
    if (!this.isPaymentDateValid) return "";
    return formatDateLocalized(dueDate, "DATE_FULL", {
      locale: this.language,
      timezone: getAppTimezone(),
    });
  }

  get gracePeriodEndDate() {
    const tariff = this.portalTariffStatus;
    if (!tariff) return "";

    const endDateSrc = isValidDate(tariff.delayDueDate)
      ? tariff.delayDueDate
      : tariff.dueDate;

    if (!endDateSrc) return "";

    return formatDateLocalized(endDateSrc, "DATE_FULL", {
      locale: this.language,
      timezone: getAppTimezone(),
    });
  }

  get delayDaysCount() {
    const delayDueDate = this.portalTariffStatus?.delayDueDate;
    if (!delayDueDate) return 0;
    return Math.floor(Math.abs(dateDiff(delayDueDate, now(), "days")));
  }

  get hasStorageSubscription() {
    return this._walletQuotas.length > 0;
  }

  get hasPreviousStorageSubscription() {
    return this._previousWalletQuota.length > 0;
  }

  get currentStoragePlanSize() {
    if (!this.hasStorageSubscription || !this._walletQuotas[0]) return 0;
    return this._walletQuotas[0].quantity || 0;
  }

  get previousStoragePlanSize() {
    if (!this.hasPreviousStorageSubscription || !this._previousWalletQuota[0])
      return 0;
    return this._previousWalletQuota[0].quantity || 0;
  }

  get hasScheduledStorageChange() {
    if (!this.hasStorageSubscription || !this._walletQuotas[0]) return false;
    return (this._walletQuotas[0].nextQuantity ?? -1) >= 0;
  }

  get nextStoragePlanSize() {
    if (!this.hasStorageSubscription || !this._walletQuotas[0]) return null;
    return this._walletQuotas[0].nextQuantity ?? null;
  }

  get storageSubscriptionExpiryDate() {
    return this._walletQuotas[0]?.dueDate;
  }

  get storageExpiryDate() {
    if (!this.storageSubscriptionExpiryDate) return "";
    return formatDateLocalized(
      this.storageSubscriptionExpiryDate,
      "DATE_FULL",
      {
        locale: this.language,
        timezone: getAppTimezone(),
      },
    );
  }

  get daysUntilStorageExpiry() {
    if (!this.storageSubscriptionExpiryDate) return 0;
    return Math.floor(
      dateDiff(this.storageSubscriptionExpiryDate, now(), "days"),
    );
  }

  get walletCustomerEmail() {
    return this.payerInfo.email ?? "";
  }

  get walletCustomerStatusNotActive() {
    if (!this.walletCustomerEmail) return false;

    const status =
      (this.payerInfo.paymentMethodStatus as unknown as number) ?? 0;

    return (
      status === PaymentMethodStatus.None ||
      status === PaymentMethodStatus.Expired
    );
  }

  get walletCustomerInfo() {
    return this.payerInfo.payer ?? null;
  }

  fetchPortalTariff = async (isRefresh?: boolean) => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.portalQuotaApi.getPortalTariff(isRefresh, {
        signal: abortController.signal,
      });

      if (!res?.data?.response) return;

      const tariff = res.data.response as unknown as Tariff;

      this.portalTariffStatus = tariff;

      const walletQuota = tariff.quotas?.find((q: Quota) => q.wallet === true);

      if (walletQuota) {
        // QuotaState.Overdue = 1
        if ((walletQuota.state as unknown as number) === 1) {
          this._previousWalletQuota = [walletQuota];
          this._walletQuotas = [];
        } else {
          this._walletQuotas = [walletQuota];
          this._previousWalletQuota = [];
        }
      } else {
        this._walletQuotas = [];
        this._previousWalletQuota = [];
      }

      this.setIsLoaded(true);

      return tariff;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  fetchCustomerInfo = async (isRefresh?: boolean) => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getCustomerInfo(
        isRefresh || undefined,
        {
          signal: abortController.signal,
        },
      );

      if (!res?.data?.response) return;

      const info = res.data.response as unknown as CustomerInfoDto;

      this.payerInfo = {
        portalId: null,
        paymentMethodStatus: info.paymentMethodStatus ?? 0,
        email: info.email ?? null,
        payer: info.payer,
      };
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };
}

export default CurrentTariffStatusStore;

