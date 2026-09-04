import React, { useState } from "react";
import { useCommonTranslation } from "../../utils/i18n";
import { CommonTrans } from "../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";

import { ModalDialog, ModalDialogType } from "../../components/modal-dialog";
import { Text } from "../../components/text";
import { Button, ButtonSize } from "../../components/button";
import { toastr } from "../../components/toast";

import AutomaticPaymentsBlock from "../shared/top-up-balance/sub-components/AutoPayments";

import styles from "./styles/Wallet.module.scss";
import { usePaymentStore } from "../store/PaymentStoreProvider";

type WalletRefilledModalProps = {
  visible: boolean;
  onClose?: () => void;
};

const WalletRefilledModal = (props: WalletRefilledModalProps) => {
  const { visible, onClose } = props;

  const paymentStore = usePaymentStore();

  const {
    updateAutoPayments,
    isAutomaticPaymentsEnabled,
    upToBalanceError,
    minBalanceError,
    upToBalance,
    minBalance,
    updatePreviousBalance,
    formatWalletCurrency,
    wasChangeBalance,
  } = paymentStore;

  const t = useCommonTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const formattedBalance = formatWalletCurrency!();

  const onCloseDialog = () => {
    updatePreviousBalance!();
    onClose?.();
  };

  const onAdditionalSave = async () => {
    const timerId = setTimeout(() => {
      setIsLoading(true);
    }, 200);

    try {
      await updateAutoPayments!();

      setIsLoading(false);
    } catch (error) {
      toastr.error(error as string);
    }

    clearTimeout(timerId);
    setIsLoading(false);
    onCloseDialog();
  };

  return (
    <ModalDialog
      visible={visible}
      onClose={onCloseDialog}
      displayType={ModalDialogType.modal}
      autoMaxHeight
    >
      <ModalDialog.Header>
        {wasChangeBalance ? t("WalletRefilled") : t("TopUpCredits")}
      </ModalDialog.Header>
      <ModalDialog.Body>
        <div className={styles.modalContent}>
          {wasChangeBalance ? (
            <>
              <div>
                <Text as="span">{t("ToppedUpWallet")}</Text>
                <br />
                <Text as="span">
                  <CommonTrans
                    i18nKey="AvailableCreditsAmount"
                    values={{ balance: formattedBalance }}
                    components={{
                      1: <span style={{ fontWeight: 600 }} />,
                    }}
                  />
                </Text>
              </div>
              <Text>{t("WouldYouLikeToEnableAutoTopUps")}</Text>
            </>
          ) : null}

          <AutomaticPaymentsBlock
            onAdditionalSave={onAdditionalSave}
            noMargin
          />
        </div>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          key="EnableButton"
          label={t("SaveButton")}
          size={ButtonSize.normal}
          primary
          scale
          onClick={onAdditionalSave}
          isDisabled={
            !isAutomaticPaymentsEnabled ||
            minBalanceError ||
            upToBalanceError ||
            !minBalance ||
            !upToBalance
          }
          isLoading={isLoading}
          testId="wallet_refilled_save_button"
        />
        <Button
          key="CancelButton"
          label={t("CancelButton")}
          size={ButtonSize.normal}
          scale
          onClick={onCloseDialog}
          testId="wallet_refilled_cancel_button"
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default observer(WalletRefilledModal);

