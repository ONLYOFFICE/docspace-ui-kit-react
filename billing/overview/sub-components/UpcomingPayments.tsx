import { observer } from "mobx-react";

import { Text } from "../../../components/text";
import { Link } from "../../../components/link";
import { useCommonTranslation } from "../../../utils/i18n";

import { usePaymentStore } from "../../store/PaymentStoreProvider";

import styles from "../Overview.module.scss";

type UpcomingPaymentsProps = {
  onUpcomingDetails?: () => void;
};

const UpcomingPayments = ({ onUpcomingDetails }: UpcomingPaymentsProps) => {
  const t = useCommonTranslation();
  const {
    upcomingPayments,
    walletCodeCurrency,
    formatWalletCurrency,
  } = usePaymentStore();

  const upcomingTotal = upcomingPayments.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Text fontSize="14px" fontWeight={700}>
          {t("UpcomingPayments")}
        </Text>
        {onUpcomingDetails ? (
          <Link
            onClick={onUpcomingDetails}
            textDecoration="underline"
            color="accent"
            fontWeight={600}
            dataTestId="overview_upcoming_details_link"
          >
            {t("Details")}
          </Link>
        ) : null}
      </div>
      <Text fontSize="18px" fontWeight={700} className={styles.cardValue}>
        {formatWalletCurrency(upcomingTotal, 2, walletCodeCurrency)}
      </Text>
      {upcomingPayments.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyContent}>
            <Text fontSize="12px" fontWeight={600} className={styles.mutedTitle}>
              {t("NoUpcomingPayments")}
            </Text>
            <Text fontSize="12px" className={styles.mutedTitle}>
              {t("NoUpcomingPaymentsDescription")}
            </Text>
          </div>
        </div>
      ) : (
        <div className={styles.upcomingList}>
          {upcomingPayments.map((item) => (
            <div className={styles.upcomingRow} key={item.id}>
              <Text
                fontSize="14px"
                fontWeight={600}
                className={styles.mutedTitle}
                truncate
                noSelect
              >
                {item.renewalDateShort}
              </Text>
              <Text fontSize="14px" fontWeight={600} truncate>
                {item.title}
              </Text>
              <Text
                fontSize="13px"
                fontWeight={600}
                className={styles.upcomingAmount}
              >
                {formatWalletCurrency(item.amount, 2, walletCodeCurrency)}
              </Text>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default observer(UpcomingPayments);

