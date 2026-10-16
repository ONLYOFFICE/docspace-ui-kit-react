import React from "react";
import classNames from "classnames";

import { FieldContainer } from "../../../../components/field-container";
import { InputBlock } from "../../../../components/input-block";
import { Text } from "../../../../components/text";
import { InputSize, InputType } from "../../../../components/text-input";
import { useCommonTranslation } from "../../../../utils/i18n";

import { isAmountInputValid } from "../common/utils";
import styles from "../styles/ServiceLimits.module.scss";

type LimitAmountFieldProps = {
  value: string;
  onChange: (value: string) => void;
  currencySymbol: string;
  isSymbolAfter?: boolean;
  isDisabled?: boolean;
  errorMessage?: string;
  isAutoFocussed?: boolean;
  onEnter?: () => void;
  testId?: string;
};

const LimitAmountField = ({
  value,
  onChange,
  currencySymbol,
  isSymbolAfter,
  isDisabled,
  errorMessage,
  isAutoFocussed,
  onEnter,
  testId,
}: LimitAmountFieldProps) => {
  const t = useCommonTranslation();
  const hasError = Boolean(errorMessage);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (isAmountInputValid(next)) onChange(next);
  };

  return (
    <FieldContainer
      className={styles.amountField}
      isVertical
      removeMargin
      hasError={hasError}
      errorMessage={errorMessage}
    >
      <InputBlock
        className={classNames(styles.amountInput, {
          [styles.symbolAfter]: isSymbolAfter,
        })}
        type={InputType.text}
        inputMode="decimal"
        size={InputSize.base}
        scale
        value={value}
        onChange={onInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") onEnter?.();
        }}
        isDisabled={isDisabled}
        hasError={hasError}
        isAutoFocussed={isAutoFocussed}
        placeholder="0"
        aria-label={t("Amount")}
        tabIndex={0}
        noIcon
        testId={testId}
      >
        {currencySymbol ? (
          <Text as="span" className={styles.currencySymbol}>
            {currencySymbol}
          </Text>
        ) : null}
      </InputBlock>
    </FieldContainer>
  );
};

export default LimitAmountField;
