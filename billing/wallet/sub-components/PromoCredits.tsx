import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react";
import classNames from "classnames";

import { useCommonTranslation } from "../../../utils/i18n";
import { Text } from "../../../components/text";
import ClockIcon from "../../../assets/icons/12/clock.outline.react.svg";
import { formatBillingDate, formatRemainingDays } from "../../utils/common";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import styles from "../styles/Wallet.module.scss";

const LEAVE_DURATION_MS = 250;

type PromoCreditsProps = {
  animate?: boolean;
  leaving?: boolean;
  onLeft?: () => void;
};

const PromoCredits = ({
  animate = false,
  leaving = false,
  onLeft,
}: PromoCreditsProps) => {
  const t = useCommonTranslation();
  const {
    formatWalletCurrency,
    language,
    hasPromoCredits,
    walletBalance,
    promoBalance,
    promoGranted,
    promoDaysLeft,
    nextExpiringPromoLot,
    isPromoExpiringSoon,
  } = usePaymentStore();

  const current = {
    walletBalance,
    promoBalance,
    promoGranted,
    promoDaysLeft,
    nextExpiringPromoLot,
    isPromoExpiringSoon,
  };
  const shown = useRef(current);
  if (!leaving && hasPromoCredits) shown.current = current;
  const view = shown.current;

  useEffect(() => {
    if (!leaving) return;

    const timerId = window.setTimeout(() => onLeft?.(), LEAVE_DURATION_MS);
    return () => window.clearTimeout(timerId);
  }, [leaving, onLeft]);

  const percent =
    view.promoGranted > 0
      ? Math.min(
          100,
          Math.max(0, (view.promoBalance / view.promoGranted) * 100),
        )
      : 0;

  const remaining = formatWalletCurrency(view.promoBalance, 2);
  const granted = formatWalletCurrency(view.promoGranted, 2);

  const expiryDate = view.nextExpiringPromoLot
    ? formatBillingDate(view.nextExpiringPromoLot.expiresAt, language)
    : null;

  const expiry = expiryDate
    ? t("PromoCreditsExpiresIn", {
        date: expiryDate,
        remaining: formatRemainingDays(view.promoDaysLeft, language, t),
      })
    : null;

  return (
    <div
      className={classNames(styles.promoCredits, {
        [styles.promoCreditsAnimated]: animate && !leaving,
        [styles.promoCreditsLeaving]: leaving,
      })}
      data-testid="wallet_promo_credits"
    >
      <div className={styles.promoCreditsBody}>
        <div className={styles.creditsRow}>
          <Text fontSize="13px" lineHeight="20px">
            {t("PurchasedCredits")}
          </Text>
          <Text fontSize="13px" lineHeight="20px" fontWeight={600}>
            {formatWalletCurrency(view.walletBalance, 2)}
          </Text>
        </div>

        <div className={styles.promoBox}>
          <div className={styles.creditsRow}>
            <Text fontSize="13px" lineHeight="20px">
              {t("PromoCredits")}
            </Text>
            <div className={styles.promoAmount}>
              <Text fontSize="13px" lineHeight="20px" fontWeight={600}>
                {remaining}
              </Text>
              <Text
                fontSize="11px"
                lineHeight="16px"
                className={styles.promoGranted}
              >
                {t("PromoCreditsOf", { granted })}
              </Text>
            </div>
          </div>

          <div
            className={styles.promoBar}
            role="meter"
            aria-label={t("PromoCredits")}
            aria-valuemin={0}
            aria-valuemax={view.promoGranted}
            aria-valuenow={view.promoBalance}
            aria-valuetext={`${remaining} / ${granted}`}
          >
            <div
              className={styles.promoBarFill}
              style={{ width: `${percent}%` }}
            />
          </div>

          {expiry ? (
            <div
              className={classNames(styles.promoExpiry, {
                [styles.promoExpiryWarning]: view.isPromoExpiringSoon,
              })}
            >
              <ClockIcon className={styles.promoExpiryIcon} />
              <Text fontSize="11px" lineHeight="16px">
                {expiry}
              </Text>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default observer(PromoCredits);
