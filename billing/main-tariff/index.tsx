import React, { useEffect } from "react";

import { observer } from "mobx-react";
import { useCommonTranslation } from "../../utils/i18n";
import socket, { SocketEvents, type TOptSocket } from "../../utils/socket";

import PaymentsLoader from "../loader";

import { usePaymentStore } from "../store/PaymentStoreProvider";

import PaymentContainer from "./PaymentContainer";
import StorageTariffDeactivated from "../dialogs/StorageTariffDeactivated";

type SaaSPageProps = {
  language?: string;
  user?: object;
  isUpdatingTariff?: boolean;
  showPortalSettingsLoader?: boolean;
  onSetDocumentTitle?: (title: string) => void;
};

const SaaSPage = observer(
  ({
    isUpdatingTariff = false,
    showPortalSettingsLoader = false,
    onSetDocumentTitle,
  }: SaaSPageProps) => {
    const paymentStore = usePaymentStore();
    const {
      isInitPaymentPage,
      resetTariffContainerToBasic,
      isShowStorageTariffDeactivatedModal,
      init,
      fetchBalance,
    } = paymentStore;
    const { fetchPortalQuota } = paymentStore.quotas;
    const { fetchPortalTariff, fetchCustomerInfo } = paymentStore.tariff;

    const t = useCommonTranslation();
    const shouldShowLoader =
      !isInitPaymentPage || isUpdatingTariff || showPortalSettingsLoader;

    const isQuotasLoaded = paymentStore.quotas.isLoaded;

    useEffect(() => {
      if (!isQuotasLoaded) return;

      init(t);
      return () => resetTariffContainerToBasic();
    }, [isQuotasLoaded]);

    useEffect(() => {
      const onQuotaFeatureChanged = (data: TOptSocket) => {
        fetchPortalQuota(true);
        if (data?.featureId === "free") fetchPortalTariff(true);
      };

      const onTopUpWallet = () => {
        fetchBalance(true).catch(() => undefined);
        fetchCustomerInfo(true);
      };

      socket?.on(SocketEvents.ChangedQuotaFeatureValue, onQuotaFeatureChanged);
      socket?.on(SocketEvents.TopUpWallet, onTopUpWallet);

      return () => {
        socket?.off(
          SocketEvents.ChangedQuotaFeatureValue,
          onQuotaFeatureChanged,
        );
        socket?.off(SocketEvents.TopUpWallet, onTopUpWallet);
      };
    }, [fetchPortalQuota, fetchPortalTariff, fetchBalance, fetchCustomerInfo]);

    useEffect(() => {
      const title = t("Billing");
      if (onSetDocumentTitle) {
        onSetDocumentTitle(title);
      } else {
        document.title = title;
      }
    }, []);

    return shouldShowLoader ? (
      <PaymentsLoader />
    ) : (
      <div data-testid="saas-page">
        <PaymentContainer t={t} />
        {isShowStorageTariffDeactivatedModal ? (
          <StorageTariffDeactivated
            visible={isShowStorageTariffDeactivatedModal}
          />
        ) : null}
      </div>
    );
  },
);

export default SaaSPage;
