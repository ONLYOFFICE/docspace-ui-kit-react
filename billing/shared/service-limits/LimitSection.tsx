import React from "react";
import { observer } from "mobx-react";

import { Text } from "../../../components/text";
import { toastr } from "../../../components/toast";
import { ToggleButton } from "../../../components/toggle-button";
import { useCommonTranslation } from "../../../utils/i18n";
import { usePaymentStore } from "../../store/PaymentStoreProvider";

import { useLimitForm } from "./hooks/useLimitForm";
import LimitActions from "./sub-components/LimitActions";
import LimitAmountField from "./sub-components/LimitAmountField";
import LimitPeriodComboBox from "./sub-components/LimitPeriodComboBox";
import type {
  TServiceLimit,
  TServiceLimitPeriod,
  TServiceLimitUsage,
} from "./common/types";
import { getCurrencySymbol, isCurrencySymbolAfter } from "./common/utils";
import styles from "./styles/ServiceLimits.module.scss";

type LimitSectionProps = {
  title: string;
  description: React.ReactNode;
  limit: TServiceLimit | null;
  usage: TServiceLimitUsage | null;
  isSaving: boolean;
  onSave: (amount: number, period: TServiceLimitPeriod) => Promise<void>;
  onSetEnabled: (enabled: boolean) => Promise<void>;
  testId: string;
};

const LimitSection = ({
  title,
  description,
  limit,
  usage,
  isSaving,
  onSave,
  onSetEnabled,
  testId,
}: LimitSectionProps) => {
  const t = useCommonTranslation();

  const {
    language,
    walletCodeCurrency,
    formatWalletCurrency,
    isServiceActionDisabled: isDisabled,
  } = usePaymentStore();

  const currency = limit?.currency ?? walletCodeCurrency;

  const {
    isEnabled,
    isDraft,
    setIsDraft,
    amountText,
    setAmountText,
    period,
    setPeriod,
    amount,
    amountError,
    isDirty,
    canSave,
    reset,
  } = useLimitForm({
    limit,
    currency,
    isSaving,
    isDisabled,
    formatCurrency: formatWalletCurrency,
    t,
  });

  const isFormVisible = isEnabled || isDraft;
  const isLocked = isDisabled || isSaving;

  const onToggle = async () => {
    if (!isEnabled) {
      setIsDraft((draft) => !draft);
      return;
    }

    try {
      await onSetEnabled(false);
    } catch (error) {
      toastr.error(error as Error);
    }
  };

  const onSubmit = async () => {
    if (amount === null) return;

    try {
      await onSave(amount, period);
      setIsDraft(false);
      toastr.success(t("ChangesSavedSuccessfully"));
    } catch (error) {
      toastr.error(error as Error);
    }
  };

  const onCancel = () => {
    reset();
    setIsDraft(false);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <ToggleButton
          className={styles.toggle}
          isChecked={isFormVisible}
          onChange={onToggle}
          isDisabled={isLocked}
          dataTestId={`${testId}_toggle`}
        />
        <Text fontSize="14px" fontWeight={600}>
          {title}
        </Text>
      </div>
      <div className={styles.sectionBody}>
        <Text className={styles.sectionDescription}>{description}</Text>

        {isFormVisible ? (
          <>
            <div className={styles.controls}>
              <LimitPeriodComboBox
                value={period}
                onChange={setPeriod}
                isDisabled={isLocked}
                testId={`${testId}_period_combobox`}
              />
              <LimitAmountField
                value={amountText}
                onChange={setAmountText}
                currencySymbol={getCurrencySymbol(language, currency)}
                isSymbolAfter={isCurrencySymbolAfter(language, currency)}
                isDisabled={isLocked}
                errorMessage={amountError}
                onEnter={canSave ? onSubmit : undefined}
                testId={`${testId}_amount_input`}
              />
            </div>

            <LimitActions
              canSave={canSave}
              isDirty={isDirty}
              isSaving={isSaving}
              onSave={onSubmit}
              onCancel={onCancel}
              testId={testId}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default observer(LimitSection);
