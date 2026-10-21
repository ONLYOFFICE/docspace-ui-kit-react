import React, { useMemo } from "react";

import classNames from "classnames";

import { Text } from "../../../components/text";
import { Tooltip } from "../../../components/tooltip";
import { truncateNumberToFraction } from "../../utils/common";
import { formatterCurrencyWithoutTranction } from "../../wallet/utils";
import RefreshIconButton from "../refresh-icon-button";
import styles from "./BalanceAmount.module.scss";

type BalanceAmountToken = {
  type: string;
  value: string;
};

type BalanceAmountProps = {
  title?: React.ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  progressText?: string;
  isProgressTextVisible?: boolean;
  showRefresh?: boolean;
  amount?: number;
  currency?: string;
  language?: string;
  maximumFractionDigits?: number;
  className?: string;
  withoutMargin?: boolean;
  mainFontSize?: string;
  fractionFontSize?: string;
  titleFontSize?: string;
  tooltipId?: string;
};

const typeClassMap: Record<string, string> = {
  integer: "integer",
  group: "group",
  decimal: "decimal",
  fraction: "fraction",
  currency: "currency",
  literal: "literal",
};

const BalanceAmount = (props: BalanceAmountProps) => {
  const {
    title,
    onRefresh,
    isRefreshing = false,
    progressText,
    isProgressTextVisible = false,
    showRefresh = true,
    amount = 0,
    currency = "USD",
    language = "en",
    maximumFractionDigits = 2,
    className,
    withoutMargin = false,
    mainFontSize,
    fractionFontSize,
    titleFontSize = "18px",
    tooltipId,
  } = props;

  const minDisplayedAmount = 1 / 10 ** maximumFractionDigits;
  const isBelowMinimum =
    tooltipId !== undefined && amount > 0 && amount < minDisplayedAmount;

  const tokens: BalanceAmountToken[] = useMemo(() => {
    const safeAmount = Number.isFinite(amount) ? amount : 0;

    const truncatedStr = truncateNumberToFraction(
      isBelowMinimum ? minDisplayedAmount : safeAmount,
      maximumFractionDigits,
    );
    const truncated = Number(truncatedStr);

    const formatter = new Intl.NumberFormat(language, {
      style: "currency",
      currency,
      minimumFractionDigits: maximumFractionDigits,
      maximumFractionDigits,
    });

    return formatter.formatToParts(truncated);
  }, [
    amount,
    currency,
    language,
    maximumFractionDigits,
    isBelowMinimum,
    minDisplayedAmount,
  ]);

  return (
    <div className={className}>
      {title ? (
        <div className={styles.headerContainer}>
          <div className={styles.titleRow}>
            <Text isBold fontSize={titleFontSize} className={styles.title}>
              {title}
            </Text>

            {showRefresh && onRefresh ? (
              <RefreshIconButton
                onRefresh={onRefresh}
                isRefreshing={isRefreshing}
              />
            ) : null}
          </div>

          {progressText ? (
            <Text
              fontWeight={600}
              className={classNames(styles.progressText, {
                [styles.progressTextHidden]: !isProgressTextVisible,
              })}
            >
              {progressText}
            </Text>
          ) : null}
        </div>
      ) : null}

      <div
        className={classNames(styles.balanceAmountContainer, {
          [styles.withoutMargin]: withoutMargin,
          [styles.tooltipAnchor]: isBelowMinimum,
        })}
        style={{
          ...(mainFontSize &&
            ({
              "--balance-main-font-size": mainFontSize,
            } as React.CSSProperties)),
          ...(fractionFontSize &&
            ({
              "--balance-fraction-font-size": fractionFontSize,
            } as React.CSSProperties)),
        }}
        data-tooltip-id={isBelowMinimum ? tooltipId : undefined}
      >
        {isBelowMinimum ? <Text className={styles.literal}>{"<"}</Text> : null}
        {tokens.map((token) => (
          <Text
            key={`${token.type}-${token.value}`}
            className={styles[typeClassMap[token.type]] || ""}
          >
            {token.value}
          </Text>
        ))}
      </div>

      {isBelowMinimum ? (
        <Tooltip
          id={tooltipId}
          place="top-end"
          getContent={() => (
            <Text fontSize="12px" noSelect>
              {formatterCurrencyWithoutTranction(language, amount, currency)}
            </Text>
          )}
          dataTestId={`${tooltipId}_tooltip`}
        />
      ) : null}
    </div>
  );
};

export default BalanceAmount;
