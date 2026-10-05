import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react";
import classNames from "classnames";

import { Button, ButtonSize } from "../../../components/button";
import { Text } from "../../../components/text";
import { toastr } from "../../../components/toast";
import { ToggleButton } from "../../../components/toggle-button";
import { useCommonTranslation } from "../../../utils/i18n";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { useServiceLimitStore } from "../../store/ServiceLimitStoreProvider";

import LimitAmountField from "./sub-components/LimitAmountField";
import LimitPeriodComboBox from "./sub-components/LimitPeriodComboBox";
import type { TServiceLimitPeriod } from "./common/types";
import {
  DEFAULT_LIMIT_PERIOD,
  formatAmountInput,
  formatPeriodEnd,
  getCurrencySymbol,
  getLimitUsagePercent,
  isAmountOutOfRange,
  isCurrencySymbolAfter,
  isLimitApproaching,
  isLimitReached,
  MAX_LIMIT_AMOUNT,
  MIN_LIMIT_AMOUNT,
  parseAmount,
} from "./common/utils";
import styles from "./styles/ServiceLimits.module.scss";

type PortalLimitSectionProps = {
  description: string;
  isDisabled?: boolean;
};

const PortalLimitSection = ({
  description,
  isDisabled,
}: PortalLimitSectionProps) => {
  const t = useCommonTranslation();
  const {
    portalLimit,
    portalUsage,
    isPortalSaving,
    isPortalLimitEnabled,
    savePortalLimit,
    setPortalLimitEnabled,
  } = useServiceLimitStore();

  const { language, walletCodeCurrency, formatWalletCurrency } =
    usePaymentStore();

  const [isDraft, setIsDraft] = useState(false);
  const [amountText, setAmountText] = useState("");
  const [period, setPeriod] =
    useState<TServiceLimitPeriod>(DEFAULT_LIMIT_PERIOD);

  const resetForm = useCallback(() => {
    setAmountText(formatAmountInput(portalLimit?.amountValue));
    setPeriod(portalLimit?.period ?? DEFAULT_LIMIT_PERIOD);
  }, [portalLimit]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const currency = portalLimit?.currency ?? walletCodeCurrency;
  const currencySymbol = getCurrencySymbol(language, currency);
  const isSymbolAfter = isCurrencySymbolAfter(language, currency);

  const isFormVisible = isPortalLimitEnabled || isDraft;

  const amount = parseAmount(amountText);
  const isDirty =
    !portalLimit ||
    !portalLimit.enabled ||
    amount !== portalLimit.amountValue ||
    period !== portalLimit.period;

  const isOutOfRange = isAmountOutOfRange(amount);
  const hasAmountError = amountText !== "" && (amount === null || isOutOfRange);

  const canSave =
    amount !== null &&
    !isOutOfRange &&
    isDirty &&
    !isPortalSaving &&
    !isDisabled;

  const getAmountError = () => {
    if (amount === null) return undefined;

    if (amount > MAX_LIMIT_AMOUNT) {
      return t("MaxCurrency", {
        currency: formatWalletCurrency(MAX_LIMIT_AMOUNT, 0, currency),
      });
    }

    if (amount < MIN_LIMIT_AMOUNT) {
      return t("MinCurrency", {
        currency: formatWalletCurrency(MIN_LIMIT_AMOUNT, 0, currency),
      });
    }

    return undefined;
  };

  const onToggle = async () => {
    if (!portalLimit?.enabled) {
      setIsDraft((draft) => !draft);
      return;
    }

    try {
      await setPortalLimitEnabled(false);
    } catch (error) {
      toastr.error(error as Error);
    }
  };

  const onSave = async () => {
    if (amount === null) return;

    try {
      await savePortalLimit(amount, period);
      setIsDraft(false);
      toastr.success(t("ChangesSavedSuccessfully"));
    } catch (error) {
      toastr.error(error as Error);
    }
  };

  const onCancel = () => {
    resetForm();
    setIsDraft(false);
  };

  const renderStatus = () => {
    if (!portalLimit?.enabled || !portalUsage) return null;

    const limitValue = portalLimit.amountValue;

    if (limitValue === null) return null;

    const spent = formatWalletCurrency(portalUsage.amountConsumed, 2, currency);
    const limit = formatWalletCurrency(limitValue, 2, currency);
    const date = formatPeriodEnd(portalUsage.periodEnd, language);

    if (isLimitReached(portalUsage.amountConsumed, limitValue)) {
      return (
        <Text
          className={classNames(styles.status, styles.statusColumn)}
          dataTestId="portal_limit_status"
        >
          <Text
            as="span"
            fontSize="11px"
            fontWeight={600}
            className={classNames(styles.statusBadge, styles.statusBadgeError)}
          >
            {t("LimitReached")}
          </Text>
          <Text as="span" fontSize="12px">
            {t("LimitResumes", { date })}
          </Text>
        </Text>
      );
    }

    const spentOf = `${t("LimitSpentOf", { spent, limit })} ${t("LimitResets", { date })}`;

    if (isLimitApproaching(portalUsage.amountConsumed, limitValue)) {
      const percent = getLimitUsagePercent(
        portalUsage.amountConsumed,
        limitValue,
      );

      return (
        <Text
          className={classNames(styles.status, styles.statusRow)}
          dataTestId="portal_limit_status"
        >
          <Text
            as="span"
            fontSize="11px"
            fontWeight={600}
            className={classNames(
              styles.statusBadge,
              styles.statusBadgeWarning,
            )}
          >
            {t("LimitPercentUsed", { percent })}
          </Text>
          <Text as="span" fontSize="12px">
            {spentOf}
          </Text>
        </Text>
      );
    }

    return (
      <Text className={styles.status} dataTestId="portal_limit_status">
        {spentOf}
      </Text>
    );
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <ToggleButton
          className={styles.toggle}
          isChecked={isFormVisible}
          onChange={onToggle}
          isDisabled={isDisabled || isPortalSaving}
          dataTestId="portal_limit_toggle"
        />
        <Text fontSize="14px" fontWeight={600}>
          {t("PortalLimit")}
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
                isDisabled={isDisabled || isPortalSaving}
                testId="portal_limit_period_combobox"
              />
              <LimitAmountField
                value={amountText}
                onChange={setAmountText}
                currencySymbol={currencySymbol}
                isSymbolAfter={isSymbolAfter}
                isDisabled={isDisabled || isPortalSaving}
                hasError={hasAmountError}
                errorMessage={getAmountError()}
                onEnter={canSave ? onSave : undefined}
                testId="portal_limit_amount_input"
              />
            </div>

            {isOutOfRange ? null : renderStatus()}

            <div className={styles.actions}>
              <Button
                label={t("SaveButton")}
                size={ButtonSize.small}
                primary
                isDisabled={!canSave}
                isLoading={isPortalSaving}
                onClick={onSave}
                testId="portal_limit_save_button"
              />
              <Button
                label={t("CancelButton")}
                size={ButtonSize.small}
                isDisabled={!isDirty || isPortalSaving}
                onClick={onCancel}
                testId="portal_limit_cancel_button"
              />
              {isDirty ? (
                <Text
                  className={styles.reminder}
                  fontSize="12px"
                  fontWeight={600}
                  aria-live="polite"
                  dataTestId="portal_limit_reminder"
                >
                  {t("YouHaveUnsavedChanges")}
                </Text>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default observer(PortalLimitSection);
