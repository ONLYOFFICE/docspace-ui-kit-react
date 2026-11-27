import React, { useState } from "react";
import { useCommonTranslation } from "../../../../utils/i18n";
import { observer } from "mobx-react";
import classNames from "classnames";

import { ToggleButton } from "../../../../components/toggle-button";
import { Text } from "../../../../components/text";
import { toastr } from "../../../../components/toast";
import { TextInput, InputType } from "../../../../components/text-input";
import { Button, ButtonSize } from "../../../../components/button";

import styles from "../styles/AutoPayments.module.scss";
import { usePaymentStore } from "../../../store/PaymentStoreProvider";

const MIN_BALANCE_MIN = 5;
const MIN_BALANCE_MAX = 1000;
const UP_TO_BALANCE_MAX = 5000;

type AutoPaymentsProps = {
  onAdditionalSave?: () => void;
  noMargin?: boolean;
  isDisabled?: boolean;
};

const AutoPayments = ({
  onAdditionalSave,
  noMargin,
  isDisabled,
}: AutoPaymentsProps) => {
  const store = usePaymentStore();

  const {
    updateAutoPayments,
    autoPayments,
    isAutoPaymentExist,
    setMinBalance,
    setUpToBalance,
    isAutomaticPaymentsEnabled,
    setIsAutomaticPaymentsEnabled,
    minBalance,
    upToBalance,
    setMinBalanceError,
    minBalanceError,
    setUpToBalanceError,
    upToBalanceError,
    formatWalletCurrency,
  } = store;

  const { walletCustomerEmail } = store.tariff;
  const t = useCommonTranslation();

  const isFieldsDisabled = isDisabled || !isAutomaticPaymentsEnabled;
  const isSummaryVisible =
    isAutomaticPaymentsEnabled &&
    !!minBalance &&
    !!upToBalance &&
    !minBalanceError &&
    !upToBalanceError;

  const [isLoading, setIsLoading] = useState(false);
  const [minUpToBalance, setMinUpToBalance] = useState(() => {
    const savedMin = parseInt(minBalance ?? "", 10);
    return (Number.isNaN(savedMin) ? MIN_BALANCE_MIN : savedMin) + 1;
  });

  const validateMaxUpToBalance = (value: string, minimumBalance: string) => {
    const numValue = parseInt(value, 10);
    const minInputValue = minimumBalance
      ? parseInt(minimumBalance, 10)
      : MIN_BALANCE_MIN;

    const minValue = minInputValue + 1;

    if (
      Number.isNaN(numValue) ||
      numValue < minValue ||
      numValue > UP_TO_BALANCE_MAX
    ) {
      setUpToBalanceError!(true);
      return;
    }

    setUpToBalanceError!(false);
  };

  const validateMinBalance = (value: string) => {
    const numValue = parseInt(value, 10);

    if (
      Number.isNaN(numValue) ||
      numValue < MIN_BALANCE_MIN ||
      numValue > MIN_BALANCE_MAX
    ) {
      setMinBalanceError!(true);
      return;
    }

    setMinBalanceError!(false);
    setMinUpToBalance(numValue + 1);

    if (upToBalance) {
      validateMaxUpToBalance(upToBalance, value);
    }
  };

  const onMinBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, validity } = e.target;

    if (!validity.valid) return;

    setMinBalance!(value);
    validateMinBalance(value);
  };

  const onMaxUpToBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, validity } = e.target;

    if (!validity.valid) return;

    setUpToBalance!(value);
    validateMaxUpToBalance(value, minBalance!);
  };

  const onSave = async () => {
    const timerId = setTimeout(() => {
      setIsLoading(true);
    }, 200);

    try {
      await updateAutoPayments!();
    } catch (error) {
      toastr.error(error as string);
    }

    clearTimeout(timerId);
    setIsLoading(false);
  };

  const onToggleClick = () => {
    const isEnable = !isAutomaticPaymentsEnabled;

    setIsAutomaticPaymentsEnabled!(isEnable);

    if (!isEnable && isAutoPaymentExist) {
      onSave();
    }
  };

  const onSaveAutoPayment = () => {
    onSave();
  };

  const onClose = () => {
    if (isAutoPaymentExist) {
      const savedMin = autoPayments?.minBalance ?? 0;

      setMinBalance!(savedMin.toString());
      setUpToBalance!((autoPayments?.upToBalance ?? 0).toString());
      setMinBalanceError!(false);
      setUpToBalanceError!(false);
      setMinUpToBalance(savedMin + 1);
      return;
    }

    onToggleClick();
  };

  const description = (min: number, max: number) => (
    <Text fontSize="12px" className={styles.inputDescription} fontWeight={400}>
      {t("EnterAnIntegerAmountBetween", {
        min: formatWalletCurrency!(min, 0),
        max: formatWalletCurrency!(max, 0),
      })}
    </Text>
  );

  return (
    <div
      className={classNames(styles.automaticPaymentsBlock, {
        [styles.noMargin]: noMargin,
      })}
    >
      <div className={styles.autoPaymentHeader}>
        <Text isBold fontSize="16px">
          {t("AutomaticTopUps")}
        </Text>
        <ToggleButton
          isChecked={isAutomaticPaymentsEnabled}
          onChange={onToggleClick}
          className={styles.toggleButton}
          isDisabled={isDisabled || !walletCustomerEmail}
          dataTestId="auto_payments_toggle_button"
        />
      </div>

      <Text fontSize="12px" className={styles.autoPaymentDescription}>
        {t("AutomaticallyAddCredits")}
      </Text>

      <div className={styles.inputFields}>
        <div className={styles.inputField}>
          <Text fontSize="12px" className={styles.inputLabel} fontWeight={600}>
            {t("WhenBalanceGoesBellow")}
          </Text>
          <TextInput
            scale
            value={minBalance!}
            onChange={onMinBalanceChange}
            hasError={minBalanceError}
            type={InputType.text}
            pattern="\d+"
            isDisabled={isFieldsDisabled}
            testId="top_up_min_balance_input"
          />
          {description(MIN_BALANCE_MIN, MIN_BALANCE_MAX)}
        </div>

        <div className={styles.inputField}>
          <Text fontSize="12px" className={styles.inputLabel} fontWeight={600}>
            {t("BringCreditBackUpTo")}
          </Text>
          <TextInput
            scale
            value={upToBalance!}
            onChange={onMaxUpToBalanceChange}
            hasError={upToBalanceError}
            type={InputType.text}
            pattern="\d+"
            isDisabled={isFieldsDisabled}
            testId="top_up_max_balance_input"
          />
          {description(minUpToBalance, UP_TO_BALANCE_MAX)}
        </div>
        {isSummaryVisible ? (
          <Text
            fontSize="12px"
            fontWeight={400}
            className={styles.inputDescription}
          >
            {t("WhenBalanceDropsTo", {
              min: formatWalletCurrency!(parseInt(minBalance!, 10), 0),
              max: formatWalletCurrency!(parseInt(upToBalance!, 10), 0),
            })}
          </Text>
        ) : null}
        {!onAdditionalSave ? (
          <div className={styles.inputButtons}>
            <Button
              key="OkButton"
              label={t("SaveButton")}
              size={ButtonSize.small}
              primary
              onClick={onSaveAutoPayment}
              isLoading={isLoading}
              isDisabled={
                isFieldsDisabled ||
                minBalanceError ||
                upToBalanceError ||
                !minBalance ||
                !upToBalance
              }
              testId="save_auto_payment_button"
            />
            <Button
              key="CancelButton"
              label={t("CancelButton")}
              size={ButtonSize.small}
              onClick={onClose}
              isDisabled={isFieldsDisabled || isLoading}
              testId="cancel_auto_payment_button"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default observer(AutoPayments);
