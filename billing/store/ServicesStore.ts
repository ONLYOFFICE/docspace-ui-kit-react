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
import { AI_TOOLS, BACKUP_SERVICE, STORAGE_ENUM } from "../constants";
import type { TAiToolsPrices } from "../types";
import type PaymentStore from "./PaymentStore";
import type { TApiClient } from "../../providers/api/ApiProvider";
import { formatterCurrencyWithoutTranction } from "../wallet/utils";

class ServicesStore {
  private paymentApi: PaymentApi;

  #rawApiClient: TApiClient;

  private abortControllers: AbortController[] = [];

  paymentStore: PaymentStore;

  isInitServicesPage = false;

  isInitServicesData = false;

  isAiPaywallInit = false;

  isVisibleWalletSettings = false;

  partialUpgradeFee: number = 0;

  reccomendedAmount: number = 0;

  featureCountData: number = 0;

  confirmActionType: string | null = null;

  aiToolsBalance: TBalance = null;

  aiToolsPrices: TAiToolsPrices | null = null;

  usedBackupsCount: number = 0;

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

  private get aiBalanceData() {
    if (this.aiToolsBalance && typeof this.aiToolsBalance !== "number")
      return this.aiToolsBalance;
    return null;
  }

  get aiServiceBalance(): number {
    const balance = this.aiBalanceData;
    if (balance?.subAccounts && balance.subAccounts.length > 0)
      return balance.subAccounts[0].amount ?? 0;

    return 0.0;
  }

  get isAiServiceLowBalance() {
    if (!this.wasFirstAiServiceTopUp) return false;

    return this.aiServiceBalance < 1;
  }

  get aiServiceCodeCurrency(): string {
    const balance = this.aiBalanceData;
    if (balance?.subAccounts && balance.subAccounts.length > 0)
      return balance.subAccounts[0].currency ?? "USD";

    return "USD";
  }

  get aiServiceLastCreditAmount() {
    if (!this.aiToolsBalance || typeof this.aiToolsBalance === "number")
      return null;

    return this.aiToolsBalance.lastCredit?.amount ?? null;
  }

  get aiServiceLastCreditCurrency() {
    if (!this.aiToolsBalance || typeof this.aiToolsBalance === "number")
      return "";

    return this.aiToolsBalance.lastCredit?.currency ?? "USD";
  }

  get aiServiceLastCreditDate() {
    if (!this.aiToolsBalance || typeof this.aiToolsBalance === "number")
      return null;

    return this.aiToolsBalance.lastCredit?.date ?? null;
  }

  get aiModelsCurrency() {
    const currency = this.aiToolsPrices?.currency;
    if (!currency) return "USD";

    return currency.code ?? "USD";
  }

  get aiModelsCurrencySymbol() {
    const currency = this.aiToolsPrices?.currency;
    if (!currency) return "$";

    return currency.symbol ?? "$";
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

  get wasFirstAiServiceTopUp() {
    if (!this.aiToolsBalance) return false;

    return (this.aiBalanceData?.subAccounts?.length ?? 0) !== 0;
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

  setIsAiPaywallInit = (value: boolean) => {
    this.isAiPaywallInit = value;
  };

  setConfirmActionType = (value: string) => {
    this.confirmActionType = value;
  };

  setReccomendedAmount = (amount: number) => {
    this.reccomendedAmount = amount;
  };

  setFeatureCountData = (featureCountData: number) => {
    this.featureCountData = featureCountData;
  };

  formatAiModelsCurrency = (amount: number) => {
    return formatterCurrencyWithoutTranction(
      this.language,
      amount,
      this.aiModelsCurrency,
      0,
    );
  };

  formatAiServiceCurrency = (
    item: number | null = null,
    fractionDigits: number = 3,
    currency: string = this.aiServiceCodeCurrency,
  ) => {
    const amount = item ?? this.aiServiceBalance;

    return formatCurrencyValue(this.language, amount, currency, fractionDigits);
  };

  // TODO: Replace with SDK method once it is available in the API SDK
  fetchAiPrices = async () => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const { data } = await this.#rawApiClient.instance.get(
        "api/2.0/portal/payment/ai-prices",
        { signal: abortController.signal },
      );

      if (!data?.response) return;
      this.aiToolsPrices = data.response as unknown as TAiToolsPrices;
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

  // TODO: Replace with SDK method once it is available in the API SDK
  fetchAiServiceBalance = async (refresh?: boolean) => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const { data } = await this.#rawApiClient.instance.get(
        `api/2.0/portal/payment/customer/aibalance`,
        {
          params: refresh ? { refresh: true } : {},
          signal: abortController.signal,
        },
      );

      if (!data?.response) return;

      this.aiToolsBalance = data.response as unknown as TBalance;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  fetchBackupsCount = async () => {
    const abortController = new AbortController();
    this.abortControllers.push(abortController);

    try {
      const { data } = await this.#rawApiClient.instance.get(
        "api/2.0/backup/getbackupscount",
        { signal: abortController.signal },
      );

      if (data?.response == null) return;

      this.usedBackupsCount = data.response as number;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  initServiceData = async (
    t: TTranslation,
    serviceName: string,
    serviceEnum?: string,
    integrationUrl?: string,
  ) => {
    const isRefresh = window.location.href.includes("complete=true");

    const {
      fetchTransactionHistory,
      initWalletPayerAndBalance,
      setServiceQuota,
      fetchCardLinked,
    } = this.paymentStore;

    try {
      let resolvedServiceName = serviceName;

      if (serviceEnum === STORAGE_ENUM) {
        resolvedServiceName =
          (await setServiceQuota(serviceEnum)) ?? serviceName;
      }

      const serviceQuotaRequest =
        serviceEnum !== STORAGE_ENUM
          ? [setServiceQuota(serviceEnum ?? serviceName)]
          : [];

      const requests: Promise<unknown>[] = [
        ...serviceQuotaRequest,
        this.paymentStore.tariff.fetchPortalTariff(),
        fetchTransactionHistory(resolvedServiceName),
        initWalletPayerAndBalance(isRefresh),
      ];

      if (serviceName === AI_TOOLS) {
        requests.push(
          this.fetchAiPrices(),
          this.fetchAiServiceBalance(),
          this.fetchAiModelAvailabilitySettings(),
        );
      }

      if (serviceName === BACKUP_SERVICE) {
        requests.push(this.fetchBackupsCount());
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
      toastr.error(t("UnexpectedError"));
    }
  };

  aiPaywallInit = async (t: TTranslation) => {
    const { initWalletPayerAndBalance } = this.paymentStore;

    try {
      await Promise.all([
        initWalletPayerAndBalance(false),
        this.fetchAiPrices(),
        this.fetchAiServiceBalance(),
      ]);

      this.setIsAiPaywallInit(true);

      return this.wasFirstAiServiceTopUp;
    } catch (error) {
      if (error instanceof Error && error.name === "CanceledError") return false;
      console.error(error);
      toastr.error(t("UnexpectedError"));
      return false;
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
      const requests: Promise<unknown>[] = [
        handleServicesQuotas(),
        initWalletPayerAndBalance(isRefresh),
        this.paymentStore.tariff.fetchPortalTariff(),
        this.fetchAiServiceBalance(),
        this.fetchAiPrices(),
      ];

      const [quotas] = await Promise.all(requests);

      if (!quotas) throw new Error();

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

      if (isRefresh) {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        const amountParam = params.get("amount");
        const recommendedAmountParam = params.get("recommendedAmount");
        const actionTypeParam = params.get("actionType");

        if (amountParam && recommendedAmountParam) {
          const amount = Number(amountParam);
          const recommendedAmount = Number(recommendedAmountParam);

          this.setReccomendedAmount(Math.ceil(recommendedAmount));
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
      toastr.error(t("UnexpectedError"));
      console.error(e);
    }
  };
}

export default ServicesStore;
