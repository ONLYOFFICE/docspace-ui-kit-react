import React from "react";
import { observer } from "mobx-react";

import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { Text } from "../../../components/text";
import { formatBillingDate } from "../../utils/common";
import WarningIcon from "../../../assets/danger.toast.react.svg";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import styles from "../styles/Wallet.module.scss";

const PromoExpiryBanner = () => {
  const {
    nextExpiringPromoLot,
    isPromoExpiringSoon,
    formatWalletCurrency,
    language,
  } = usePaymentStore();

  if (!nextExpiringPromoLot || !isPromoExpiringSoon) return null;

  const amount = formatWalletCurrency(nextExpiringPromoLot.remaining, 2);
  const date = formatBillingDate(nextExpiringPromoLot.expiresAt, language);

  return (
    <div
      className={styles.promoExpiryBanner}
      data-testid="wallet_promo_expiry_banner"
    >
      <WarningIcon className={styles.promoExpiryBannerIcon} />
      <Text
        as="span"
        fontSize="12px"
        lineHeight="16px"
        className={styles.autoPaymentBannerText}
      >
        <CommonTrans
          i18nKey="PromoCreditsExpireWarning"
          values={{ amount, date }}
          components={{ 1: <Text as="span" fontWeight={600} /> }}
        />
      </Text>
    </div>
  );
};

export default observer(PromoExpiryBanner);
