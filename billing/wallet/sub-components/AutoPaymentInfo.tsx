import React from "react";
import { observer } from "mobx-react";

import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { Text } from "../../../components/text";
import CheckRoundSvg from "../../../assets/icons/16/check.round.react.svg";
import styles from "../styles/Wallet.module.scss";
import { usePaymentStore } from "../../store/PaymentStoreProvider";

const AutoPaymentInfo = () => {
  const paymentStore = usePaymentStore();

  const { autoPayments, formatWalletCurrency } = paymentStore;

  const minBalance = autoPayments?.minBalance ?? 0;
  const upToBalance = autoPayments?.upToBalance ?? 0;

  return (
    <div className={styles.autoPaymentBanner}>
      <CheckRoundSvg className={styles.autoPaymentBannerIcon} />
      <Text
        as="span"
        fontSize="12px"
        lineHeight="16px"
        className={styles.autoPaymentBannerText}
      >
        <CommonTrans
          i18nKey="AutoTopUpBanner"
          values={{
            min: formatWalletCurrency!(minBalance, 0),
            max: formatWalletCurrency!(upToBalance, 0),
          }}
          components={{
            1: <Text as="span" fontWeight={600} />,
          }}
        />
      </Text>
    </div>
  );
};

export default observer(AutoPaymentInfo);

