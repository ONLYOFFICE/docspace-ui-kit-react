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

import { makeAutoObservable, runInAction } from "mobx";
import type {
  PaymentApi,
  PaymentUrlRequestDto,
  ProfilesApi,
  PortalQuotaApi,
  CommonSettingsApi,
  TenantQuotaFeatureDto,
  QuotaDto,
  TenantWalletSettings,
  TenantWalletService,
  OperationDto,
} from "@onlyoffice/docspace-api-sdk";

/** SDK types date as ApiDateTime but API returns an ISO string. */
export type WalletOperationDto = Omit<OperationDto, "date"> & {
  date?: string;
  agentId?: string | null;
  agentTitle?: string | null;
};

import { toastr } from "../../components/toast";
import type { TData } from "../../components/toast";
import type { TBalance, TServiceUsage } from "../types";
import { formatCurrencyValue } from "../utils/common";
import {
  getCardLinkedOnFreeTariff,
  getCardLinkedOnNonProfit,
  getIsCardLinkedToPortal,
  getIsPayer,
  getWalletBalanceAmount,
  getWalletBalanceCurrency,
  formatPaymentDate,
} from "../utils/paymentSelectors";
import {
  applyServiceQuotaToMap,
  parseServicesQuotasMap,
} from "../utils/parsers";
import { getUsageRange } from "../usage/utils";
import { combineUrl } from "../../utils/combineUrl";
import { getCookie } from "../../utils/cookie";
import { LANGUAGE } from "../../constants";
import { AnalyticsEvents } from "../../enums";
import {
  AI_ENUM,
  BACKUP_SERVICE,
  STORAGE_TARIFF_DEACTIVATED,
  STORAGE_DEACTIVATION_VISITED,
  WEB_SEARCH,
} from "../constants";
import type { TTranslation } from "../../utils/common";
import {
  now,
  subtractFromDate,
  formatDate as formatDateUtil,
  formatDateLocalized,
  getAppTimezone,
  isSameDay,
} from "../../utils/date";
import type { DateTime } from "luxon";
import type {
  TPaymentConfig,
  TPaymentRoutes,
  TServiceFeatureWithPrice,
  TUpcomingPayment,
  TUpcomingPaymentResponse,
  TWalletServiceQuota,
} from "../types";
import type { TApiClient } from "../../providers/api/ApiProvider";
import CurrentTariffStatusStore from "./CurrentTariffStatusStore";
import CurrentQuotasStore from "./CurrentQuotasStore";
import PaymentQuotasStore from "./PaymentQuotasStore";

export const TOTAL_SIZE = "total_size";

export type TTransactionFilterContact = {
  id: string;
  displayName?: string;
};

const getTransactionType = (key: string) => ({
  isCredit: key !== "debit",
  isDebit: key !== "credit",
});

class PaymentStore {
  private paymentApi: PaymentApi;

  private profilesApi: ProfilesApi;

  private commonSettingsApi: CommonSettingsApi;

  #rawApiClient: TApiClient;

  private abortControllers: AbortController[] = [];

  private _currentUserEmail = "";

  readonly tariff: CurrentTariffStatusStore;

  readonly quotas: CurrentQuotasStore;

  readonly paymentQuotas: PaymentQuotasStore;

  language = "en";

  userId = "";

  isOwner = false;

  walletHelpUrl = "";

  logoText = "";

  openOnNewPage = true;

  utcOffset = "";

  routes: TPaymentRoutes = {
    portalPayments: "",
    services: "",
    aiServices: "",
    backup: "",
    diskStorage: "",
  };

  licenseQuota: Record<string, unknown> | null = null;

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

  tariffDueTodayAmount: number | null = null;

  isTariffDueTodayCalculating = false;

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

  serviceUsage: TServiceUsage[] = [];

  balance: TBalance = 0;

  previousBalance: TBalance = 0;

  cardLinked = "";

  transactionHistory: WalletOperationDto[] = [];

  isTransactionHistoryExist = false;

  upcomingPaymentsData: TUpcomingPaymentResponse[] = [];

  autoPayments: TenantWalletSettings | null = null;

  minBalance: string = "";

  upToBalance: string = "";

  isAutomaticPaymentsEnabled: boolean = false;

  isVisibleWalletSettings = false;

  upToBalanceError = false;

  minBalanceError = false;

  servicesQuotasFeatures: Map<
    string,
    TenantQuotaFeatureDto | TServiceFeatureWithPrice
  > = new Map();

  servicesQuotas: QuotaDto | null = null;

  isShowStorageTariffDeactivatedModal = false;

  isStorageDeactivationVisited = false;

  filterSelectedTypeKey = "allTransactions";

  filterStartDate: DateTime = (
    subtractFromDate(now(), 4, "weeks") ?? now()
  ).setLocale(getCookie(LANGUAGE) ?? "en");

  filterEndDate: DateTime = now().setLocale(getCookie(LANGUAGE) ?? "en");

  filterContact: TTransactionFilterContact | null = null;

  isTransactionLoading = false;

  lastTransactionServiceName: string | undefined = undefined;

  defaultFilterStartDate: DateTime = (
    subtractFromDate(now(), 4, "weeks") ?? now()
  ).setLocale(getCookie(LANGUAGE) ?? "en");

  defaultFilterEndDate: DateTime = now().setLocale(getCookie(LANGUAGE) ?? "en");

  private _transactionTimerId: ReturnType<typeof setTimeout> | null = null;

  recommendedAmount = "";

  mobileBreakpoint?: number;

  desktopBreakpoint?: number;

  constructor(
    paymentApi: PaymentApi,
    profilesApi: ProfilesApi,
    portalQuotaApi: PortalQuotaApi,
    commonSettingsApi: CommonSettingsApi,
    rawApiClient: TApiClient,
  ) {
    this.paymentApi = paymentApi;
    this.profilesApi = profilesApi;
    this.commonSettingsApi = commonSettingsApi;
    this.#rawApiClient = rawApiClient;

    this.tariff = new CurrentTariffStatusStore(portalQuotaApi, paymentApi);
    this.quotas = new CurrentQuotasStore(paymentApi);
    this.paymentQuotas = new PaymentQuotasStore(paymentApi);
    this.paymentQuotas.setCurrentQuotasStore(this.quotas);

    makeAutoObservable(this);
  }

  configure = (config: TPaymentConfig) => {
    this.language = config.language;

    if (config.logoText !== undefined) this.logoText = config.logoText;
    if (config.walletHelpUrl !== undefined)
      this.walletHelpUrl = config.walletHelpUrl;
    if (config.routes) this.routes = config.routes;
    if (config.user) {
      this._currentUserEmail = config.user.email ?? "";
      this.userId = config.user.id ?? "";
      this.isOwner = config.user.isOwner ?? false;
    }
    if (config.openOnNewPage !== undefined)
      this.openOnNewPage = config.openOnNewPage;
    if (config.mobileBreakpoint !== undefined)
      this.mobileBreakpoint = config.mobileBreakpoint;
    if (config.desktopBreakpoint !== undefined)
      this.desktopBreakpoint = config.desktopBreakpoint;
  };

  private addAbortController(controller: AbortController) {
    this.abortControllers.push(controller);
  }

  dispose = () => {
    this.tariff.dispose();
    this.quotas.dispose();
    this.paymentQuotas.dispose();
    for (const controller of this.abortControllers) {
      controller.abort();
    }
    this.abortControllers = [];

    if (this._transactionTimerId) {
      clearTimeout(this._transactionTimerId);
      this._transactionTimerId = null;
    }
  };

  get isAlreadyPaid() {
    return !!this.tariff.walletCustomerEmail || !this.quotas.isFreeTariff;
  }

  get isNeedRequest() {
    return this.managersCount > this.maxAvailableManagersCount;
  }

  get isLessCountThanAcceptable() {
    return this.managersCount < this.minAvailableManagersValue;
  }

  get isPayer() {
    return getIsPayer(this._currentUserEmail, this.tariff.walletCustomerEmail);
  }

  get isServiceActionDisabled() {
    if (this.isCardLinkedToPortal) return !this.isPayer;

    return false;
  }

  get isStripePortalAvailable() {
    return this.isOwner || this.isPayer;
  }

  get canUpdateTariff() {
    if (this.quotas.isNonProfit) {
      if (!this.tariff.walletCustomerEmail) return true;
      return this.isPayer;
    }

    if (!this.isAlreadyPaid && !this.cardLinkedOnFreeTariff) return true;

    return this.isPayer;
  }

  get canPayTariff() {
    return this.managersCount >= this.quotas.addedManagersCount;
  }

  get canDowngradeTariff() {
    if (this.quotas.addedManagersCount > this.managersCount) return false;
    if (this.quotas.usedTotalStorageSizeCount > this.allowedStorageSizeByQuota)
      return false;

    return true;
  }

  get isCardLinkedToPortal() {
    return getIsCardLinkedToPortal({
      isNonProfit: this.quotas.isNonProfit,
      isFreeTariff: this.quotas.isFreeTariff,
      walletCustomerEmail: this.tariff.walletCustomerEmail,
    });
  }

  get isAutoPaymentExist() {
    return this.autoPayments?.enabled;
  }

  get isAutoTopUpInProgress() {
    if (!this.isAutoPaymentExist) return false;

    const minBalance = this.autoPayments?.minBalance;
    if (minBalance === undefined || minBalance === null) return false;

    return this.walletBalance < minBalance;
  }

  private get balanceData() {
    if (this.balance && typeof this.balance !== "number") return this.balance;
    return null;
  }

  get walletCodeCurrency(): string {
    return getWalletBalanceCurrency(this.balance);
  }

  get walletBalance(): number {
    return getWalletBalanceAmount(this.balance);
  }

  get isLowWalletBalance() {
    if (!this.isCardLinkedToPortal) return false;

    if (!this.isAiToolsServiceOn) return false;

    return this.walletBalance < 1;
  }

  get wasFirstTopUp() {
    return typeof this.balance !== "number";
  }

  get wasChangeBalance() {
    const balance = this.balanceData;
    return (
      this.previousBalance === 0 &&
      !!balance &&
      (balance.subAccounts?.length ?? 0) > 0
    );
  }

  get cardLinkedOnFreeTariff() {
    return getCardLinkedOnFreeTariff(
      this.quotas.isFreeTariff,
      this.tariff.walletCustomerEmail,
    );
  }

  get cardLinkedOnNonProfit() {
    return getCardLinkedOnNonProfit(
      this.quotas.isNonProfit,
      this.tariff.walletCustomerEmail,
    );
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

  setRecommendedAmount = (amount: string) => {
    this.recommendedAmount = amount;
  };

  updatePreviousBalance = () => {
    this.previousBalance = this.balance;
  };

  fetchUpcomingPayments = async () => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const { data } = await this.#rawApiClient.instance.get(
        "api/2.0/portal/tariff/upcoming",
        { signal: abortController.signal },
      );

      this.upcomingPaymentsData =
        (data?.response as TUpcomingPaymentResponse[]) ?? [];
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  get upcomingPayments(): TUpcomingPayment[] {
    return this.upcomingPaymentsData.map((item) => ({
      id: String(item.id),
      renewalDate: formatDateLocalized(item.dueDate, "DATE_FULL", {
        locale: this.language,
        timezone: getAppTimezone(),
      }),
      title: item.title,
      quantity: item.quantity,
      unitOfMeasure: item.unitOfMeasure,
      amount: item.amount,
      actionType: item.wallet ? "edit-subscription" : "edit-plan",
    }));
  }

  formatWalletCurrency = (
    item: number | null = null,
    fractionDigits: number = 3,
    currency?: string,
  ) => {
    const amount = item ?? this.walletBalance;

    return formatCurrencyValue(
      this.language,
      amount,
      currency || this.walletCodeCurrency,
      fractionDigits,
    );
  };

  formatPaymentCurrency = (item: number = 0, fractionDigits: number = 0) => {
    const amount = item || this.walletBalance;
    const { isoCurrencySymbol } = this.paymentQuotas.planCost;

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
      const res = await this.paymentApi.getCustomerBalance(
        {
          refresh: isRefresh || undefined,
        },
        {
          signal: abortController.signal,
        },
      );

      if (!res?.data?.response) return;

      this.balance = res.data.response as unknown as TBalance;
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "CanceledError") return;
      throw e;
    }
  };

  fetchWalletUsage = async ({
    serviceName,
    from,
    to,
    participantName,
  }: {
    serviceName?: string;
    from?: DateTime;
    to?: DateTime;
    participantName?: string;
  } = {}) => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const { data } = await this.#rawApiClient.instance.get(
        "api/2.0/portal/payment/customer/usage",
        {
          signal: abortController.signal,
          params: {
            offset: 0,
            limit: 25,
            ServiceName: serviceName,
            StartDate: from ? this.formatDate(from, "start") : undefined,
            EndDate: to ? this.formatDate(to, "end") : undefined,
            ParticipantName: participantName,
          },
        },
      );

      this.serviceUsage = (data?.response?.collection ?? []) as TServiceUsage[];
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  get isTransactionFilterModified(): boolean {
    return (
      this.filterSelectedTypeKey !== "allTransactions" ||
      !isSameDay(this.filterStartDate, this.defaultFilterStartDate) ||
      !isSameDay(this.filterEndDate, this.defaultFilterEndDate) ||
      this.filterContact !== null
    );
  }

  setFilterSelectedTypeKey = (key: string) => {
    this.filterSelectedTypeKey = key;
  };

  setFilterStartDate = (date: DateTime) => {
    this.filterStartDate = date;
  };

  setFilterEndDate = (date: DateTime) => {
    this.filterEndDate = date;
  };

  setFilterContact = (contact: TTransactionFilterContact | null) => {
    this.filterContact = contact;
  };

  resetTransactionFilter = () => {
    this.filterStartDate = this.defaultFilterStartDate;
    this.filterEndDate = this.defaultFilterEndDate;
    this.filterSelectedTypeKey = "allTransactions";
    this.filterContact = null;
  };

  getEndTransactionDate = (format = "yyyy-MM-dd'T'HH:mm:ss") => {
    return formatDateUtil(now(), format);
  };

  getStartTransactionDate = (format = "yyyy-MM-dd'T'HH:mm:ss") => {
    const date = subtractFromDate(now(), 4, "weeks");
    return date ? formatDateUtil(date, format) : "";
  };

  formatDate = (date: DateTime, timeType?: "start" | "end") =>
    formatPaymentDate(date, timeType);

  fetchTransactionHistory = async (
    serviceName?: string,
    from?: DateTime,
    to?: DateTime,
  ) => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    this._transactionTimerId = setTimeout(() => {
      runInAction(() => {
        if (this._transactionTimerId !== null) {
          this.isTransactionLoading = true;
        }
      });
    }, 500);

    const { isCredit, isDebit } = getTransactionType(
      this.filterSelectedTypeKey,
    );

    try {
      const res = await this.paymentApi.getCustomerOperations(
        {
          offset: 0,
          limit: 25,
          serviceName,
          startDate: this.formatDate(from ?? this.filterStartDate, "start"),
          endDate: this.formatDate(to ?? this.filterEndDate, "end"),
          credit: isCredit,
          debit: isDebit,
          participantName: this.filterContact?.id,
        },
        { signal: abortController.signal },
      );

      if (!res?.data?.response) return;

      const data = res.data.response as unknown as {
        collection: WalletOperationDto[];
      };
      this.transactionHistory = data.collection;
      this.isTransactionHistoryExist = data.collection.length > 0;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      toastr.error(error as Error);
      this.isTransactionLoading = true;
    } finally {
      if (this._transactionTimerId) {
        clearTimeout(this._transactionTimerId);
        this._transactionTimerId = null;
      }

      this.isTransactionLoading = false;
    }
  };

  fetchAutoPayments = async () => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getTenantWalletSettings({
        signal: abortController.signal,
      });

      if (!res) return;

      const data = (res?.data as unknown as { response?: TenantWalletSettings })
        ?.response;

      if (!data) return;
      this.autoPayments = data;
      this.isAutomaticPaymentsEnabled = data.enabled ?? false;

      if (data.enabled) {
        this.setMinBalance((data.minBalance ?? 0).toString());
        this.setUpToBalance((data.upToBalance ?? 0).toString());
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  fetchCardLinked = async (url?: string, successUrl?: string) => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    const backUrl = url || `${window.location.href}`;
    const resolvedSuccessUrl =
      successUrl ||
      combineUrl(
        window.location.origin,
        "/portal-settings/payments/wallet?complete=true&type=wallet",
      );
    try {
      const res = await this.paymentApi.getCheckoutSetupUrl(
        { backUrl },
        {
          signal: abortController.signal,
          // TEMP: SDK schema lacks `successUrl`; passing it via axios `params`
          // until the SDK is regenerated to include it in the request type.
          params: { successUrl: resolvedSuccessUrl },
        },
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
        tenantWalletSettingsWrapper: {
          settings: {
            enabled: this.isAutomaticPaymentsEnabled,
            minBalance: +this.minBalance,
            upToBalance: +this.upToBalance,
            currency: this.walletCodeCurrency || "",
          },
        },
      });

      const data = res?.data as unknown as { response?: TenantWalletSettings };

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

    const res = await this.paymentApi.getWalletServices({
      signal: abortController.signal,
    });

    if (!res?.data?.response) return;

    const services = res.data.response as unknown as TWalletServiceQuota[];

    const quotas = services.map((service) => {
      const feature = service.features?.[0];
      return {
        ...feature,
        price: service.price,
        serviceName: service.serviceName,
      };
    });

    this.servicesQuotasFeatures = new Map(
      quotas.map((feature) => [feature.id ?? "", feature]),
    ) as Map<string, TenantQuotaFeatureDto | TServiceFeatureWithPrice>;

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
    if (!this.tariff.previousStoragePlanSize) return false;

    return localStorage.getItem(STORAGE_TARIFF_DEACTIVATED) !== "true";
  };

  setPaymentAccount = async () => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getPaymentAccount(undefined, {
        signal: abortController.signal,
      });

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
      this.tariff.fetchCustomerInfo(isRefresh),
      this.fetchBalance(isRefresh),
    ]);
  };

  setServiceQuota = async (serviceName = BACKUP_SERVICE) => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    const res = await this.paymentApi.getWalletService(
      {
        service: serviceName as unknown as TenantWalletService,
      },
      { signal: abortController.signal },
    );

    if (!res?.data?.response) return;

    const service = res.data.response as unknown as TWalletServiceQuota;

    applyServiceQuotaToMap(service, this.servicesQuotasFeatures);

    return service.serviceName;
  };

  getBasicPaymentLink = async (managersCount: number) => {
    const backUrl = combineUrl(
      window.location.origin,
      "/portal-settings/payments/portal-payments?cancel=true&type=tariff",
    );
    const successUrl = combineUrl(
      window.location.origin,
      "/portal-settings/payments/portal-payments?complete=true&type=tariff",
    );

    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getPaymentUrl(
        {
          paymentUrlRequestDto: {
            quantity: { admin: managersCount },
            backUrl,
            successUrl,
          } as PaymentUrlRequestDto & { successUrl: string },
        },
        { signal: abortController.signal },
      );

      if (!res?.data?.response) return;
      this.setPaymentLink(res.data.response as unknown as string);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "CanceledError") return;
      console.error(err);
    }
  };

  getPaymentLink = async (token?: AbortSignal) => {
    const backUrl = combineUrl(
      window.location.origin,
      "/portal-settings/payments/portal-payments?cancel=true&type=tariff",
    );
    const successUrl = combineUrl(
      window.location.origin,
      "/portal-settings/payments/portal-payments?complete=true&type=tariff",
    );

    try {
      const res = await this.paymentApi.getPaymentUrl(
        {
          paymentUrlRequestDto: {
            quantity: { admin: this.managersCount },
            backUrl,
            successUrl,
          } as PaymentUrlRequestDto & { successUrl: string },
        },
        token ? { signal: token } : undefined,
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

    if (this.tariff.isGracePeriod || this.tariff.isNotPaidPeriod) {
      requests.push(this.getBasicPaymentLink(this.quotas.addedManagersCount));
    }

    if (this.isAlreadyPaid && this.isStripePortalAvailable) {
      requests.push(this.setPaymentAccount());

      if (this.isPayer && this.tariff.walletCustomerStatusNotActive) {
        requests.push(this.fetchCardLinked());
      }

      if (this.isShowStorageTariffDeactivated() && this.isPayer) {
        this.setIsShowTariffDeactivatedModal(true);
        await this.handleServicesQuotas();
      }
    } else {
      requests.push(this.getBasicPaymentLink(this.quotas.addedManagersCount));
    }

    requests.push(this.tariff.fetchPortalTariff(), this.fetchBalance());

    try {
      await Promise.all(requests);
      this.setBasicTariffContainer();
    } catch (error) {
      console.error(error);
    }

    this.setIsUpdatingBasicSettings(false);
  };

  init = async (t: TTranslation) => {
    const url = window.location.href;
    const isRefresh = url.includes("complete=true");

    if (isRefresh && url.includes("type=tariff")) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: AnalyticsEvents.Purchase,
        ecommerce: {
          items: [{ item_name: "DocSpace Business" }],
        },
      });
    }

    await this.tariff.fetchCustomerInfo(isRefresh);

    if (this.isInitPaymentPage) {
      await this.basicSettings();
      return;
    }

    const requests: Promise<unknown>[] = [];

    await this.tariff.fetchPortalTariff(isRefresh);

    requests.push(
      this.getSettingsPayment(),
      this.paymentQuotas.fetchPaymentQuotas(),
      this.fetchBalance(isRefresh),
    );

    if (this.isAlreadyPaid && this.isStripePortalAvailable) {
      if (this.tariff.isGracePeriod || this.tariff.isNotPaidPeriod) {
        requests.push(this.getBasicPaymentLink(this.quotas.addedManagersCount));
      }

      if (
        !this.tariff.isNotPaidPeriod &&
        this.isPayer &&
        this.tariff.walletCustomerStatusNotActive
      ) {
        requests.push(this.fetchCardLinked());
      }
    } else {
      requests.push(this.getBasicPaymentLink(this.quotas.addedManagersCount));
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

  paymentMethodInit = async (t: TTranslation, integrationUrl?: string) => {
    const url = window.location.href;
    const isRefresh = url.includes("complete=true");

    if (isRefresh && url.includes("type=wallet")) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: AnalyticsEvents.AddPaymentMethod,
      });
    }

    try {
      const requests: Promise<unknown>[] = [];

      await this.initWalletPayerAndBalance(isRefresh);

      if (this.isCardLinkedToPortal) {
        if (this.isStripePortalAvailable) {
          requests.push(this.setPaymentAccount());

          if (this.isPayer && this.tariff.walletCustomerStatusNotActive) {
            requests.push(this.fetchCardLinked(integrationUrl));
          }
        }
      } else {
        requests.push(this.fetchCardLinked(integrationUrl));
      }

      if (this.isShowStorageTariffDeactivated() && this.isPayer) {
        this.setIsShowTariffDeactivatedModal(true);
        requests.push(this.handleServicesQuotas());
      }

      requests.push(this.tariff.fetchPortalTariff());

      await Promise.all(requests);

      this.setPaymentMethodInit(true);

      if (isRefresh) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    } catch (error) {
      if (error instanceof Error && error.name === "CanceledError") return;
      toastr.error(t("Common:UnexpectedError"));
      console.error(error);
    }
  };

  walletInit = async (
    t: TTranslation,
    integrationUrl?: string,
    onInit?: () => Promise<void> | void,
  ) => {
    const isRefresh = window.location.href.includes("complete=true");

    if (!isRefresh) {
      if (this.isVisibleWalletSettings) this.setVisibleWalletSetting(false);
    }

    const requests: Promise<unknown>[] = [];
    try {
      await Promise.all([this.initWalletPayerAndBalance(isRefresh)]);
      this.previousBalance = this.balance;

      if (this.isCardLinkedToPortal) {
        if (this.isStripePortalAvailable) {
          requests.push(this.setPaymentAccount());

          if (this.isPayer && this.tariff.walletCustomerStatusNotActive) {
            requests.push(this.fetchCardLinked(integrationUrl));
          }
        }

        requests.push(this.fetchAutoPayments(), this.fetchTransactionHistory());
      } else {
        requests.push(this.fetchCardLinked(integrationUrl));
      }

      if (this.isShowStorageTariffDeactivated() && this.isPayer) {
        this.setIsShowTariffDeactivatedModal(true);
        requests.push(this.handleServicesQuotas());
      }

      requests.push(
        this.tariff.fetchPortalTariff(),
        this.fetchUpcomingPayments(),
        this.fetchWalletUsage(getUsageRange("thisMonth")),
      );

      if (onInit) requests.push(Promise.resolve(onInit()));

      await Promise.all(requests);

      this.setIsInitWalletPage(true);

      const url = new URL(window.location.href);
      const params = url.searchParams;

      const priceParam = params.get("price");

      if (priceParam) {
        const recommendedAmount = this.walletBalance - Number(priceParam);
        if (recommendedAmount < 0)
          this.setRecommendedAmount(
            Math.ceil(Math.abs(recommendedAmount)).toString(),
          );
      } else {
        this.setRecommendedAmount("");
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
      if (error instanceof Error && error.name === "CanceledError") return;
      toastr.error(t("Common:UnexpectedError"));
      console.error(error);
    }
  };

  getSettingsPayment = async () => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.commonSettingsApi.getPaymentSettings({
        signal: abortController.signal,
      });

      if (!res?.data.response) return;

      const newSettings = res.data.response;

      const {
        buyUrl,
        salesEmail,
        currentLicense,
        standalone: standaloneMode,
        max,
      } = newSettings;

      this.buyUrl = buyUrl ?? "";
      this.salesEmail = salesEmail ?? "";
      this.standaloneMode = standaloneMode;
      this.maxAvailableManagersCount = max;

      if (currentLicense) {
        if (currentLicense.dueDate)
          this.currentLicense.expiresDate = new Date(currentLicense.dueDate);

        if (currentLicense.trial)
          this.currentLicense.trialMode = currentLicense.trial;
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "CanceledError") return;
      console.error(e);
    }
  };

  getTotalCostByFormula = (value: number) => {
    const costValuePerManager = this.paymentQuotas.planCost.value;
    if (costValuePerManager) return value * +costValuePerManager;
  };

  resetTariffContainerToBasic = () => {
    this.setBasicTariffContainer();
  };

  setBasicTariffContainer = () => {
    const currentTotalPrice = this.quotas.currentPlanCost.value;

    if (!this.quotas.isFreeTariff) {
      const countOnRequest =
        this.quotas.maxCountManagersByQuota > this.maxAvailableManagersCount;

      this.managersCount = countOnRequest
        ? this.maxAvailableManagersCount + 1
        : this.quotas.maxCountManagersByQuota;

      this.totalPrice = currentTotalPrice ? +currentTotalPrice : 0;

      return;
    }

    this.managersCount = this.quotas.addedManagersCount;
    const totalPrice = this.getTotalCostByFormula(
      this.quotas.addedManagersCount,
    );

    if (totalPrice) this.totalPrice = totalPrice;
  };

  setTotalPrice = (value: number) => {
    const price = this.getTotalCostByFormula(value);
    if (price !== this.totalPrice && price) this.totalPrice = price;
  };

  setTariffDueTodayAmount = (value: number | null) => {
    this.tariffDueTodayAmount = value;
  };

  setIsTariffDueTodayCalculating = (value: boolean) => {
    this.isTariffDueTodayCalculating = value;
  };

  setManagersCount = (managers: number) => {
    if (managers > this.maxAvailableManagersCount)
      this.managersCount = this.maxAvailableManagersCount + 1;
    else this.managersCount = managers;
  };

  setRangeStepByQuota = () => {
    const stepManagers = this.paymentQuotas.stepAddingQuotaManagers;
    const stepSize = this.paymentQuotas.stepAddingQuotaTotalSize;

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
        salesRequestsDto: {
          email,
          userName,
          message,
        },
      });
      toastr.success(t("Common:SuccessfullySentMessage"));
    } catch (e) {
      toastr.error(e as TData);
    }
  };
}

export default PaymentStore;

