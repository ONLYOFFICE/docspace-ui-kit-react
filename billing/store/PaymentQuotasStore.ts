import { makeAutoObservable } from "mobx";
import type {
  PaymentApi,
  TenantQuotaFeatureDto,
  QuotaDto,
} from "@onlyoffice/docspace-api-sdk";
import type { TNumericPaymentFeature, TBooleanPaymentFeature } from "../types";
import { MANAGER, YEAR_KEY } from "../constants";
import { TOTAL_SIZE } from "./CurrentQuotasStore";
import type CurrentQuotasStore from "./CurrentQuotasStore";

/** Quota id of the future tariff used by MigrateToWalletDialog. */
const FUTURE_TARIFF_QUOTA_ID = -14;

class PaymentQuotasStore {
  private paymentApi: PaymentApi;

  private abortControllers: AbortController[] = [];

  currentQuotasStore: CurrentQuotasStore | null = null;

  portalPaymentQuotas: QuotaDto | null = null;

  portalPaymentQuotasFeatures: Map<string, TenantQuotaFeatureDto> = new Map();

  /** Future tariff quota (id -14), kept for MigrateToWalletDialog. */
  futurePaymentQuotas: QuotaDto | null = null;

  futurePaymentQuotasFeatures: Map<string, TenantQuotaFeatureDto> = new Map();

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

  setCurrentQuotasStore = (store: CurrentQuotasStore) => {
    this.currentQuotasStore = store;
  };

  setIsLoaded = (isLoaded: boolean) => {
    this.isLoaded = isLoaded;
  };

  get usedTotalStorageSizeTitle() {
    return this.portalPaymentQuotasFeatures.get(TOTAL_SIZE)?.priceTitle;
  }

  get addedManagersCountTitle() {
    return this.portalPaymentQuotasFeatures.get(MANAGER)?.priceTitle;
  }

  get tariffPlanTitle() {
    return this.portalPaymentQuotas?.title ?? "";
  }

  get planCost() {
    const price = this.portalPaymentQuotas?.price;
    return {
      value: price?.value ?? 0,
      isoCurrencySymbol: price?.isoCurrencySymbol ?? "USD",
    };
  }

  get futurePlanCost() {
    const price = this.futurePaymentQuotas?.price;
    return {
      value: price?.value ?? 0,
      isoCurrencySymbol: price?.isoCurrencySymbol ?? "USD",
    };
  }

  get stepAddingQuotaManagers() {
    const result = this.portalPaymentQuotasFeatures.get(MANAGER) as
      | TNumericPaymentFeature
      | undefined;
    return result?.value ?? null;
  }

  get stepAddingQuotaTotalSize() {
    const result = this.portalPaymentQuotasFeatures.get(TOTAL_SIZE) as
      | TNumericPaymentFeature
      | undefined;
    return result?.value ?? null;
  }

  fetchPaymentQuotas = async () => {
    const abortController = new AbortController();
    this.addAbortController(abortController);

    try {
      const res = await this.paymentApi.getPaymentQuotas(
        {},
        {
          signal: abortController.signal,
          // TODO: move `additional` into the typed request once the SDK
          // regenerates PaymentApiGetPaymentQuotasRequest with this field.
          // Passed via axios params so it is appended to the query string.
          params: { additional: false },
        },
      );

      if (!res?.data?.response) return;

      const quotas = res.data.response as unknown as QuotaDto[];

      type QuotaWithMap = QuotaDto & {
        featuresMap: Map<string, TenantQuotaFeatureDto>;
      };

      const quotasById = new Map<number, QuotaWithMap>(
        quotas.map((q) => [
          q.id,
          {
            ...q,
            featuresMap: new Map(
              (q.features ?? []).map((f) => [f.id ?? "", f]),
            ),
          },
        ]),
      );

      const quotasByYear = new Map<boolean, QuotaWithMap>(
        Array.from(quotasById.values()).map((q) => {
          const yearFeature = q.featuresMap.get(YEAR_KEY) as
            | TBooleanPaymentFeature
            | undefined;
          return [yearFeature?.value ?? false, q];
        }),
      );

      const isFreeTariff = this.currentQuotasStore?.isFreeTariff ?? true;
      const currentQuotaId = this.currentQuotasStore?.currentQuotaId ?? null;


      if (currentQuotaId !== FUTURE_TARIFF_QUOTA_ID) {
        const futureQuota = quotasById.get(FUTURE_TARIFF_QUOTA_ID);
        this.futurePaymentQuotas = futureQuota ?? null;
        this.futurePaymentQuotasFeatures = futureQuota?.featuresMap ?? new Map();
      } else {
        this.futurePaymentQuotas = null;
        this.futurePaymentQuotasFeatures = new Map();
      }

      let matchedQuota: QuotaWithMap | undefined;

      if (isFreeTariff) {
        matchedQuota = quotasByYear.get(false);
      } else if (currentQuotaId !== null) {
        matchedQuota = quotasById.get(currentQuotaId);
      }
      if (!matchedQuota) {
        matchedQuota = quotasByYear.get(true);
      }

      if (!matchedQuota) return;

      this.portalPaymentQuotas = matchedQuota;
      this.portalPaymentQuotasFeatures = matchedQuota.featuresMap;

      this.setIsLoaded(true);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "CanceledError") return;
      console.error(error);
    }
  };
}

export default PaymentQuotasStore;

