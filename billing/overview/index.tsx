import { useEffect } from "react";
import { observer } from "mobx-react";

import { Text } from "../../components/text";
import { Heading } from "../../components/heading";
import { useCommonTranslation } from "../../utils/i18n";

import { usePaymentStore } from "../store/PaymentStoreProvider";

import OverviewLoader from "./OverviewLoader";
import {
  AvailableCredits,
  CurrentPlan,
  MonthToDateSpend,
  UpcomingPayments,
  ActiveAddons,
  PaymentMethod,
} from "./sub-components";

import styles from "./Overview.module.scss";

type BillingOverviewProps = {
  isMobile?: boolean;
  /** Navigate to the tariff-plan section. */
  onEditPlan?: () => void;
  /** Navigate to the usage section. */
  onViewUsage?: () => void;
  /** Navigate to the add-ons section. */
  onManageAddons?: () => void;
  /** Navigate to the payment-method section. */
  onManagePaymentMethod?: () => void;
  /** Navigate to the wallet section (upcoming payments live there). */
  onUpcomingDetails?: () => void;
};

const BillingOverview = ({
  isMobile,
  onEditPlan,
  onViewUsage,
  onManageAddons,
  onManagePaymentMethod,
  onUpcomingDetails,
}: BillingOverviewProps) => {
  const t = useCommonTranslation();
  const { overviewInit, isInitOverviewPage } = usePaymentStore();

  useEffect(() => {
    overviewInit?.(t).catch((e: unknown) => console.error(e));
  }, []);

  return (
    <div className={styles.overviewRoot}>
      <div className={styles.header}>
        <Text fontSize="23px" fontWeight={700}>
          {t("Billing")}
        </Text>
        <Text className={styles.headerDescription}>
          {t("BillingOverviewDescription")}
        </Text>
      </div>

      {!isInitOverviewPage ? (
        <OverviewLoader />
      ) : (
        <>
          <AvailableCredits isMobile={isMobile} />

          <CurrentPlan onEditPlan={onEditPlan} isMobile={isMobile} />

          <div className={styles.grid2}>
            <MonthToDateSpend onViewUsage={onViewUsage} />
            <ActiveAddons onManageAddons={onManageAddons} />
          </div>

          <div className={styles.grid2}>
            <UpcomingPayments onUpcomingDetails={onUpcomingDetails} />
            <PaymentMethod onManagePaymentMethod={onManagePaymentMethod} />
          </div>
        </>
      )}
    </div>
  );
};

export default observer(BillingOverview);

