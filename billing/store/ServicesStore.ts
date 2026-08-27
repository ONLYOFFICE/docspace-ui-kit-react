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

import { makeAutoObservable, observable } from "mobx";
import type { PaymentApi } from "@onlyoffice/docspace-api-sdk";
import { toastr } from "../../components/toast";
import type { TBalance } from "../types";
import type { TTranslation } from "../../utils/common";
import { formatCurrencyValue } from "../utils/common";
import { parseAiPrices } from "../utils/parsers";
import {
  AI_ENUM,
  AI_SEARCH,
  AI_TOOLS,
  BACKUP_SERVICE,
  STORAGE_ENUM,
} from "../constants";
import { isDocsConnectServiceName } from "../utils/docs-connect";
import type {
  TAiToolsPrices,
  TServiceUsageMonthly,
  TUsagePeriodKey,
} from "../types";
import { getUsageRange } from "../usage/utils";
import type { DateTime } from "luxon";
import { now } from "../../utils/date";
import type PaymentStore from "./PaymentStore";
import type { TApiClient } from "../../providers/api/ApiProvider";
import { formatterCurrencyWithoutTranction } from "../wallet/utils";

const USAGE_TRACKED_SERVICES: string[] = [AI_TOOLS, AI_SEARCH, BACKUP_SERVICE];

class ServicesStore {
  private paymentApi: PaymentApi;

  #rawApiClient: TApiClient;

  private abortControllers: AbortController[] = [];

  paymentStore: PaymentStore;

  isInitServicesPage = false;

  isInitServicesData = false;

  /** Service page whose data is loading right now. */
  pendingServiceName: string | null = null;

  /** Service the stored service data belongs to; null before the first load. */
  loadedServiceName: string | null = null;

  isAiPaywallInit = false;

  isVisibleWalletSettings = false;

  partialUpgradeFee: number = 0;

  recommendedAmount: number = 0;

  featureCountData: number = 0;

  confirmActionType: string | null = null;

  aiToolsPrices: TAiToolsPrices | null = null;

  usedBackupsCount: number = 0;

  freeBackupsUsed: number = 0;

  paidBackupsUsed: number = 0;

  get serviceUsage() {
    return this.paymentStore.serviceUsage;
  }

  serviceUsageMonthly: TServiceUsageMonthly[] = [];

  aiModelAvailabilityMap: Map<string, boolean> = new Map();

  aiModelAvailabilityUpdatingSet: Set<string> = new Set();

  constructor(
    paymentApi: PaymentApi,
    paymentStore: PaymentStore,
    rawApiClient: TApiClient,
  ) {
    this.paymentApi = paymentApi;
    this.paymentStore = paymentStore;
    this.#rawApiClient = rawApiClient;

    makeAutoObservable(this, {
      aiModelAvailabilityMap: observable.ref,
      aiModelAvailabilityUpdatingSet: observable.ref,
    });
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

  get language() {
    return this.paymentStore.language ?? "en";
  }

  get minimumInputPrice() {
    const inputValues: Array<number | undefined> = [];

    for (const model of this.aiToolsPrices?.chat ?? []) {
      inputValues.push(model.price?.prompt);
    }

    for (const model of this.aiToolsPrices?.embedding ?? []) {
      inputValues.push(model.price?.prompt);
    }

    for (const ws of this.aiToolsPrices?.webSearch ?? []) {
      inputValues.push(ws.price);
    }

    const values = inputValues.filter((v): v is number => Number.isFinite(v));

    return values.length ? Math.min(...values) : 0;
  }

  get minimumOutputPrice() {
    const values = (this.aiToolsPrices?.chat ?? [])
      .map((m) => m.price?.completion)
      .filter((v): v is number => Number.isFinite(v));

    return values.length ? Math.min(...values) : 0;
  }

  setPartialUpgradeFee = (partialUpgradeFee: number) => {
    this.partialUpgradeFee = partialUpgradeFee;
  };

  setVisibleWalletSetting = (isVisibleWalletSettings: boolean) => {
    this.isVisibleWalletSettings = isVisibleWalletSettings;
  };

  setIsInitServicesPage = (isInitServicesPage: boolean) => {
    this.isInitServicesPage = isInitServicesPage;
  };

  setIsInitServiceData = (isInitServicesData: boolean) => {
    this.isInitServicesData = isInitServicesData;
  };

  isServiceDataPending = (serviceName: string) =>
    this.loadedServiceName !== serviceName;

  setIsAiPaywallInit = (value: boolean) => {
    this.isAiPaywallInit = value;
  };

  setConfirmActionType = (value: string) => {
    this.confirmActionType = value;
  };

  setRecommendedAmount = (amount: number) => {
    this.recommendedAmount = amount;
  };

  setFeatureCountData = (featureCountData: number) => {
    this.featureCountData = featureCountData;
  };

  fetchAiPrices = async () => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const { data } = await this.#rawApiClient.instance.get(
        "api/2.0/portal/payment/ai-prices",
        { signal: abortController.signal },
      );

      const prices = parseAiPrices(data?.response);
      if (!prices) return;

      this.aiToolsPrices = prices;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  fetchAiModelAvailabilitySettings = async () => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getRestrictedAiModels({
        signal: abortController.signal,
      });

      if (!res?.data?.response) return;

      const data = res.data.response as unknown as { models?: string[] };

      const nextMap = new Map<string, boolean>();
      const restrictedModels = new Set<string>();

      if (Array.isArray(data.models)) {
        data.models.forEach((id: string) => {
          if (!id) return;
          restrictedModels.add(String(id));
        });
      }

      restrictedModels.forEach((modelId) => {
        nextMap.set(modelId, false);
      });

      this.aiModelAvailabilityMap = nextMap;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  setAiModelAvailability = async (modelId: string, enabled: boolean) => {
    if (!modelId || this.aiModelAvailabilityUpdatingSet.has(modelId)) return;

    const abortController = new AbortController();
    this.addAbortController(abortController);

    this.aiModelAvailabilityUpdatingSet = new Set([
      ...this.aiModelAvailabilityUpdatingSet,
      modelId,
    ]);

    try {
      const restrictedModels: string[] = Array.from(
        this.aiModelAvailabilityMap.keys(),
      );

      const idx = restrictedModels.indexOf(modelId);

      if (enabled && idx >= 0) {
        restrictedModels.splice(idx, 1);
      }
      if (!enabled && idx < 0) {
        restrictedModels.push(modelId);
      }

      await this.paymentApi.setRestrictedAiModels(
        {
          setRestrictedAiModelsRequestDto: {
            models: new Set(restrictedModels),
          },
        },
        { signal: abortController.signal },
      );

      const nextMap = new Map(this.aiModelAvailabilityMap);
      if (enabled) nextMap.delete(modelId);
      else nextMap.set(modelId, false);
      this.aiModelAvailabilityMap = nextMap;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    } finally {
      const nextSet = new Set(this.aiModelAvailabilityUpdatingSet);
      nextSet.delete(modelId);
      this.aiModelAvailabilityUpdatingSet = nextSet;
    }
  };

  fetchBackupsCount = async (from?: DateTime, to?: DateTime) => {
    const abortController = new AbortController();
    this.abortControllers.push(abortController);

    try {
      const { data } = await this.#rawApiClient.instance.get(
        "api/2.0/backup/getbackupscount",
        {
          signal: abortController.signal,
          params: {
            from: from
              ? this.paymentStore.formatDate(from, "start")
              : undefined,
            to: to ? this.paymentStore.formatDate(to, "end") : undefined,
          },
        },
      );

      if (data?.response == null) return;

      this.usedBackupsCount = data.response as number;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  fetchBackupsCountByPaid = async (from?: DateTime, to?: DateTime) => {
    const abortController = new AbortController();
    this.abortControllers.push(abortController);

    try {
      const { data } = await this.#rawApiClient.instance.get(
        "api/2.0/backup/getbackupscountbypaid",
        {
          signal: abortController.signal,
          params: {
            from: from
              ? this.paymentStore.formatDate(from, "start")
              : undefined,
            to: to ? this.paymentStore.formatDate(to, "end") : undefined,
          },
        },
      );

      const response = data?.response as
        { free?: number; paid?: number } | undefined;

      if (response == null) return;

      this.freeBackupsUsed = response.free ?? 0;
      this.paidBackupsUsed = response.paid ?? 0;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  fetchServiceUsage = (
    params: Parameters<typeof this.paymentStore.fetchWalletUsage>[0] = {},
  ) => this.paymentStore.fetchWalletUsage(params);

  fetchServiceUsageMonthly = async ({
    from,
    to,
  }: {
    from?: DateTime;
    to?: DateTime;
  } = {}) => {
    const abortController = new AbortController();
    this.abortControllers.push(abortController);

    try {
      const { data } = await this.#rawApiClient.instance.get(
        "api/2.0/portal/payment/customer/usage/monthly",
        {
          signal: abortController.signal,
          params: {
            StartDate: from
              ? this.paymentStore.formatDate(from, "start")
              : undefined,
            EndDate: to ? this.paymentStore.formatDate(to, "end") : undefined,
          },
        },
      );

      const response = data?.response;

      this.serviceUsageMonthly = (
        Array.isArray(response) ? response : (response?.collection ?? [])
      ) as TServiceUsageMonthly[];
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  initUsageData = async (period: TUsagePeriodKey) => {
    const range = getUsageRange(period);

    // The usage page overwrites the shared rows with a whole period. Only rows
    // of the current month match what a service page requests for itself, so
    // any other period invalidates them.
    if (period !== "thisMonth") this.loadedServiceName = null;

    await Promise.all([
      this.paymentStore.initWalletPayerAndBalance(false),
      this.fetchServiceUsage(range),
      this.fetchServiceUsageMonthly(range),
    ]);
  };

  get walletMonthToDateSpend(): number {
    return this.serviceUsage.reduce((sum, item) => sum + item.totalAmount, 0);
  }

  get backupUsage() {
    return (
      this.serviceUsage.find((usage) => usage.service === BACKUP_SERVICE) ??
      null
    );
  }

  get aiUsage() {
    return (
      this.serviceUsage.find((usage) => usage.service === AI_TOOLS) ?? null
    );
  }

  get aiSearchUsage() {
    return (
      this.serviceUsage.find((usage) => usage.service === AI_SEARCH) ?? null
    );
  }

  initServiceData = async (
    t: TTranslation,
    serviceName: string,
    serviceEnum?: string,
    integrationUrl?: string,
  ) => {
    const isRefresh = window.location.href.includes("complete=true");

    this.pendingServiceName = serviceName;

    const {
      fetchTransactionHistory,
      initWalletPayerAndBalance,
      setServiceQuota,
      handleServicesQuotas,
      fetchCardLinked,
      resetTransactionHistory,
    } = this.paymentStore;

    resetTransactionHistory();

    const isDocsConnect = isDocsConnectServiceName(serviceName);

    try {
      let resolvedServiceName = serviceName;

      if (serviceEnum === STORAGE_ENUM) {
        resolvedServiceName =
          (await setServiceQuota(serviceEnum)) ?? serviceName;
      }

      if (isDocsConnect) await handleServicesQuotas();

      const serviceQuotaRequest =
        serviceEnum !== STORAGE_ENUM && !isDocsConnect
          ? [setServiceQuota(serviceEnum ?? serviceName)]
          : [];

      // The AI search enable flow checks the AI tools state.
      if (serviceName === AI_SEARCH) {
        serviceQuotaRequest.push(setServiceQuota(AI_ENUM));
      }

      const requests: Promise<unknown>[] = [
        ...serviceQuotaRequest,
        this.paymentStore.tariff.fetchPortalTariff(),
        fetchTransactionHistory(resolvedServiceName),
        initWalletPayerAndBalance(isRefresh),
      ];

      const monthStart = now().startOf("month");
      const monthEnd = now().endOf("month");

      if (USAGE_TRACKED_SERVICES.includes(serviceName)) {
        requests.push(
          this.fetchServiceUsage({
            serviceName,
            from: monthStart,
            to: monthEnd,
          }),
        );
      }

      if (serviceName === BACKUP_SERVICE) {
        requests.push(this.fetchBackupsCountByPaid(monthStart, monthEnd));
      }

      await Promise.all(requests);

      if (this.paymentStore.isAlreadyPaid) {
        if (this.paymentStore.isStripePortalAvailable) {
          await this.paymentStore.setPaymentAccount();

          if (
            this.paymentStore.isPayer &&
            this.paymentStore.tariff.walletCustomerStatusNotActive
          ) {
            await fetchCardLinked(integrationUrl);
          }

          if (
            this.paymentStore.isShowStorageTariffDeactivated() &&
            this.paymentStore.isPayer
          ) {
            this.paymentStore.setIsShowTariffDeactivatedModal(true);
          }
        }

        await this.paymentStore.fetchAutoPayments();
      }

      this.setIsInitServiceData(true);
    } catch (error) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
      toastr.error(t("Common:UnexpectedError"));
    } finally {
      if (this.pendingServiceName === serviceName)
        this.loadedServiceName = serviceName;
    }
  };

  servicesInit = async (t: TTranslation) => {
    const isRefresh = window.location.href.includes("complete=true");

    if (!isRefresh) {
      if (this.isVisibleWalletSettings) this.setVisibleWalletSetting(false);
    }

    const {
      fetchAutoPayments,
      fetchCardLinked,
      setPaymentAccount,
      initWalletPayerAndBalance,
      handleServicesQuotas,
    } = this.paymentStore;

    try {
      const quotas = await handleServicesQuotas();

      const hasAiService = quotas?.some(
        (service) => service.serviceName === AI_ENUM,
      );

      const requests: Promise<unknown>[] = [
        initWalletPayerAndBalance(isRefresh),
        this.paymentStore.tariff.fetchPortalTariff(),
      ];

      if (this.paymentStore.onServicesInit) {
        requests.push(this.paymentStore.onServicesInit());
      }

      if (hasAiService) {
        requests.push(this.fetchAiPrices());
      }

      await Promise.all(requests);

      if (this.paymentStore.isCardLinkedToPortal) {
        if (this.paymentStore.isStripePortalAvailable) {
          await setPaymentAccount();

          if (
            this.paymentStore.isPayer &&
            this.paymentStore.tariff.walletCustomerStatusNotActive
          ) {
            await fetchCardLinked();
          }

          if (
            this.paymentStore.isShowStorageTariffDeactivated() &&
            this.paymentStore.isPayer
          ) {
            this.paymentStore.setIsShowTariffDeactivatedModal(true);
          }
        }
        await fetchAutoPayments();
      } else {
        await fetchCardLinked();
      }

      this.setIsInitServicesPage(true);

      if (!isRefresh) {
        const actionTypeParam = new URL(window.location.href).searchParams.get(
          "actionType",
        );

        if (actionTypeParam) {
          this.setConfirmActionType(actionTypeParam);
          this.setVisibleWalletSetting(true);

          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete("actionType");
          window.history.replaceState(
            {},
            document.title,
            `${cleanUrl.pathname}${cleanUrl.search}`,
          );
        }
      }

      if (isRefresh) {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        const amountParam = params.get("amount");
        const recommendedAmountParam = params.get("recommendedAmount");
        const actionTypeParam = params.get("actionType");

        if (amountParam && recommendedAmountParam) {
          const amount = Number(amountParam);
          const recommendedAmount = Number(recommendedAmountParam);

          this.setRecommendedAmount(Math.ceil(recommendedAmount));
          this.setFeatureCountData(amount);
        }

        if (amountParam && !recommendedAmountParam) {
          const amount = Number(amountParam);
          this.setFeatureCountData(amount);
        }

        if (actionTypeParam) {
          this.setConfirmActionType(actionTypeParam);
          this.setVisibleWalletSetting(true);
        }

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "CanceledError") return;
      toastr.error(t("Common:UnexpectedError"));
      console.error(e);
    }
  };
}

export default ServicesStore;

