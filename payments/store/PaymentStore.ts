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
import type { PaymentApi, ProfilesApi } from "@onlyoffice/docspace-api-sdk";
import { toastr } from "../../components/toast";
import type { TData } from "../../components/toast";
import type {
  TBalance,
  TAutoTopUpSettings,
  TTransactionCollection,
  TPaymentFeature,
  TPaymentQuota,
  TLicenseQuota,
} from "@docspace/shared/api/portal/types";
import { formatCurrencyValue } from "@docspace/shared/utils/common";
import { combineUrl } from "@docspace/shared/utils/combineUrl";
import {
  AI_ENUM,
  BACKUP_SERVICE,
  STORAGE_TARIFF_DEACTIVATED,
  STORAGE_DEACTIVATION_VISITED,
  WEB_SEARCH,
} from "@docspace/shared/constants";
import type { TTranslation } from "@docspace/shared/types";
import {
  now,
  subtractFromDate,
  formatDate as formatDateUtil,
} from "../../utils/date";
import type { DateTime } from "luxon";
import type { TPaymentConfig, TServiceFeatureWithPrice } from "../types";
import type CurrentTariffStatusStore from "./CurrentTariffStatusStore";
import type CurrentQuotasStore from "./CurrentQuotasStore";
import type PaymentQuotasStore from "./PaymentQuotasStore";

export const TOTAL_SIZE = "total_size";

class PaymentStore {
  private paymentApi: PaymentApi;

  private profilesApi: ProfilesApi;

  private abortControllers: AbortController[] = [];

  private _currentUserEmail = "";

  tariffStatusStore: CurrentTariffStatusStore | null = null;

  quotasStore: CurrentQuotasStore | null = null;

  paymentQuotasStore: PaymentQuotasStore | null = null;

  language = "en";

  userId = "";

  isOwner = false;

  walletHelpUrl = "";

  logoText = "";

  utcOffset = "";

  theme: any = null;

  expandArticle = false;

  licenseQuota: TLicenseQuota | null = null;

  salesEmail = "";

  buyUrl = "";

  standaloneMode = true;

  currentLicense = {
    expiresDate: new Date(),
    trialMode: true,
  };

  paymentLink = "";

  accountLink = "";

  isLoading = false;

  isUpdatingBasicSettings = false;

  totalPrice = 30;

  managersCount = 1;

  maxAvailableManagersCount = 999;

  stepByQuotaForManager = 1;

  minAvailableManagersValue = 1;

  stepByQuotaForTotalSize = 107374182400;

  minAvailableTotalSizeValue = 107374182400;

  isInitPaymentPage = false;

  isLicenseCorrect = false;

  isInitWalletPage = false;

  isPaymentMethodInit = false;

  balance: TBalance = 0;

  previousBalance: TBalance = 0;

  cardLinked = "";

  transactionHistory: TTransactionCollection[] = [];

  isTransactionHistoryExist = false;

  autoPayments: TAutoTopUpSettings | null = null;

  minBalance: string = "";

  upToBalance: string = "";

  isAutomaticPaymentsEnabled: boolean = false;

  isVisibleWalletSettings = false;

  upToBalanceError = false;

  minBalanceError = false;

  servicesQuotasFeatures: Map<
    string,
    TPaymentFeature | TServiceFeatureWithPrice
  > = new Map();

  servicesQuotas: TPaymentQuota | null = null;

  isShowStorageTariffDeactivatedModal = false;

  isStorageDeactivationVisited = false;

  reccomendedAmount = "";

  constructor(paymentApi: PaymentApi, profilesApi: ProfilesApi) {
    this.paymentApi = paymentApi;
    this.profilesApi = profilesApi;

    makeAutoObservable(this);
  }

  setTariffStatusStore = (store: CurrentTariffStatusStore) => {
    this.tariffStatusStore = store;
  };

  setQuotasStore = (store: CurrentQuotasStore) => {
    this.quotasStore = store;
  };

  setPaymentQuotasStore = (store: PaymentQuotasStore) => {
    this.paymentQuotasStore = store;
  };

  configure = (config: TPaymentConfig) => {
    this.theme = config.theme;
    this.language = config.language;
    this.expandArticle = config.expandArticle;
    if (config.logoText !== undefined) this.logoText = config.logoText;
    if (config.walletHelpUrl !== undefined)
      this.walletHelpUrl = config.walletHelpUrl;
    if (config.utcOffset !== undefined) this.utcOffset = config.utcOffset;
    if (config.user) {
      this._currentUserEmail = config.user.email ?? "";
      this.userId = config.user.id ?? "";
      this.isOwner = config.user.isOwner ?? false;
    }
  };

  private addAbortController(controller: AbortController) {
    this.abortControllers.push(controller);
  }

  dispose = () => {
    for (const controller of this.abortControllers) {
      controller.abort();
    }
    this.abortControllers = [];
  };

  // ─── Getters delegated to sub-stores ───────────────────────────────────────

  get walletCustomerEmail() {
    return this.tariffStatusStore?.walletCustomerEmail ?? "";
  }

  get walletCustomerStatusNotActive() {
    return this.tariffStatusStore?.walletCustomerStatusNotActive ?? false;
  }

  get walletCustomerInfo() {
    return this.tariffStatusStore?.walletCustomerInfo ?? null;
  }

  get isGracePeriod() {
    return this.tariffStatusStore?.isGracePeriod ?? false;
  }

  get isNotPaidPeriod() {
    return this.tariffStatusStore?.isNotPaidPeriod ?? false;
  }

  get isPaidPeriod() {
    return this.tariffStatusStore?.isPaidPeriod ?? false;
  }

  get portalTariffStatus() {
    return this.tariffStatusStore?.portalTariffStatus ?? null;
  }

  get customerId() {
    return this.tariffStatusStore?.customerId ?? "";
  }

  get paymentDate() {
    return this.tariffStatusStore?.paymentDate ?? "";
  }

  get isPaymentDateValid() {
    return this.tariffStatusStore?.isPaymentDateValid ?? false;
  }

  get gracePeriodEndDate() {
    return this.tariffStatusStore?.gracePeriodEndDate ?? "";
  }

  get delayDaysCount() {
    return this.tariffStatusStore?.delayDaysCount ?? 0;
  }

  get hasStorageSubscription() {
    return this.tariffStatusStore?.hasStorageSubscription ?? false;
  }

  get currentStoragePlanSize() {
    return this.tariffStatusStore?.currentStoragePlanSize ?? 0;
  }

  get previousStoragePlanSize() {
    return this.tariffStatusStore?.previousStoragePlanSize ?? 0;
  }

  get hasScheduledStorageChange() {
    return this.tariffStatusStore?.hasScheduledStorageChange ?? false;
  }

  get nextStoragePlanSize() {
    return this.tariffStatusStore?.nextStoragePlanSize ?? null;
  }

  get storageExpiryDate() {
    return this.tariffStatusStore?.storageExpiryDate ?? "";
  }

  get daysUntilStorageExpiry() {
    return this.tariffStatusStore?.daysUntilStorageExpiry ?? 0;
  }

  get isFreeTariff() {
    return this.quotasStore?.isFreeTariff ?? true;
  }

  get isNonProfit() {
    return this.quotasStore?.isNonProfit ?? false;
  }

  get isYearTariff() {
    return this.quotasStore?.isYearTariff ?? false;
  }

  get currentTariffPlanTitle() {
    return this.quotasStore?.currentTariffPlanTitle ?? "";
  }

  get currentPlanCost() {
    return this.quotasStore?.currentPlanCost ?? { value: 0 };
  }

  get maxCountManagersByQuota() {
    return this.quotasStore?.maxCountManagersByQuota ?? 0;
  }

  get addedManagersCount() {
    return this.quotasStore?.addedManagersCount ?? 0;
  }

  get usedTotalStorageSizeCount() {
    return this.quotasStore?.usedTotalStorageSizeCount ?? 0;
  }

  get maxFreeBackups() {
    return this.quotasStore?.maxFreeBackups ?? 0;
  }

  get quotaCharacteristics() {
    return this.quotasStore?.quotaCharacteristics ?? [];
  }

  get maxTotalSizeByQuota() {
    return this.quotasStore?.maxTotalSizeByQuota ?? -1;
  }

  get isStorageTariffLimit() {
    return this.quotasStore?.isStorageTariffLimit ?? false;
  }

  get tariffPlanTitle() {
    return this.paymentQuotasStore?.tariffPlanTitle ?? "";
  }

  get planCost() {
    return (
      this.paymentQuotasStore?.planCost ?? {
        value: 0,
        isoCurrencySymbol: "USD",
      }
    );
  }

  get stepAddingQuotaManagers() {
    return this.paymentQuotasStore?.stepAddingQuotaManagers ?? null;
  }

  get stepAddingQuotaTotalSize() {
    return this.paymentQuotasStore?.stepAddingQuotaTotalSize ?? null;
  }

  get portalPaymentQuotas() {
    return this.paymentQuotasStore?.portalPaymentQuotas ?? null;
  }

  get portalPaymentQuotasFeatures() {
    return this.paymentQuotasStore?.portalPaymentQuotasFeatures ?? null;
  }

  // ─── Existing getters ───────────────────────────────────────────────────────

  get isAlreadyPaid() {
    return this.walletCustomerEmail || !this.isFreeTariff;
  }

  get isNeedRequest() {
    return this.managersCount > this.maxAvailableManagersCount;
  }

  get isLessCountThanAcceptable() {
    return this.managersCount < this.minAvailableManagersValue;
  }

  get isPayer() {
    if (!this._currentUserEmail || !this.walletCustomerEmail) return false;

    return this._currentUserEmail === this.walletCustomerEmail;
  }

  get isStripePortalAvailable() {
    return this.isOwner || this.isPayer;
  }

  get canUpdateTariff() {
    if (this.isNonProfit) {
      if (!this.walletCustomerEmail) return true;
      return this.isPayer;
    }

    if (!this.isAlreadyPaid && !this.cardLinkedOnFreeTariff) return true;

    return this.isPayer;
  }

  get canPayTariff() {
    return this.managersCount >= this.addedManagersCount;
  }

  get canDowngradeTariff() {
    if (this.addedManagersCount > this.managersCount) return false;
    if (this.usedTotalStorageSizeCount > this.allowedStorageSizeByQuota)
      return false;

    return true;
  }

  get isCardLinkedToPortal() {
    return (
      this.cardLinkedOnNonProfit ||
      this.cardLinkedOnFreeTariff ||
      (!this.isNonProfit && !this.isFreeTariff)
    );
  }

  get isAutoPaymentExist() {
    return this.autoPayments?.enabled;
  }

  get walletCodeCurrency() {
    if (this.balance && this.balance.subAccounts.length > 0)
      return this.balance.subAccounts[0].currency;

    return "USD";
  }

  get walletBalance() {
    if (this.balance && this.balance.subAccounts.length > 0)
      return this.balance.subAccounts[0].amount;

    return 0.0;
  }

  get wasFirstTopUp() {
    return typeof this.balance !== "number";
  }

  get wasChangeBalance() {
    return (
      this.previousBalance === 0 &&
      typeof this.balance !== "number" &&
      !!this.balance &&
      this.balance.subAccounts.length > 0
    );
  }

  get cardLinkedOnFreeTariff() {
    return this.isFreeTariff && !!this.walletCustomerEmail;
  }

  get cardLinkedOnNonProfit() {
    if (!this.isNonProfit) return false;
    if (!this.walletCustomerEmail) return false;

    return true;
  }

  get storageSizeIncrement() {
    return (
      (this.servicesQuotasFeatures.get(TOTAL_SIZE) as TServiceFeatureWithPrice)
        ?.value || 0
    );
  }

  get storagePriceIncrement() {
    return (
      (this.servicesQuotasFeatures.get(TOTAL_SIZE) as TServiceFeatureWithPrice)
        ?.price?.value || 0
    );
  }

  get storageServiceName() {
    return (
      this.servicesQuotasFeatures.get(TOTAL_SIZE) as TServiceFeatureWithPrice
    )?.serviceName;
  }

  get backupServicePrice() {
    return (
      (
        this.servicesQuotasFeatures.get(
          BACKUP_SERVICE,
        ) as TServiceFeatureWithPrice
      )?.price?.value || 0
    );
  }

  get webSearchPrice() {
    return (
      (this.servicesQuotasFeatures.get(WEB_SEARCH) as TServiceFeatureWithPrice)
        ?.price?.value || 0
    );
  }

  get isBackupServiceOn() {
    return this.servicesQuotasFeatures.get(BACKUP_SERVICE)?.value;
  }

  get isAiToolsServiceOn() {
    return this.servicesQuotasFeatures.get(AI_ENUM)?.value;
  }

  get availableBackupsCount() {
    if (this.backupServicePrice === 0) return 0;
    if (this.walletBalance === 0) return 0;
    return Math.floor(this.walletBalance / this.backupServicePrice);
  }

  get allowedStorageSizeByQuota() {
    if (this.managersCount > this.maxAvailableManagersCount)
      return this.maxAvailableManagersCount * this.stepByQuotaForTotalSize;

    return this.managersCount * this.stepByQuotaForTotalSize;
  }

  setIsInitPaymentPage = (value: boolean) => {
    this.isInitPaymentPage = value;
  };

  setMinBalance = (value: string) => {
    this.minBalance = value;
  };

  setUpToBalance = (value: string) => {
    this.upToBalance = value;
  };

  setUpToBalanceError = (value: boolean) => {
    this.upToBalanceError = value;
  };

  setMinBalanceError = (value: boolean) => {
    this.minBalanceError = value;
  };

  setIsAutomaticPaymentsEnabled = (value: boolean) => {
    this.isAutomaticPaymentsEnabled = value;
  };

  setIsUpdatingBasicSettings = (isUpdatingBasicSettings: boolean) => {
    this.isUpdatingBasicSettings = isUpdatingBasicSettings;
  };

  setIsInitWalletPage = (value: boolean) => {
    this.isInitWalletPage = value;
  };

  setPaymentMethodInit = (value: boolean) => {
    this.isPaymentMethodInit = value;
  };

  setVisibleWalletSetting = (isVisibleWalletSettings: boolean) => {
    this.isVisibleWalletSettings = isVisibleWalletSettings;
  };

  setIsShowTariffDeactivatedModal = (value: boolean) => {
    this.isShowStorageTariffDeactivatedModal = value;
  };

  setStorageDeactivationVisited = (value: boolean) => {
    this.isStorageDeactivationVisited = value;
    localStorage.setItem(STORAGE_DEACTIVATION_VISITED, "true");
  };

  setPaymentLink = (link: string) => {
    this.paymentLink = link;
  };

  setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };

  setReccomendedAmount = (amount: string) => {
    this.reccomendedAmount = amount;
  };

  updatePreviousBalance = () => {
    this.previousBalance = this.balance;
  };

  formatWalletCurrency = (
    item: number | null = null,
    fractionDigits: number = 3,
  ) => {
    const amount = item ?? this.walletBalance;

    return formatCurrencyValue(
      this.language,
      amount,
      this.walletCodeCurrency,
      fractionDigits,
    );
  };

  formatPaymentCurrency = (item: number = 0, fractionDigits: number = 0) => {
    const amount = item || this.walletBalance;
    const { isoCurrencySymbol } = this.planCost;

    return formatCurrencyValue(
      this.language,
      amount,
      isoCurrencySymbol || "USD",
      fractionDigits,
    );
  };

  fetchBalance = async (isRefresh?: boolean) => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getCustomerBalance(isRefresh, {
        signal: abortController.signal,
      });

      if (!res?.data?.response) return;

      this.balance = res.data.response as unknown as TBalance;
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "CanceledError") return;
      throw e;
    }
  };

  getEndTransactionDate = (format = "yyyy-MM-dd'T'HH:mm:ss") => {
    return formatDateUtil(now(), format);
  };

  getStartTransactionDate = (format = "yyyy-MM-dd'T'HH:mm:ss") => {
    const date = subtractFromDate(now(), 4, "weeks");
    return date ? formatDateUtil(date, format) : "";
  };

  formatDate = (date: DateTime, timeType?: "start" | "end") => {
    if (!timeType) {
      return formatDateUtil(date, "yyyy-MM-dd'T'HH:mm:ss", { locale: "en" });
    }

    const dateStr = formatDateUtil(date, "yyyy-MM-dd", { locale: "en" });
    const timeTypeValue = timeType === "start" ? "00:00:00" : "23:59:59";

    return `${dateStr}T${timeTypeValue}`;
  };

  fetchTransactionHistory = async (
    startDate: DateTime | null = subtractFromDate(now(), 4, "weeks"),
    endDate: DateTime | null = now(),
    credit = true,
    debit = true,
    participantName?: string,
    serviceName?: string,
  ) => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getCustomerOperations(
        0,
        25,
        serviceName,
        startDate ? this.formatDate(startDate, "start") : undefined,
        endDate ? this.formatDate(endDate, "end") : undefined,
        participantName,
        credit,
        debit,
        undefined,
        undefined,
        undefined,
        undefined,
        { signal: abortController.signal },
      );

      if (!res?.data?.response) return;

      const data = res.data.response as unknown as {
        collection: TTransactionCollection[];
      };
      this.transactionHistory = data.collection;
      this.isTransactionHistoryExist = data.collection.length > 0;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  fetchAutoPayments = async () => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getTenantWalletSettings(
        abortController.signal,
      );

      if (!res?.data?.response) return;

      const data = res.data.response as unknown as TAutoTopUpSettings;
      this.autoPayments = data;
      this.isAutomaticPaymentsEnabled = data.enabled;

      if (data.enabled) {
        this.setMinBalance(data.minBalance.toString());
        this.setUpToBalance(data.upToBalance.toString());
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  fetchCardLinked = async (url?: string) => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    const backUrl = url || `${window.location.href}?complete=true`;

    try {
      const res = await this.paymentApi.getCheckoutSetupUrl(
        backUrl,
        abortController.signal,
      );

      if (!res?.data?.response) return;

      this.cardLinked = res.data.response as unknown as string;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  updateAutoPayments = async () => {
    try {
      const res = await this.paymentApi.setTenantWalletSettings({
        settings: {
          enabled: this.isAutomaticPaymentsEnabled,
          minBalance: +this.minBalance,
          upToBalance: +this.upToBalance,
          currency: this.walletCodeCurrency || "",
        },
      });

      const data = res?.data as unknown as { response?: TAutoTopUpSettings };

      if (!data?.response) {
        throw new Error();
      }

      this.autoPayments = data.response;
    } catch (error) {
      toastr.error(error as string);
    }
  };

  handleServicesQuotas = async () => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    const res = await this.paymentApi.getWalletServices(abortController.signal);

    if (!res?.data?.response) return;

    const services = res.data.response as unknown as TPaymentQuota[];

    const quotas = services.map((service) => {
      const feature = service.features[0];
      return {
        ...feature,
        price: service.price,
        serviceName: service.serviceName,
      };
    });

    this.servicesQuotasFeatures = new Map(
      quotas.map((feature) => [feature.id, feature]),
    );

    return services;
  };

  changeServiceState = async (service: string) => {
    const feature = this.servicesQuotasFeatures.get(service);

    if (!feature) return;

    this.servicesQuotasFeatures.set(service, {
      ...feature,
      value: !feature.value,
    });
  };

  isShowStorageTariffDeactivated = () => {
    if (!this.previousStoragePlanSize) return false;

    return localStorage.getItem(STORAGE_TARIFF_DEACTIVATED) !== "true";
  };

  setPaymentAccount = async () => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getPaymentAccount(
        abortController.signal,
      );

      if (!res?.data?.response) return;

      const link = res.data.response as unknown as string;
      if (link.indexOf("error") === -1) {
        this.accountLink = link;
      } else {
        console.error(link);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  initWalletPayerAndBalance = async (isRefresh: boolean) => {
    await Promise.all([
      this.tariffStatusStore?.fetchCustomerInfo(),
      this.fetchBalance(isRefresh),
    ]);
  };

  setServiceQuota = async (serviceName = BACKUP_SERVICE) => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    const res = await this.paymentApi.getWalletService(
      serviceName,
      abortController.signal,
    );

    if (!res?.data?.response) return;

    const service = res.data.response as unknown as TPaymentQuota;
    const feature = service.features[0];

    const featureWithPrice = {
      ...feature,
      price: service.price,
      serviceName: service.serviceName,
    } as TServiceFeatureWithPrice;

    const existingEntry = Array.from(
      this.servicesQuotasFeatures.entries(),
    ).find(
      ([, value]) =>
        (value as TServiceFeatureWithPrice).serviceName === service.serviceName,
    );

    const key = existingEntry
      ? existingEntry[0]
      : service.features[0].id.toString();

    this.servicesQuotasFeatures.set(key, featureWithPrice);

    return service.serviceName;
  };

  getBasicPaymentLink = async (managersCount: number) => {
    const backUrl = combineUrl(
      window.location.origin,
      "/portal-settings/payments/portal-payments?complete=true",
    );

    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getPaymentUrl(
        { adminCount: managersCount, backUrl },
        abortController.signal,
      );

      if (!res?.data?.response) return;
      this.setPaymentLink(res.data.response as unknown as string);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "CanceledError") return;
      console.error(err);
    }
  };

  getPaymentLink = async (token = undefined) => {
    const backUrl = combineUrl(
      window.location.origin,
      "/portal-settings/payments/portal-payments?complete=true",
    );

    try {
      const res = await this.paymentApi.getPaymentUrl(
        { adminCount: this.managersCount, backUrl },
        { signal: token } as unknown as undefined,
      );

      if (!res?.data?.response) return;
      this.setPaymentLink(res.data.response as unknown as string);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "CanceledError") {
        console.log("Request canceled", err.message);
      } else {
        console.error(err);
        if (this.isInitPaymentPage) toastr.error(err as TData);
      }
    }
  };

  basicSettings = async () => {
    this.setIsUpdatingBasicSettings(true);

    const requests: Promise<unknown>[] = [];

    if (this.isGracePeriod || this.isNotPaidPeriod) {
      requests.push(this.getBasicPaymentLink(this.addedManagersCount));
    }

    if (this.isAlreadyPaid && this.isStripePortalAvailable) {
      requests.push(this.setPaymentAccount());

      if (this.isPayer && this.walletCustomerStatusNotActive) {
        requests.push(this.fetchCardLinked());
      }

      if (this.isShowStorageTariffDeactivated() && this.isPayer) {
        this.setIsShowTariffDeactivatedModal(true);
        await this.handleServicesQuotas();
      }
    } else {
      requests.push(this.getBasicPaymentLink(this.addedManagersCount));
    }

    try {
      await Promise.all(requests);
      this.setBasicTariffContainer();
    } catch (error) {
      console.error(error);
    }

    this.setIsUpdatingBasicSettings(false);
  };

  init = async (t: TTranslation) => {
    if (this.isInitPaymentPage) {
      await this.basicSettings();
      return;
    }

    await this.fetchCurrentUser();

    const requests: Promise<unknown>[] = [];

    requests.push(this.getSettingsPayment());

    if (this.isGracePeriod || this.isNotPaidPeriod) {
      requests.push(this.getBasicPaymentLink(this.addedManagersCount));
    }

    if (this.isAlreadyPaid && this.isStripePortalAvailable) {
      requests.push(this.setPaymentAccount());

      if (this.isPayer && this.walletCustomerStatusNotActive) {
        requests.push(this.fetchCardLinked());
      }
    } else {
      requests.push(this.getBasicPaymentLink(this.addedManagersCount));
    }

    if (this.isShowStorageTariffDeactivated() && this.isPayer) {
      this.setIsShowTariffDeactivatedModal(true);
      requests.push(this.handleServicesQuotas());
    }

    try {
      await Promise.all(requests);
      this.setRangeStepByQuota();
      this.setBasicTariffContainer();
    } catch (error) {
      toastr.error(t("Common:UnexpectedError"));
      console.error(error);
      return;
    }

    this.setIsInitPaymentPage(true);
  };

  paymentMethodInit = async (t: TTranslation) => {
    const isRefresh = window.location.href.includes("complete=true");

    try {
      const requests: Promise<unknown>[] = [];

      await this.initWalletPayerAndBalance(isRefresh);

      if (this.isAlreadyPaid) {
        if (this.isStripePortalAvailable) {
          requests.push(this.setPaymentAccount());

          if (this.isPayer && this.walletCustomerStatusNotActive) {
            requests.push(this.fetchCardLinked());
          }
        }
      } else {
        requests.push(this.fetchCardLinked());
      }

      if (this.isShowStorageTariffDeactivated() && this.isPayer) {
        this.setIsShowTariffDeactivatedModal(true);
        requests.push(this.handleServicesQuotas());
      }

      await Promise.all(requests);

      this.setPaymentMethodInit(true);
    } catch (error) {
      toastr.error(t("Common:UnexpectedError"));
      console.error(error);
    }
  };

  walletInit = async (t: TTranslation) => {
    const isRefresh = window.location.href.includes("complete=true");

    if (!isRefresh) {
      if (this.isVisibleWalletSettings) this.setVisibleWalletSetting(false);
    }

    const requests: Promise<unknown>[] = [];
    try {
      await Promise.all([this.initWalletPayerAndBalance(isRefresh)]);
      this.previousBalance = this.balance;

      if (this.isAlreadyPaid) {
        if (this.isStripePortalAvailable) {
          requests.push(this.setPaymentAccount());

          if (this.isPayer && this.walletCustomerStatusNotActive) {
            requests.push(this.fetchCardLinked());
          }
        }

        requests.push(this.fetchAutoPayments(), this.fetchTransactionHistory());
      } else {
        requests.push(this.fetchCardLinked());
      }

      if (this.isShowStorageTariffDeactivated() && this.isPayer) {
        this.setIsShowTariffDeactivatedModal(true);
        requests.push(this.handleServicesQuotas());
      }

      if (this.tariffStatusStore)
        requests.push(this.tariffStatusStore.fetchPortalTariff());

      await Promise.all(requests);

      this.setIsInitWalletPage(true);

      const url = new URL(window.location.href);
      const params = url.searchParams;

      const priceParam = params.get("price");

      if (priceParam) {
        const reccomendedAmount = this.walletBalance - Number(priceParam);
        if (reccomendedAmount < 0)
          this.setReccomendedAmount(
            Math.ceil(Math.abs(reccomendedAmount)).toString(),
          );
      } else {
        this.setReccomendedAmount("");
      }

      if (
        window.location.href.includes("complete=true") ||
        window.location.href.includes("open=true")
      ) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
        this.setVisibleWalletSetting(true);
      }
    } catch (error) {
      toastr.error(t("Common:UnexpectedError"));
      console.error(error);
    }
  };

  getSettingsPayment = async () => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getPortalPrices(abortController.signal);

      if (!res?.data) return;

      const newSettings = res.data as unknown as {
        buyUrl: string;
        salesEmail: string;
        currentLicense: { date: string; trial: boolean } | null;
        standalone: boolean;
        max: number;
      };

      const {
        buyUrl,
        salesEmail,
        currentLicense,
        standalone: standaloneMode,
        max,
      } = newSettings;

      this.buyUrl = buyUrl;
      this.salesEmail = salesEmail;
      this.standaloneMode = standaloneMode;
      this.maxAvailableManagersCount = max;

      if (currentLicense) {
        if (currentLicense.date)
          this.currentLicense.expiresDate = new Date(currentLicense.date);

        if (currentLicense.trial)
          this.currentLicense.trialMode = currentLicense.trial;
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "CanceledError") return;
      console.error(e);
    }
  };

  getTotalCostByFormula = (value: number) => {
    const costValuePerManager = this.planCost.value;
    if (costValuePerManager) return value * +costValuePerManager;
  };

  resetTariffContainerToBasic = () => {
    this.setBasicTariffContainer();
  };

  setBasicTariffContainer = () => {
    const currentTotalPrice = this.currentPlanCost.value;

    if (!this.isFreeTariff) {
      const countOnRequest =
        this.maxCountManagersByQuota > this.maxAvailableManagersCount;

      this.managersCount = countOnRequest
        ? this.maxAvailableManagersCount + 1
        : this.maxCountManagersByQuota;

      this.totalPrice = +currentTotalPrice;

      return;
    }

    this.managersCount = this.addedManagersCount;
    const totalPrice = this.getTotalCostByFormula(this.addedManagersCount);

    if (totalPrice) this.totalPrice = totalPrice;
  };

  setTotalPrice = (value: number) => {
    const price = this.getTotalCostByFormula(value);
    if (price !== this.totalPrice && price) this.totalPrice = price;
  };

  setManagersCount = (managers: number) => {
    if (managers > this.maxAvailableManagersCount)
      this.managersCount = this.maxAvailableManagersCount + 1;
    else this.managersCount = managers;
  };

  setRangeStepByQuota = () => {
    const stepManagers = this.stepAddingQuotaManagers;
    const stepSize = this.stepAddingQuotaTotalSize;

    if (stepManagers && typeof stepManagers === "number")
      this.stepByQuotaForManager = stepManagers;
    this.minAvailableManagersValue = this.stepByQuotaForManager;

    if (stepSize && typeof stepSize === "number")
      this.stepByQuotaForTotalSize = stepSize;
    this.minAvailableTotalSizeValue = this.stepByQuotaForManager;
  };

  fetchCurrentUser = async () => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.profilesApi.getSelfProfile({
        signal: abortController.signal,
      });

      if (!res?.data?.response) return;

      const user = res.data.response as unknown as {
        id: string;
        email: string;
        isOwner: boolean;
      };

      this._currentUserEmail = user.email ?? "";
      this.userId = user.id ?? "";
      this.isOwner = user.isOwner ?? false;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  sendPaymentRequest = async (
    email: string,
    userName: string,
    message: string,
    t: TTranslation,
  ) => {
    try {
      await this.paymentApi.sendPaymentRequest({
        email,
        userName,
        message,
      });
      toastr.success(t("SuccessfullySentMessage"));
    } catch (e) {
      toastr.error(e as TData);
    }
  };
}

export default PaymentStore;

