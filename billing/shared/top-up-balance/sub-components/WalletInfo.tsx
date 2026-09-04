import React from "react";
import { observer } from "mobx-react";
import { useCommonTranslation } from "../../../../utils/i18n";
import { CommonTrans } from "../../../../utils/i18n/CommonTrans";
import classNames from "classnames";

import { Text } from "../../../../components/text";
import { Button, ButtonSize } from "../../../../components/button";
import { IconButton } from "../../../../components/icon-button";

import WalletIcon from "../../../../assets/icons/16/wallet.react.svg";
import ExternalLinkIcon from "../../../../assets/external.link.svg";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { toAbsoluteUrl } from "../../../utils/url";

import styles from "../styles/TopUpModal.module.scss";

type WalletInfoProps = {
  balance?: string;
  onTopUp?: () => void;
  isBalanceInsufficient?: boolean;
  title?: string;
  icon?: React.ReactNode;
  shortView?: boolean;
  withoutBackground?: boolean;
  withOpenBilling?: boolean;
};

const WalletInfo = (props: WalletInfoProps) => {
  const {
    balance,
    onTopUp,
    isBalanceInsufficient,
    title,
    icon,
    shortView,
    withoutBackground,
    withOpenBilling,
  } = props;
  const t = useCommonTranslation();
  const { isPayer, routes } = usePaymentStore();

  const walletRoute = routes?.wallet;
  const showOpenBilling = withOpenBilling && !!walletRoute;
  const onOpenWallet = () =>
    window.open(toAbsoluteUrl(walletRoute ?? ""), "_blank");

  const keyProp = isBalanceInsufficient
    ? { tKey: "AvailableCreditsInsufficient" }
    : { tKey: "AvailableCreditsAmount" };

  return (
    <div
      className={classNames(styles.walletInfoContainer, {
        [styles.shortView]: shortView,
        [styles.withoutBackground]: withoutBackground,
      })}
    >
      <div className={styles.walletInfoIcon}>{icon ?? <WalletIcon />}</div>
      <div className={styles.walletInfoBody}>
        <Text
          className={styles.walletInfoTitle}
          fontWeight="600"
          fontSize="14px"
        >
          {title ?? t("Wallet")}
        </Text>
        <div
          className={classNames(styles.walletInfoBalance, {
            [styles.warningColor]: isBalanceInsufficient,
          })}
        >
          <CommonTrans
            i18nKey={keyProp.tKey}
            values={{ balance }}
            components={{
              1: isBalanceInsufficient ? (
                <Text key="balance-text" as="span" fontWeight={600} />
              ) : (
                <Text
                  key="balance-text"
                  fontWeight={600}
                  isInline
                  className={styles.balanceValue}
                />
              ),
            }}
          />
        </div>
      </div>
      <div className={styles.walletInfoActions}>
        {onTopUp && isPayer ? (
          <Button
            size={ButtonSize.small}
            label={t("TopUp")}
            onClick={onTopUp}
            testId="top_up_wallet_button"
          />
        ) : null}
        {showOpenBilling ? (
          <IconButton
            className={styles.walletInfoOpenBilling}
            iconNode={<ExternalLinkIcon />}
            size={16}
            isFill
            isClickable
            onClick={onOpenWallet}
            title={t("OpenPortalBilling")}
            dataTestId="open_wallet_button"
          />
        ) : null}
      </div>
    </div>
  );
};

export default observer(WalletInfo);

