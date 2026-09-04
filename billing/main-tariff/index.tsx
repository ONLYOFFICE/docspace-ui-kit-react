import React, { useEffect } from "react";

import { observer } from "mobx-react";
import { useCommonTranslation } from "../../utils/i18n";

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
    } = paymentStore;

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

