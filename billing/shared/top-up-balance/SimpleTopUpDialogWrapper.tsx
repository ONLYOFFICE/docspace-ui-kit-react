import React from "react";

import { useApi } from "../../../providers/api";
import { toastr } from "../../../components/toast";
import { useCommonTranslation } from "../../../utils/i18n";
import { toAbsoluteUrl } from "../../utils/url";
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
  const t = useCommonTranslation();
  const { paymentApi } = useApi();
  const store = usePaymentStore();
  const {
    formatWalletCurrency,
    walletCodeCurrency,
    refreshTransactionHistory,
    language,
    walletBalance,
    isCardLinkedToPortal,
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

  const fetchTransactionHistory = async (serviceName?: string) => {
    await refreshTransactionHistory(serviceName);
  };

  const fetchCardLinked = async (backUrl?: string, successUrl?: string) => {
    return store.fetchCardLinked(backUrl, successUrl, false);
  };

  const onLinkCard = () => {
    const tab = window.open("", "_blank");

    const onCardLinkUrl = (url: string | null | undefined) => {
      if (!url) {
        tab?.close();
        toastr.error(t("UnexpectedError"));
        return;
      }

      if (tab) tab.location.href = toAbsoluteUrl(url);
    };

    if (store.cardLinked) onCardLinkUrl(store.cardLinked);
    else store.fetchCardLinked().then(onCardLinkUrl);
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
      applyPromoCode={store.applyPromoCode}
      isCardLinked={isCardLinkedToPortal}
      onLinkCard={onLinkCard}
    />
  );
};

export default SimpleTopUpDialogWrapper;
