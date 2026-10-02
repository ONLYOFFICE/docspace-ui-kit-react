import React from "react";
import { observer } from "mobx-react";
import { useCommonTranslation } from "../../../../utils/i18n";

import { Text } from "../../../../components/text";
import DiskStorageIcon from "../../../../assets/icons/16/catalog-settings-storage-management.svg";

import styles from "../../styles/CurrentSubscription.module.scss";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";

const CurrentSubscription: React.FC = () => {
  const paymentStore = usePaymentStore();
  const { formatWalletCurrency, storagePriceIncrement } = paymentStore;
  const { currentStoragePlanSize, storageExpiryDate } = paymentStore.tariff;

  const t = useCommonTranslation();

  const totalPrice =
    (currentStoragePlanSize || 0) * (storagePriceIncrement || 0);

  return (
    <div className={styles.currentSubscriptionWrapper}>
      <Text fontWeight="700" fontSize="16px">
        {t("CurrentSubscription")}
      </Text>
      <div className={styles.subscriptionCard}>
        <div className={styles.subscriptionContent}>
          <div className={styles.storageInfo}>
            <div className={styles.storageIcon}>
              <DiskStorageIcon />
            </div>
            <div className={styles.storageDetails}>
              <Text
                fontWeight="600"
                fontSize="14px"
                className={styles.storageName}
              >
                {currentStoragePlanSize} {t("Gigabyte")}
              </Text>
            </div>
          </div>
          <div className={styles.priceInfo}>
            <Text fontWeight="600" fontSize="14px">
              {t("CurrencyPerMonth", {
                currency: formatWalletCurrency(totalPrice, 2),
              })}
            </Text>
          </div>
        </div>
        <Text fontSize="12px" className={styles.renewalInfo}>
          {t("SubscriptionAutoRenewedOn", { finalDate: storageExpiryDate })}
        </Text>
      </div>
    </div>
  );
};

export default observer(CurrentSubscription);
