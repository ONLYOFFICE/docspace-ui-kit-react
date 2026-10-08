import React, { useState } from "react";
import { observer } from "mobx-react";
import { CommonTrans } from "../../../../utils/i18n/CommonTrans";

import {
  ModalDialog,
  ModalDialogType,
} from "../../../../components/modal-dialog";
import { toastr } from "../../../../components/toast";
import { useApi } from "../../../../providers/api";
import { Button, ButtonSize } from "../../../../components/button";
import { calculateTotalPrice, getConvertedSize } from "../../../utils/common";
import { Text } from "../../../../components/text";

import { useServicesActions } from "../../hooks/useServicesActions";
import { PaymentProvider } from "../../context/PaymentContext";
import styles from "../../styles/index.module.scss";
import StorageWarning from "./StorageWarning";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";

type StorageDialogProps = {
  visible: boolean;
  onClose: () => void;
};

const StoragePlanCancel: React.FC<StorageDialogProps> = ({
  visible,
  onClose,
}) => {
  const { paymentApi } = useApi();
  const paymentStore = usePaymentStore();

  const {
    fetchBalance,
    storagePriceIncrement,
    handleServicesQuotas,
    formatWalletCurrency,
  } = paymentStore;

  const { currentStoragePlanSize, fetchPortalTariff } = paymentStore.tariff;
  const { usedTotalStorageSizeCount } = paymentStore.quotas;

  const totalPrice = calculateTotalPrice(
    currentStoragePlanSize,
    storagePriceIncrement,
  );

  const [isLoading, setIsLoading] = useState(false);

  const { t } = useServicesActions();

  const handleStoragePlanChange = async () => {
    const timerId = setTimeout(() => {
      setIsLoading(true);
    }, 200);

    try {
      const walletRes = await paymentApi.updateWalletPayment({
        walletQuantityRequestDto: {
          quantity: { storage: 0 },
          productQuantityType: 0,
        },
      });
      const res = walletRes?.data?.response;

      if (res === false) {
        toastr.error(t("UnexpectedError"));

        clearTimeout(timerId);
        setIsLoading(false);

        return;
      }

      await Promise.all([fetchPortalTariff?.(), handleServicesQuotas()]);

      onClose();
      fetchBalance();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      toastr.error(errorMessage);
    }

    clearTimeout(timerId);
    setIsLoading(false);
  };

  return (
    <PaymentProvider>
      <ModalDialog
        visible={visible}
        onClose={onClose}
        displayType={ModalDialogType.modal}
        autoMaxHeight
        isLarge
      >
        <ModalDialog.Header>{t("SubscriptionCancellation")}</ModalDialog.Header>
        <ModalDialog.Body>
          <div className={styles.cancelDialog}>
            <Text>{t("WantToCancelStoragePlan")}</Text>
            <br />
            <Text as="span">
              <CommonTrans
                i18nKey="YourCurrentPlan"
                values={{
                  amount: `${currentStoragePlanSize} ${t("Gigabyte")}`,
                  price: formatWalletCurrency(totalPrice, 2),
                }}
                components={{
                  1: <Text fontWeight={600} as="span" />,
                  2: <Text className={styles.monthPayment} as="span" />,
                }}
              />
            </Text>
            <Text>
              <CommonTrans
                i18nKey="StorageUsed"
                values={{
                  amount: getConvertedSize(t, usedTotalStorageSizeCount),
                }}
                components={{
                  1: <Text fontWeight={600} as="span" />,
                }}
              />
            </Text>
          </div>
          <StorageWarning />
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            key="OkButton"
            label={t("Yes")}
            size={ButtonSize.normal}
            primary
            onClick={handleStoragePlanChange}
            isLoading={isLoading}
            testId="storage_plan_cancel_ok_button"
          />
          <Button
            key="CancelButton"
            label={t("No")}
            size={ButtonSize.normal}
            onClick={onClose}
            testId="storage_plan_cancel_no_button"
          />
        </ModalDialog.Footer>
      </ModalDialog>
    </PaymentProvider>
  );
};

export default observer(StoragePlanCancel);
