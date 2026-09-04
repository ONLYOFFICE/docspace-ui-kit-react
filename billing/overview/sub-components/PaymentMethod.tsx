import { observer } from "mobx-react";
import classNames from "classnames";

import { Text } from "../../../components/text";
import { Link } from "../../../components/link";
import { Avatar, AvatarRole, AvatarSize } from "../../../components/avatar";
import { useCommonTranslation } from "../../../utils/i18n";
import { Encoder } from "../../../utils/encoder";
import { useApi } from "../../../providers/api";

import { usePaymentStore } from "../../store/PaymentStoreProvider";

import CardIcon from "../../../assets/icons/16/card.react.svg";
import CheckIcon from "../../../assets/check.edit.react.svg";
import AlertIcon from "../../../assets/plugin.incompatible.react.svg";

import styles from "../Overview.module.scss";

type PaymentMethodProps = {
  onManagePaymentMethod?: () => void;
};

const PaymentMethod = ({ onManagePaymentMethod }: PaymentMethodProps) => {
  const t = useCommonTranslation();
  const { baseUrl } = useApi();
  const store = usePaymentStore();
  const { isCardLinkedToPortal } = store;

  const {
    walletCustomerEmail,
    walletCustomerInfo: payerInfo,
    walletCustomerStatusNotActive,
  } = store.tariff;

  const isInactive = walletCustomerStatusNotActive;

  const avatarSource =
    payerInfo?.hasAvatar && payerInfo.avatar
      ? `${baseUrl}${payerInfo.avatar}`
      : "default_user_photo";

  const payerName = payerInfo
    ? Encoder.htmlDecode(payerInfo.displayName ?? "")
    : walletCustomerEmail;

  const payerRow = (
    <div className={styles.pmRow}>
      <Avatar
        role={AvatarRole.none}
        size={AvatarSize.min}
        source={avatarSource}
        isDefaultSource
        userName={payerInfo?.displayName ?? undefined}
      />
      <div className={styles.pmInfo}>
        <Text fontSize="14px" fontWeight={600} truncate>
          {payerName}
        </Text>
        <Text fontSize="12px" className={styles.mutedTitle} truncate>
          {walletCustomerEmail}
        </Text>
      </div>
      <Text fontSize="13px" fontWeight={600} className={styles.pmPayerLabel}>
        {t("Payer")}
      </Text>
    </div>
  );

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Text fontSize="14px" fontWeight={700}>
          {t("PaymentMethod")}
        </Text>
        {onManagePaymentMethod ? (
          <Link
            onClick={onManagePaymentMethod}
            textDecoration="underline"
            color="accent"
            fontWeight={600}
            dataTestId="overview_manage_payment_method_link"
          >
            {isInactive ? t("AddPaymentMethod") : t("Manage")}
          </Link>
        ) : null}
      </div>

      {!isCardLinkedToPortal ? (
        <div className={classNames(styles.emptyState, styles.cardBody)}>
          <div className={styles.emptyContent}>
            <Text
              fontSize="12px"
              fontWeight={600}
              className={styles.mutedTitle}
            >
              {t("NoPaymentMethod")}
            </Text>
            <Text fontSize="12px" className={styles.mutedTitle}>
              {t("NoPaymentMethodDesc")}
            </Text>
          </div>
        </div>
      ) : (
        <div className={classNames(styles.pmSection, styles.cardBody)}>
          <div className={styles.pmRow}>
            <CardIcon className={styles.pmCardIcon} />
            <div className={styles.pmInfo}>
              <Text
                fontSize="14px"
                fontWeight={600}
                className={isInactive ? styles.pmErrorTitle : undefined}
              >
                {isInactive
                  ? t("PaymentMethodUnlinked")
                  : t("PaymentMethodLinked")}
              </Text>
              <Text fontSize="12px" className={styles.mutedTitle}>
                {t("PaymentMethodDetailsStripe")}
              </Text>
            </div>
            {isInactive ? (
              <AlertIcon className={styles.pmStatusIcon} />
            ) : (
              <CheckIcon className={styles.pmCheckIcon} />
            )}
          </div>

          <div className={styles.pmDivider} />

          {payerRow}
        </div>
      )}
    </div>
  );
};

export default observer(PaymentMethod);

