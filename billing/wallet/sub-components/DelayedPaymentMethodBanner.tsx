import React from "react";

import { useCommonTranslation } from "../../../utils/i18n";
import { Text } from "../../../components/text";
import CheckRoundSvg from "../../../assets/icons/16/check.round.react.svg";
import styles from "../styles/Wallet.module.scss";

const DelayedPaymentMethodBanner = () => {
  const t = useCommonTranslation();

  return (
    <div
      className={styles.autoPaymentBanner}
      data-testid="delayed_payment_method_banner"
    >
      <CheckRoundSvg className={styles.autoPaymentBannerIcon} />
      <Text
        as="span"
        fontSize="12px"
        lineHeight="16px"
        className={styles.autoPaymentBannerText}
      >
        {t("WalletDelayedPaymentMethodBanner")}
      </Text>
    </div>
  );
};

export default DelayedPaymentMethodBanner;

