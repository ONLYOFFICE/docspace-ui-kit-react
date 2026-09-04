import { observer } from "mobx-react";

import { Text } from "../../../components/text";
import { Tooltip } from "../../../components/tooltip";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { formatterCurrencyWithoutTranction } from "../../wallet/utils";

export const MIN_DISPLAYED_AMOUNT = 0.01;

type SpendAmountProps = {
  amount: number;
  currency?: string;
  tooltipId: string;
  className?: string;
  fontSize?: string;
  fontWeight?: number;
};

/**
 * Renders a spent amount. A charge smaller than one cent would be truncated to
 * a plain 0.00, so it is shown as "<0.01" with the exact value in a tooltip.
 */
const SpendAmount = ({
  amount,
  currency,
  tooltipId,
  className,
  fontSize = "13px",
  fontWeight = 600,
}: SpendAmountProps) => {
  const { walletCodeCurrency, formatWalletCurrency, language } =
    usePaymentStore();

  const amountCurrency = currency || walletCodeCurrency;

  if (amount <= 0 || amount >= MIN_DISPLAYED_AMOUNT)
    return (
      <Text fontSize={fontSize} fontWeight={fontWeight} className={className}>
        {formatWalletCurrency(amount, 2, amountCurrency)}
      </Text>
    );

  return (
    <>
      <Text
        fontSize={fontSize}
        fontWeight={fontWeight}
        className={className}
        data-tooltip-id={tooltipId}
      >
        {`<${formatWalletCurrency(MIN_DISPLAYED_AMOUNT, 2, amountCurrency)}`}
      </Text>
      <Tooltip
        id={tooltipId}
        place="top-end"
        getContent={() => (
          <Text fontSize="12px" noSelect>
            {formatterCurrencyWithoutTranction(language, amount, amountCurrency)}
          </Text>
        )}
        dataTestId={`${tooltipId}_tooltip`}
      />
    </>
  );
};

export default observer(SpendAmount);
