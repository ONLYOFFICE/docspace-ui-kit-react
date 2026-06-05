import React, { useMemo } from "react";

import classNames from "classnames";

import { Text } from "../../../components/text";
import { truncateNumberToFraction } from "../../utils/common";
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
  } = props;

  const tokens: BalanceAmountToken[] = useMemo(() => {
    const safeAmount = Number.isFinite(amount) ? amount : 0;

    const truncatedStr = truncateNumberToFraction(
      safeAmount,
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
  }, [amount, currency, language, maximumFractionDigits]);

  return (
    <div className={className}>
      {title ? (
        <div className={styles.headerContainer}>
          <Text isBold fontSize={titleFontSize}>
            {title}
          </Text>

          {showRefresh && onRefresh ? (
            <RefreshIconButton
              onRefresh={onRefresh}
              isRefreshing={isRefreshing}
            />
          ) : null}

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
      >
        {tokens.map((token) => (
          <Text
            key={`${token.type}-${token.value}`}
            className={styles[typeClassMap[token.type]] || ""}
          >
            {token.value}
          </Text>
        ))}
      </div>
    </div>
  );
};

export default BalanceAmount;

