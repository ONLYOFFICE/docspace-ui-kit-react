import { makeAutoObservable } from "mobx";
import {
  type PaymentApi,
  type PortalQuotaApi,
  type Tariff,
  type Quota,
  PaymentMethodStatus,
} from "@onlyoffice/docspace-api-sdk";
import {
  dateDiff,
  formatDateLocalized,
  getAppTimezone,
  isValidDate,
  now,
} from "../../utils/date";
import { daysUntil } from "../utils/common";
import { TOTAL_SIZE } from "../constants";
import { isDocsConnectService } from "../utils/docs-connect";
import type { TCustomerInfo, TWalletServiceQuota } from "../types";

class CurrentTariffStatusStore {
  private portalQuotaApi: PortalQuotaApi;

  private paymentApi: PaymentApi;

  private abortControllers: AbortController[] = [];

  portalTariffStatus: Tariff | null = null;

  private _walletQuotas: Quota[] = [];

  private _previousWalletQuota: Quota[] = [];

  private _tariffWalletQuota: (Quota & { additional?: boolean }) | null = null;

  private _storageServiceId: number | null = null;

  private _docsConnectServiceIds: number[] = [];

  private _walletServicesResolved = false;

  payerInfo: TCustomerInfo = {
    portalId: null,
    paymentMethodStatus: 0,
    isDelayedPaymentMethod: false,
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

  get daysUntilPayment() {
    const dueDate = this.portalTariffStatus?.dueDate;
    if (!dueDate || !this.isPaymentDateValid) return 0;
    return Math.max(0, daysUntil(dueDate));
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
    return daysUntil(this.storageSubscriptionExpiryDate);
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

  get isDelayedPaymentMethod() {
    return this.payerInfo.isDelayedPaymentMethod === true;
  }

  private resolveWalletServiceIds = async () => {
    if (this._walletServicesResolved) return;

    try {
      const res = await this.paymentApi.getWalletServices({});
      const services = (res?.data?.response ??
        []) as unknown as TWalletServiceQuota[];

      this._storageServiceId =
        services.find((service) =>
          (service.features ?? []).some((feature) => feature.id === TOTAL_SIZE),
        )?.id ?? null;
      this._docsConnectServiceIds = services
        .filter((service) => isDocsConnectService(service))
        .map((service) => service.id);
      this._walletServicesResolved = true;
    } catch {
      this._walletServicesResolved = false;
    }
  };

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

      if (walletQuotas.length > 0) await this.resolveWalletServiceIds();

      const candidates = walletQuotas.filter(
        (q) => q.id == null || !this._docsConnectServiceIds.includes(q.id),
      );

      const storageQuota =
        this._storageServiceId != null
          ? walletQuotas.find((q) => q.id === this._storageServiceId)
          : candidates.find((q) => q.additional !== false);
      const tariffQuota = candidates.find((q) => q.additional === false);

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

      const info = res.data.response as unknown as TCustomerInfo;

      this.payerInfo = {
        portalId: null,
        paymentMethodStatus: info.paymentMethodStatus ?? 0,
        isDelayedPaymentMethod: info.isDelayedPaymentMethod ?? false,
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

