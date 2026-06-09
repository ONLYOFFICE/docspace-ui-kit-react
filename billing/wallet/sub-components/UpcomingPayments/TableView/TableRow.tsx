import React from "react";

import { TableCell, TableRow } from "../../../../../components/table";
import { Text } from "../../../../../components/text";
import { Link } from "../../../../../components/link";
import { useCommonTranslation } from "../../../../../utils/i18n";

import type { TUpcomingPayment } from "../../../../types";
import { usePaymentStore } from "../../../../store/PaymentStoreProvider";

import styles from "./UpcomingPaymentsTable.module.scss";

type UpcomingPaymentRowProps = {
  renewalDate: string;
  type: string;
  details: string;
  amount: string;
  actionType?: TUpcomingPayment["actionType"];
};

const UpcomingPaymentRow: React.FC<UpcomingPaymentRowProps> = ({
  renewalDate,
  type,
  details,
  amount,
  actionType,
}) => {
  const store = usePaymentStore();
  const t = useCommonTranslation();

  const actionLabel =
    actionType === "edit-plan"
      ? t("EditPlan")
      : actionType === "edit-subscription"
        ? t("EditSubscription")
        : "";

  const onAction = () => {
    if (actionType === "edit-plan")
      window.DocSpace?.navigate(store.routes.portalPayments);
    else if (actionType === "edit-subscription")
      window.DocSpace?.navigate(store.routes.diskStorage);
  };

  return (
    <TableRow>
      <TableCell>
        <Text fontSize="12px" fontWeight={600} className={styles.cellText}>
          {renewalDate}
        </Text>
      </TableCell>
      <TableCell>
        <Text fontSize="12px" fontWeight={600} className={styles.cellText}>
          {type}
        </Text>
      </TableCell>
      <TableCell>
        <Text fontSize="12px" fontWeight={600} className={styles.cellText}>
          {details}
        </Text>
      </TableCell>
      <TableCell>
        <Text fontSize="12px" fontWeight={600} className={styles.cellText}>
          {amount}
        </Text>
      </TableCell>
      <TableCell>
        {actionLabel ? (
          <Link
            fontSize="12px"
            fontWeight={600}
            textDecoration="underline"
            onClick={onAction}
            className={styles.actionLink}
          >
            {actionLabel}
          </Link>
        ) : null}
      </TableCell>
    </TableRow>
  );
};

export default UpcomingPaymentRow;

