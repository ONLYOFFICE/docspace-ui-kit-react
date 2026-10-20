import { makeAutoObservable, runInAction } from "mobx";
import type { AxiosInstance } from "axios";

import {
  createServiceLimit,
  deleteServiceLimit,
  getGlobalServiceLimit,
  getTotalServiceLimit,
  updateServiceLimit,
} from "../shared/service-limits/common/api";
import type {
  TServiceLimit,
  TServiceLimitPeriod,
  TServiceLimitScope,
} from "../shared/service-limits/common/types";

class ServiceLimitStore {
  #api: AxiosInstance;

  portalLimit: TServiceLimit | null = null;

  userLimit: TServiceLimit | null = null;

  isLoading = false;

  isInit = false;

  isPortalSaving = false;

  isUserSaving = false;

  constructor(api: AxiosInstance) {
    this.#api = api;

    makeAutoObservable(this);
  }

  fetchAll = async () => {
    this.isLoading = true;

    try {
      await Promise.all([this.fetchPortalLimit(), this.fetchUserLimit()]);
    } finally {
      runInAction(() => {
        this.isLoading = false;
        this.isInit = true;
      });
    }
  };

  fetchPortalLimit = async () => {
    const limit = await getTotalServiceLimit(this.#api);

    runInAction(() => {
      this.portalLimit = limit;
    });
  };

  fetchUserLimit = async () => {
    const limit = await getGlobalServiceLimit(this.#api);

    runInAction(() => {
      this.userLimit = limit;
    });
  };

  savePortalLimit = async (amount: number, period: TServiceLimitPeriod) => {
    this.isPortalSaving = true;

    try {
      await this.#applyLimit("Total", this.portalLimit, amount, period);
      await this.fetchPortalLimit();
    } finally {
      runInAction(() => {
        this.isPortalSaving = false;
      });
    }
  };

  saveUserLimit = async (amount: number, period: TServiceLimitPeriod) => {
    this.isUserSaving = true;

    try {
      await this.#applyLimit("Global", this.userLimit, amount, period);
      await this.fetchUserLimit();
    } finally {
      runInAction(() => {
        this.isUserSaving = false;
      });
    }
  };

  setPortalLimitEnabled = async (enabled: boolean) => {
    if (!this.portalLimit) return;
    this.isPortalSaving = true;

    try {
      await updateServiceLimit(this.#api, { id: this.portalLimit.id, enabled });
      await this.fetchPortalLimit();
    } finally {
      runInAction(() => {
        this.isPortalSaving = false;
      });
    }
  };

  setUserLimitEnabled = async (enabled: boolean) => {
    if (!this.userLimit) return;
    this.isUserSaving = true;

    try {
      await updateServiceLimit(this.#api, { id: this.userLimit.id, enabled });
      await this.fetchUserLimit();
    } finally {
      runInAction(() => {
        this.isUserSaving = false;
      });
    }
  };

  #applyLimit = async (
    scope: TServiceLimitScope,
    current: TServiceLimit | null,
    amount: number,
    period: TServiceLimitPeriod,
  ) => {
    if (current && current.period === period) {
      await updateServiceLimit(this.#api, {
        id: current.id,
        amountValue: amount,
        enabled: true,
      });

      return;
    }

    if (current) await deleteServiceLimit(this.#api, current.id);

    await createServiceLimit(this.#api, { scope, amountValue: amount, period });
  };
}

export default ServiceLimitStore;
