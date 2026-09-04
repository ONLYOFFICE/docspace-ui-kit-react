import React from "react";
import { observer } from "mobx-react";

import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { useCommonTranslation } from "../../../utils/i18n";
import { Text } from "../../../components/text";
import { Link } from "../../../components/link";
import { toastr } from "../../../components/toast";
import PluginIncompatibleSvg from "../../../assets/plugin.incompatible.react.svg";
import { toAbsoluteUrl } from "../../utils/url";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import styles from "./UnlinkedCardBanner.module.scss";

const UnlinkedCardBanner = () => {
  const t = useCommonTranslation();
  const { isPayer, cardLinked, tariff } = usePaymentStore();
  const { walletCustomerEmail } = tariff;

  const goLinkCard = () => {
    cardLinked
      ? window.open(toAbsoluteUrl(cardLinked), "_self")
      : toastr.error(t("UnexpectedError"));
  };

  return (
    <div className={styles.banner}>
      <PluginIncompatibleSvg className={styles.icon} />
      <Text as="span" fontSize="12px" lineHeight="16px" className={styles.text}>
        {isPayer ? (
          <CommonTrans
            i18nKey="PaymentMethodUnlinkedBanner"
            components={{
              1: <Text as="span" fontWeight={600} />,
              2: (
                <Link
                  as="span"
                  onClick={goLinkCard}
                  color="accent"
                  textDecoration="underline"
                  fontWeight={600}
                />
              ),
            }}
          />
        ) : (
          <CommonTrans
            i18nKey="PaymentMethodUnlinkedEmailBanner"
            values={{ email: walletCustomerEmail }}
            components={{
              1: <Text as="span" fontWeight={600} />,
              2: (
                <Link
                  href={`mailto:${walletCustomerEmail}`}
                  color="accent"
                  textDecoration="underline"
                />
              ),
            }}
          />
        )}
      </Text>
    </div>
  );
};

export default observer(UnlinkedCardBanner);

