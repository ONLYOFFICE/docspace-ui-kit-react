import type { TBalance } from "../types";
import type { DateTime } from "luxon";
import { formatDate as formatDateUtil } from "../../utils/date";

/**
 * Pure derivations for payment card / wallet state.
 *
 * Single source of truth shared by every payment store (ui-kit billing store
 * and the client PaymentStore) so the logic is defined exactly once. The
 * functions take primitives only and have no store/context dependency.
 */

export type TCardStatusInput = {
  isNonProfit?: boolean;
  isFreeTariff?: boolean;
  walletCustomerEmail?: string | null;
  walletCustomerStatusNotActive?: boolean;
};

export const getCardLinkedOnFreeTariff = (
  isFreeTariff?: boolean,
  walletCustomerEmail?: string | null,
): boolean => !!isFreeTariff && !!walletCustomerEmail;

export const getCardLinkedOnNonProfit = (
  isNonProfit?: boolean,
  walletCustomerEmail?: string | null,
): boolean => {
  if (!isNonProfit) return false;
  if (!walletCustomerEmail) return false;

  return true;
};

export const getIsCardLinkedToPortal = ({
  isNonProfit,
  isFreeTariff,
  walletCustomerEmail,
}: TCardStatusInput): boolean =>
  getCardLinkedOnNonProfit(isNonProfit, walletCustomerEmail) ||
  getCardLinkedOnFreeTariff(isFreeTariff, walletCustomerEmail) ||
  (!isNonProfit && !isFreeTariff);

export const getIsCardMissingOrInactive = ({
  walletCustomerStatusNotActive,
  ...cardStatus
}: TCardStatusInput): boolean =>
  !getIsCardLinkedToPortal(cardStatus) || !!walletCustomerStatusNotActive;

export const getIsPayer = (
  userEmail?: string | null,
  walletCustomerEmail?: string | null,
): boolean => {
  if (!userEmail || !walletCustomerEmail) return false;

  return userEmail.toLowerCase() === walletCustomerEmail.toLowerCase();
};

export const formatPaymentDate = (date: DateTime, timeType?: "start" | "end"): string => {
  if (!timeType) {
    return formatDateUtil(date, "yyyy-MM-dd'T'HH:mm:ss", { locale: "en" });
  }

  const dateStr = formatDateUtil(date, "yyyy-MM-dd", { locale: "en" });
  const timeTypeValue = timeType === "start" ? "00:00:00" : "23:59:59";

  return `${dateStr}T${timeTypeValue}`;
};

export const getWalletBalanceAmount = (data: TBalance): number => {
  const balance = data && typeof data !== "number" ? data : null;
  if (balance?.subAccounts && balance.subAccounts.length > 0)
    return balance.subAccounts[0].amount ?? 0;

  return 0.0;
};

export const getWalletBalanceCurrency = (data: TBalance): string => {
  const balance = data && typeof data !== "number" ? data : null;
  if (balance?.subAccounts && balance.subAccounts.length > 0)
    return balance.subAccounts[0].currency ?? "USD";

  return "USD";
};
