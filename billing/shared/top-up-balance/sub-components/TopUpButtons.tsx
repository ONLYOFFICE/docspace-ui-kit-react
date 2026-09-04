import React from "react";
import { observer } from "mobx-react";

import { AnalyticsEvents } from "../../../../enums";

import { useCommonTranslation } from "../../../../utils/i18n";

import { Button, ButtonSize } from "../../../../components/button";
import { toastr } from "../../../../components/toast";

import { Text } from "../../../../components/text";

import { useAmountValue } from "../../../wallet/context";
import styles from "../styles/TopUpModal.module.scss";
import { AI_TOOLS } from "../../../constants";
import { usePaymentStore } from "../../../store/PaymentStoreProvider";

interface TopUpButtonsProps {
  currency: string;
  setIsLoading: (value: boolean) => void;
  isLoading: boolean;
  fetchBalance?: () => Promise<void>;
  fetchServiceBalance?: () => Promise<void>;
  fetchTransactionHistory?: (serviceName?: string) => Promise<void>;
  onClose: (isTopUp: boolean) => void;
  isDisabled?: boolean;
  onTopUpBalance: (amount: number, currency: string) => Promise<string>;
  serviceName?: string;
  afterTopUp?: () => void;
}

const TopUpButtons: React.FC<TopUpButtonsProps> = ({
  currency,
  fetchBalance,
  fetchServiceBalance,
  fetchTransactionHistory,
  onClose,
  setIsLoading,
  isLoading,
  onTopUpBalance,
  serviceName,
  afterTopUp,
  isDisabled,
}) => {
  const paymentStore = usePaymentStore();

  const { handleServicesQuotas, isAlreadyPaid } = paymentStore;
  const { logoText } = paymentStore;
  const t = useCommonTranslation();

  const { amount, isBalanceInsufficient, hasError } = useAmountValue();

  const isButtonDisabled =
    isDisabled ||
    !amount ||
    !isAlreadyPaid ||
    isBalanceInsufficient ||
    hasError;

  const onTopUp = async () => {
    try {
      setIsLoading(true);

      const res = await onTopUpBalance(+amount, serviceName ?? currency);

      if (!res) {
        throw new Error(t("UnexpectedError"));
      }

      if (!serviceName) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: AnalyticsEvents.WalletTopUp,
        });
      }

      const requests: Promise<unknown>[] = [
        fetchBalance!(),
        fetchTransactionHistory!(serviceName),
      ];

      if (serviceName) {
        requests.push(fetchServiceBalance!());
        requests.push(handleServicesQuotas!());
      }

      await Promise.allSettled(requests);

      const toastMessage =
        serviceName === AI_TOOLS
          ? t("AIServiceToppedUp", { organizationName: logoText })
          : t("WalletToppedUp");

      toastr.success(toastMessage);
      afterTopUp ? afterTopUp() : onClose(true);
    } catch (e) {
      toastr.error(e as unknown as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.buttonContainerWrapper}>
      {isLoading ? <Text>{t("TopUpTakeSomeTimeToComplete")}</Text> : null}
      <div className={styles.buttonContainer}>
        <Button
          key="OkButton"
          label={t("TopUp")}
          size={ButtonSize.normal}
          primary
          scale
          isDisabled={isButtonDisabled}
          onClick={onTopUp}
          isLoading={isLoading}
          testId="top_up_button"
        />
        <Button
          key="CancelButton"
          label={t("CancelButton")}
          size={ButtonSize.normal}
          scale
          onClick={() => onClose(false)}
          isDisabled={isLoading}
          testId="cancel_top_up_button"
        />
      </div>
    </div>
  );
};

export default observer(TopUpButtons);

