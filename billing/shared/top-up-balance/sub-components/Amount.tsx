import React, { useState } from "react";
import { useCommonTranslation } from "../../../../utils/i18n";
import { isMobile } from "react-device-detect";

import { TabItem } from "../../../../components/tab-item";
import { InputType, TextInput } from "../../../../components/text-input";
import { Text } from "../../../../components/text";
import { Tooltip } from "../../../../components/tooltip";

import styles from "../styles/Amount.module.scss";
import { useAmountValue } from "../../../wallet/context";
import { FieldContainer } from "../../../../components";

type AmountProps = {
  isDisabled: boolean;
  walletCustomerEmail?: string;
  walletCustomerStatusNotActive?: boolean;
  recommendedAmount?: string;
  formatWalletCurrency?: (item: number, fractionDigits?: number) => string;
  minValue?: string;
  maxValue?: string;
  withoutCustomerCheck?: boolean;
};

const MAX_LENGTH = 6;

const Amount = (props: AmountProps) => {
  const {
    walletCustomerEmail,
    isDisabled,
    walletCustomerStatusNotActive,
    recommendedAmount,
    formatWalletCurrency,
    minValue,
    maxValue,
    withoutCustomerCheck,
  } = props;

  const hasCustomerAccess = withoutCustomerCheck || !!walletCustomerEmail;

  const { amount, setAmount, hasError, setHasError } = useAmountValue();
  const [hasMinError, setHasMinError] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<string | undefined>();
  const t = useCommonTranslation();

  const getAmountTabs = () => {
    const amounts = [10, 20, 30, 50, 100];
    return amounts.map((item) => ({
      name: `+${formatWalletCurrency!(item, 0)}`,
      id: item.toString(),
      value: item,
      content: null,
      isDisabled: isDisabled || !hasCustomerAccess,
    }));
  };

  const checkError = (amount: string) => {
    const isMinError = !minValue ? false : +amount < +minValue;
    const isMaxError = !maxValue ? false : +amount > +maxValue;

    setHasMinError(isMinError);

    if (isMinError || isMaxError) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  };

  const onSelectAmount = (e: React.MouseEvent<HTMLDivElement>) => {
    const itemId = e.currentTarget.dataset.id;
    const currentAmount = amount ? parseInt(amount, 10) : 0;
    const selectedValue = parseInt(itemId!, 10);
    const newTotal = (currentAmount + selectedValue).toString();

    const amountValue = newTotal.length <= MAX_LENGTH ? newTotal : amount;
    checkError(amountValue);
    setSelectedAmount(itemId);
    setAmount(amountValue);
  };

  const onChangeTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, validity } = e.target;

    if (!validity.valid) return;

    checkError(value);

    setAmount(value);
  };

  const textTooltip = () => {
    return (
      <Text fontSize="12px" noSelect>
        {t("FirstAddPaymentMethod")}
      </Text>
    );
  };

  const amountTabs = getAmountTabs();

  return (
    <div className={styles.amountContainer}>
      <div data-tooltip-id="iconTooltip">
        <div className={styles.tabsWrapper}>
          <Text
            fontWeight="700"
            fontSize="16px"
            className={styles.amountTitleMain}
          >
            {t("AmountSelection")}
          </Text>
          <div className={styles.amountTabItemsContainer}>
            {amountTabs.map((item) => (
              <TabItem
                key={item.id}
                data-id={item.id}
                label={item.name}
                isActive={selectedAmount === item.id}
                allowNoSelection
                onSelect={onSelectAmount}
                isDisabled={item.isDisabled}
                dataTestId={`tab_item_${item.id}`}
              />
            ))}
          </div>
        </div>
        <Text fontWeight={600} className={styles.amountTitle}>
          {t("Amount")}
        </Text>
        <FieldContainer
          isVertical
          errorMessage={
            hasMinError
              ? t("MinCurrency", {
                  currency: formatWalletCurrency!(+minValue!, 0),
                })
              : ""
          }
          hasError={hasError}
        >
          <TextInput
            value={amount}
            onChange={onChangeTextInput}
            pattern="^[1-9]\d*$"
            scale
            withBorder
            type={InputType.text}
            placeholder={t("EnterAmount")}
            isDisabled={isDisabled || !hasCustomerAccess}
            maxLength={MAX_LENGTH}
            testId="top_up_amount_input"
            hasError={hasError}
          />
          {recommendedAmount ? (
            <Text className={styles.recommendedAmount}>
              {t("RecommendedTopUpAmount", {
                amount: formatWalletCurrency!(+recommendedAmount, 0),
              })}
            </Text>
          ) : null}
        </FieldContainer>
      </div>

      {!hasCustomerAccess ||
      (walletCustomerEmail && walletCustomerStatusNotActive) ? (
        <Tooltip
          id="iconTooltip"
          place="bottom"
          maxWidth="300px"
          float
          getContent={textTooltip}
          openOnClick={isMobile}
          dataTestId="amount_tooltip"
        />
      ) : null}
    </div>
  );
};

export default Amount;

