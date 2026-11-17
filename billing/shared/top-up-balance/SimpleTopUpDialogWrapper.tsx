import React, { useEffect } from "react";
import { isIOS } from "react-device-detect";

import { useApi } from "../../../providers/api";
import { toAbsoluteUrl } from "../../utils/url";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { getPromoCodeReturnUrls } from "../promo-code/promoCodeReturn";
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

  const onClose = () => {
    store.setTopUpDialogTab("purchase");
    props.onClose();
  };

  useEffect(() => {
    return () => {
      store.setVisibleWalletSetting(false);
    };
  }, [store]);

  const onLinkCard = async () => {
    const { backUrl, successUrl } = getPromoCodeReturnUrls();

    const linkUrl = await store.fetchCardLinked(backUrl, successUrl, false);

    if (!linkUrl) throw new Error("Missing Stripe checkout URL");

    const checkoutUrl = toAbsoluteUrl(linkUrl);

    if (isIOS) window.location.href = checkoutUrl;
    else window.open(checkoutUrl, "_blank");
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
      initialTab={props.initialTab ?? store.topUpDialogTab}
      onClose={onClose}
    />
  );
};

export default SimpleTopUpDialogWrapper;
