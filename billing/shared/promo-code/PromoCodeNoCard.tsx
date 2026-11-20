import React from "react";

import { useCommonTranslation } from "../../../utils/i18n";
import { Text } from "../../../components/text";
import InfoIcon from "../../../assets/info.outline.react.svg";
import styles from "./PromoCodeField.module.scss";

const PromoCodeNoCard = () => {
  const t = useCommonTranslation();

  return (
    <div
      className={styles.promoCodeField}
      data-testid="wallet_promo_code_no_card"
    >
      <Text className={styles.description}>
        {t("PromoCodeNoCardDescription")}
      </Text>
      <div className={styles.notice}>
        <InfoIcon className={styles.noticeIcon} />
        <Text as="div">
          <Text as="span" fontWeight={600}>
            {t("PromoCodeNeedsCard")}
          </Text>
          <br />
          {t("PromoCodeNeedsCardDescription")}
        </Text>
      </div>
    </div>
  );
};

export default PromoCodeNoCard;
