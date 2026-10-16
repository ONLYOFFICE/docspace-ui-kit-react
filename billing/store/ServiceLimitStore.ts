import { makeAutoObservable, runInAction } from "mobx";
import type { AxiosInstance } from "axios";

import {
  createServiceLimit,
  getCustomerServiceLimit,
  getServiceLimitUsage,
  updateServiceLimit,
} from "../shared/service-limits/common/api";
import type {
  TServiceLimit,
  TServiceLimitPeriod,
  TServiceLimitUsage,
} from "../shared/service-limits/common/types";

class ServiceLimitStore {
  #api: AxiosInstance;

  serviceName: string | null = null;

  portalLimit: TServiceLimit | null = null;

  portalUsage: TServiceLimitUsage | null = null;

  userLimit: TServiceLimit | null = null;

  isLoading = false;

  isInit = false;

  isPortalSaving = false;

  isUserSaving = false;

  constructor(api: AxiosInstance) {
    this.#api = api;

    makeAutoObservable(this);
  }

  fetchAll = async (serviceName: string) => {
    if (this.serviceName !== serviceName) {
      this.serviceName = serviceName;
      this.portalLimit = null;
      this.portalUsage = null;
      this.userLimit = null;
      this.isInit = false;
    }

    this.isLoading = true;

    try {
      await this.fetchPortalLimit();
    } finally {
      runInAction(() => {
        if (this.serviceName === serviceName) {
          this.isLoading = false;
          this.isInit = true;
        }
      });
    }
  };

  fetchPortalLimit = async () => {
    const { serviceName } = this;
    if (!serviceName) return;

    const limit = await getCustomerServiceLimit(this.#api, serviceName);
    const usage = limit
      ? await getServiceLimitUsage(this.#api, limit.id)
      : null;

    runInAction(() => {
      if (this.serviceName !== serviceName) return;
      this.portalLimit = limit;
      this.portalUsage = usage;
    });
  };

  savePortalLimit = async (amount: number, period: TServiceLimitPeriod) => {
    this.isPortalSaving = true;

    try {
      await this.#applyPortalLimit(amount, period);
      await this.fetchPortalLimit();
    } finally {
      runInAction(() => {
        this.isPortalSaving = false;
      });
    }
  };

  #applyPortalLimit = async (amount: number, period: TServiceLimitPeriod) => {
    const { serviceName } = this;
    if (!serviceName) return;

    const current = this.portalLimit;

    if (current) {
      await updateServiceLimit(this.#api, {
        id: current.id,
        amountValue: amount,
        period,
        enabled: true,
      });

      return;
    }

    await createServiceLimit(this.#api, {
      serviceName,
      amountValue: amount,
      period,
    });
  };

  saveUserLimit = async (amount: number, period: TServiceLimitPeriod) => {
    this.userLimit = {
      id: this.userLimit?.id ?? 0,
      serviceName: this.serviceName ?? "",
      participant: null,
      amountValue: amount,
      currency: this.portalLimit?.currency ?? null,
      quantityValue: null,
      serviceUnit: null,
      period,
      enabled: true,
      created: this.userLimit?.created ?? "",
      modified: "",
    };
  };

  setUserLimitEnabled = async (enabled: boolean) => {
    if (!this.userLimit) return;

    this.userLimit = { ...this.userLimit, enabled };
  };

  setPortalLimitEnabled = async (enabled: boolean) => {
    if (!this.portalLimit) return;
    this.isPortalSaving = true;

    try {
      await updateServiceLimit(this.#api, {
        id: this.portalLimit.id,
        enabled,
      });
      await this.fetchPortalLimit();
    } finally {
      runInAction(() => {
        this.isPortalSaving = false;
      });
    }
  };
}

export default ServiceLimitStore;
