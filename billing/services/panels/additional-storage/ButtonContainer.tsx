import React from "react";
import { observer } from "mobx-react";

import { Button, ButtonSize } from "../../../../components/button";
import { Link } from "../../../../components/link";

import { useServicesActions } from "../../hooks/useServicesActions";
import { usePaymentContext } from "../../context/PaymentContext";

import styles from "../../styles/index.module.scss";
import { Text } from "../../../../components";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { Trans } from "react-i18next";

interface ButtonContainerProps {
  onClose: () => void;
  onBuy: () => void;
  onSendRequest: () => void;
  isLoading: boolean;
  isExceedingStorageLimit: boolean;
  isPaymentBlockedByBalance: boolean;
  isBalanceInsufficient: boolean;
  recommendedAmount: number;
  isCurrentStoragePlan?: boolean;
  isPaymentBlocked?: boolean;
  totalPrice?: number;
  isDisabled?: boolean;
  currentStoragePlanSize?: number;
  isDowngradeStoragePlan?: boolean;
}

const ButtonContainer: React.FC<ButtonContainerProps> = (props) => {
  const {
    isExceedingStorageLimit,
    onClose,
    isLoading,
    onBuy,
    onSendRequest,
    isPaymentBlockedByBalance,
    isBalanceInsufficient,
    recommendedAmount,
    isCurrentStoragePlan,
    isPaymentBlocked,
    totalPrice = 0,
    isDowngradeStoragePlan,
    isDisabled,
  } = props;

  const paymentStore = usePaymentStore();
  const {
    hasStorageSubscription,
    storageExpiryDate,
    walletCustomerEmail,
    walletCustomerInfo,
  } = paymentStore.tariff;
  const { formatWalletCurrency, isPayer, isCardLinkedToPortal } = paymentStore;

  const payerDisplayName = walletCustomerInfo?.displayName;
  const payerLabel = payerDisplayName || walletCustomerEmail;

  const { t } = useServicesActions();
  const { isWaitingCalculation } = usePaymentContext();

  const isTopUpUnavailable =
    isBalanceInsufficient && isCardLinkedToPortal && !isPayer;
  const canTopUpAndBuy = isBalanceInsufficient && !isTopUpUnavailable;

  const title = canTopUpAndBuy
    ? t("TopUpAndUpgrade")
    : !hasStorageSubscription
      ? t("UpgradeNow")
      : isExceedingStorageLimit
        ? t("SendRequest")
        : t("Update");

  const showNextBillHint =
    hasStorageSubscription &&
    !isDowngradeStoragePlan &&
    !isCurrentStoragePlan &&
    !isPaymentBlocked &&
    !isExceedingStorageLimit &&
    !isBalanceInsufficient &&
    totalPrice > 0;

  return (
    <div className={styles.buttonWrapper}>
      {showNextBillHint ? (
        <Text>
          {t("NextMonthBillDate", {
            currency: formatWalletCurrency(totalPrice, 2),
            date: storageExpiryDate,
          })}
        </Text>
      ) : null}

      {isTopUpUnavailable ? (
        <Text as="span">
          <Trans
            ns="Common"
            i18nKey="InsufficientCreditsContactPayer"
            components={{
              1:
                walletCustomerEmail && !payerDisplayName ? (
                  <Link
                    tag="a"
                    color="accent"
                    href={`mailto:${walletCustomerEmail}`}
                    dataTestId="storage_contact_payer_link"
                  />
                ) : (
                  <Text
                    as="span"
                    fontWeight={600}
                    dataTestId="storage_contact_payer_name"
                  />
                ),
            }}
            values={{ payerContact: payerLabel }}
          />
        </Text>
      ) : null}

      {canTopUpAndBuy ? (
        <Text as="span">
          <Trans
            ns="Common"
            i18nKey="TopUpAndUpgradeHint"
            components={{
              1: <Text fontWeight="600" as="span"></Text>,
            }}
            values={{
              currency: formatWalletCurrency(recommendedAmount, 2),
            }}
          />
        </Text>
      ) : null}

      <div className={styles.buttonContainer}>
        <Button
          key="OkButton"
          label={title}
          size={ButtonSize.normal}
          primary
          scale
          onClick={isExceedingStorageLimit ? onSendRequest : onBuy}
          isLoading={isLoading}
          isDisabled={
            isPaymentBlocked ||
            (isPaymentBlockedByBalance && !canTopUpAndBuy) ||
            isCurrentStoragePlan ||
            isDisabled ||
            isWaitingCalculation
          }
          testId="storage_plan_upgrade_ok_button"
        />
        <Button
          key="CancelButton"
          label={t("CancelButton")}
          size={ButtonSize.normal}
          scale
          onClick={onClose}
          isDisabled={isLoading}
          testId="storage_plan_upgrade_cancel_button"
        />
      </div>
    </div>
  );
};

export default observer(ButtonContainer);

