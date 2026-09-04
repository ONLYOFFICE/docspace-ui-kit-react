import { useCommonTranslation } from "../../../utils/i18n";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import {
  calculateDifference,
  isDowngrade,
  isExceedingLimit,
  isSamePlan,
  isUpgrade,
} from "./resourceUtils";

export const useServicesActions = () => {
  const t = useCommonTranslation();

  const paymentStore = usePaymentStore();
  const { walletBalance } = paymentStore;
  const {
    currentStoragePlanSize,
    hasScheduledStorageChange,
    nextStoragePlanSize,
    hasStorageSubscription,
  } = paymentStore.tariff;

  const maxStorageLimit = 9999;

  const isWalletBalanceInsufficient = (totalPrice: number): boolean => {
    return walletBalance < totalPrice;
  };

  const isExceedingPlanLimit = (quantity: number, type = "storage") => {
    const limit = type === "storage" ? maxStorageLimit : 0;
    return isExceedingLimit(quantity, limit);
  };

  const isPlanUpgrade = (quantity: number, type = "storage") => {
    const plan = type === "storage" ? currentStoragePlanSize : 0;

    if (!currentStoragePlanSize) return true;

    return isUpgrade(+quantity, plan!);
  };

  const isPlanDowngrade = (quantity: number, type = "storage") => {
    if (!quantity) return false;

    const plan = type === "storage" ? currentStoragePlanSize : 0;

    return isDowngrade(+quantity, plan!);
  };

  const isCurrentPlan = (quantity: number, type = "storage") => {
    const plan = type === "storage" ? currentStoragePlanSize : 0;
    const hasSub = type === "storage" ? hasStorageSubscription : false;

    return isSamePlan(+quantity, hasSub, plan!);
  };

  const calculateDifferenceBetweenPlan = (
    quantity: number,
    type = "storage",
  ) => {
    const plan = type === "storage" ? currentStoragePlanSize : 0;
    return calculateDifference(quantity, plan!);
  };

  const isStorageCancellation = () => {
    return hasScheduledStorageChange && nextStoragePlanSize === 0;
  };

  return {
    t,
    maxStorageLimit,
    isWalletBalanceInsufficient,
    isPlanUpgrade,
    isStorageCancellation,
    isExceedingPlanLimit,
    isCurrentPlan,
    isPlanDowngrade,
    calculateDifferenceBetweenPlan,
  };
};
