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

import { makeAutoObservable, observable } from "mobx";
import type { PaymentApi } from "@onlyoffice/docspace-api-sdk";
import { toastr } from "../../components/toast";
import type { TBalance } from "../types";
import type { TTranslation } from "../../utils/common";
import { formatCurrencyValue } from "@docspace/shared/utils/common";
import {
  AI_TOOLS,
  BACKUP_SERVICE,
  STORAGE_ENUM,
} from "@docspace/shared/constants";
import type { TAiToolsPrices } from "../types";
import type PaymentStore from "./PaymentStore";

class ServicesStore {
  private paymentApi: PaymentApi;

  private abortControllers: AbortController[] = [];

  paymentStore: PaymentStore;

  isInitServicesPage = false;

  isInitServicesData = false;

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

  constructor(paymentApi: PaymentApi, paymentStore: PaymentStore) {
    this.paymentApi = paymentApi;
    this.paymentStore = paymentStore;

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

  get aiServiceBalance() {
    if (this.aiToolsBalance && this.aiToolsBalance.subAccounts.length > 0)
      return this.aiToolsBalance.subAccounts[0].amount;

    return 0.0;
  }

  get isAiServiceLowBalance() {
    if (!this.wasFirstAiServiceTopUp) return false;

    return this.aiServiceBalance < 1;
  }

  get aiServiceCodeCurrency() {
    if (this.aiToolsBalance && this.aiToolsBalance.subAccounts.length > 0)
      return this.aiToolsBalance.subAccounts[0].currency;

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

    return this.aiToolsBalance.subAccounts.length !== 0;
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
    return formatCurrencyValue(this.language, amount, this.aiModelsCurrency, 0);
  };

  formatAiServiceCurrency = (
    item: number | null = null,
    fractionDigits: number = 3,
    currency: string = this.aiServiceCodeCurrency,
  ) => {
    const amount = item ?? this.aiServiceBalance;

    return formatCurrencyValue(this.language, amount, currency, fractionDigits);
  };

  fetchAiPrices = async () => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getPortalPrices(abortController.signal);
      if (!res?.data?.response) return;
      this.aiToolsPrices = res.data.response as unknown as TAiToolsPrices;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  fetchAiModelAvailabilitySettings = async () => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getPaymentQuotas(
        abortController.signal,
      );
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

      // TODO: Map to correct SDK method when available
      // await this.paymentApi.setAiModelRestrictions(restrictedModels, abortController.signal);

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

  fetchAiServiceBalance = async (isRefresh?: boolean) => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getWalletService(
        AI_TOOLS,
        abortController.signal,
      );

      if (!res?.data?.response) return;

      this.aiToolsBalance = res.data.response as unknown as TBalance;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };

  fetchBackupsCount = async () => {
    // This was using backup API which isn't in PaymentApi
    // Will be handled by the host app or a separate API call
    console.warn("fetchBackupsCount not yet available in ui-kit PaymentApi");
  };

  initServiceData = async (
    t: TTranslation,
    serviceName: string,
    serviceEnum?: string,
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
        fetchTransactionHistory(
          null,
          null,
          true,
          true,
          "",
          resolvedServiceName,
        ),
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
            await fetchCardLinked();
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
      console.error(error);
      toastr.error(t("Common:UnexpectedError"));
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
        this.fetchAiServiceBalance(),
        this.fetchAiPrices(),
      ];

      const [quotas] = await Promise.all(requests);

      if (!quotas) throw new Error();

      if (this.paymentStore.isAlreadyPaid) {
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
      toastr.error(t("Common:UnexpectedError"));
      console.error(e);
    }
  };
}

export default ServicesStore;

