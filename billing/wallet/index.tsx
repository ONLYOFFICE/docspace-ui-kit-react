import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useCommonTranslation } from "../../utils/i18n";

import socket, { SocketEvents } from "../../utils/socket";

import { usePaymentStore } from "../store/PaymentStoreProvider";

import WalletLoader from "./WalletLoader";
import WalletContainer from "./WalletContainer";
import StorageTariffDeactivated from "../dialogs/StorageTariffDeactivated";

type WalletProps = {
  onSetDocumentTitle?: (title: string) => void;
  showPortalSettingsLoader?: boolean;
  isUpdatingTariff?: boolean;
  integrationUrl?: string;
  onViewUsage?: () => void;
  onAddonsClick?: () => void;
};

const Wallet = observer((props: WalletProps) => {
  const { showPortalSettingsLoader, integrationUrl } = props;

  const paymentStore = usePaymentStore();
  const {
    isInitWalletPage,
    isShowStorageTariffDeactivatedModal,
    walletInit,
    fetchBalance,
    fetchTransactionHistory,
  } = paymentStore;

  const t = useCommonTranslation();

  const shouldShowLoader = !isInitWalletPage;

  useEffect(() => {
    walletInit(t, integrationUrl);
  }, []);

  useEffect(() => {
    const onTopUpWallet = (data: { auto: boolean }) => {
      if (!data || data?.auto === false) return;

      fetchBalance(true);
      fetchTransactionHistory();
    };

    socket?.on(SocketEvents.TopUpWallet, onTopUpWallet);

    return () => {
      socket?.off(SocketEvents.TopUpWallet, onTopUpWallet);
    };
  }, [fetchBalance, fetchTransactionHistory]);

  return shouldShowLoader || showPortalSettingsLoader ? (
    <WalletLoader />
  ) : (
    <>
      <WalletContainer {...props} />
      {isShowStorageTariffDeactivatedModal ? (
        <StorageTariffDeactivated
          visible={isShowStorageTariffDeactivatedModal}
        />
      ) : null}
    </>
  );
});

export default Wallet;

