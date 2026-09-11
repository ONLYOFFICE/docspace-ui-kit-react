import React from "react";

import { useApi } from "../../../providers/api";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import SimpleTopUpDialog, {
  type SimpleTopUpDialogProps,
  type TSimpleTopUpDeps,
} from "./SimpleTopUpDialog";

type SimpleTopUpDialogWrapperProps = Omit<
  SimpleTopUpDialogProps,
  keyof TSimpleTopUpDeps
>;

const SimpleTopUpDialogWrapper: React.FC<SimpleTopUpDialogWrapperProps> = (
  props,
) => {
  const { paymentApi } = useApi();
  const store = usePaymentStore();
  const {
    formatWalletCurrency,
    walletCodeCurrency,
    fetchTransactionHistory,
    language,
    walletBalance,
  } = store;
  const {
    walletCustomerStatusNotActive,
    isDelayedPaymentMethod,
    fetchCustomerInfo,
  } = store.tariff;

  const fetchBalance = async (isRefresh?: boolean) => {
    await store.fetchBalance(isRefresh);
    return store.walletBalance ?? 0;
  };

  const fetchCardLinked = async (backUrl?: string, successUrl?: string) => {
    return store.fetchCardLinked(backUrl, successUrl, false);
  };

  return (
    <SimpleTopUpDialog
      {...props}
      paymentApi={paymentApi}
      formatWalletCurrency={formatWalletCurrency}
      walletCodeCurrency={walletCodeCurrency ?? ""}
      fetchBalance={fetchBalance}
      fetchTransactionHistory={fetchTransactionHistory}
      walletCustomerStatusNotActive={walletCustomerStatusNotActive}
      isDelayedPaymentMethod={isDelayedPaymentMethod}
      isStripeCheckoutRequired={store.isStripeCheckoutRequired}
      language={language ?? "en"}
      fetchCardLinked={fetchCardLinked}
      walletBalance={walletBalance ?? 0}
      fetchCustomerInfo={fetchCustomerInfo}
    />
  );
};

export default SimpleTopUpDialogWrapper;

