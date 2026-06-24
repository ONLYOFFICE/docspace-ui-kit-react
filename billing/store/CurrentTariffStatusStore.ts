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

  private _tariffWalletQuota: (Quota & { additional?: boolean }) | null = null;

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

  get hasTariffWalletSubscription() {
    return this._tariffWalletQuota !== null;
  }

  get currentTariffAdminsCount() {
    return this._tariffWalletQuota?.quantity ?? null;
  }

  get hasScheduledTariffAdminsChange() {
    if (!this._tariffWalletQuota) return false;
    return (this._tariffWalletQuota.nextQuantity ?? -1) >= 0;
  }

  get nextTariffAdminsCount() {
    if (!this._tariffWalletQuota) return null;
    return this._tariffWalletQuota.nextQuantity ?? null;
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
      const res = await this.portalQuotaApi.getPortalTariff(
        {
          refresh: isRefresh,
        },
        {
          signal: abortController.signal,
        },
      );

      if (!res?.data?.response) return;

      const tariff = res.data.response as unknown as Tariff;

      this.portalTariffStatus = tariff;

      type WalletQuota = Quota & { additional?: boolean };
      const walletQuotas: WalletQuota[] =
        (tariff.quotas as WalletQuota[])?.filter((q) => q.wallet === true) ??
        [];

      const storageQuota = walletQuotas.find((q) => q.additional !== false);
      const tariffQuota = walletQuotas.find((q) => q.additional === false);

      // QuotaState.Overdue = 1
      if (storageQuota) {
        if ((storageQuota.state as unknown as number) === 1) {
          this._previousWalletQuota = [storageQuota];
          this._walletQuotas = [];
        } else {
          this._walletQuotas = [storageQuota];
          this._previousWalletQuota = [];
        }
      } else {
        this._walletQuotas = [];
        this._previousWalletQuota = [];
      }

      if (tariffQuota && (tariffQuota.state as unknown as number) !== 1) {
        this._tariffWalletQuota = tariffQuota;
      } else {
        this._tariffWalletQuota = null;
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
        {
          refresh: isRefresh || undefined,
        },
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

      return this.payerInfo;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };
}

export default CurrentTariffStatusStore;

