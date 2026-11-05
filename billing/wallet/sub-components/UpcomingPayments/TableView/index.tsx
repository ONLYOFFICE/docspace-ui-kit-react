import React, { useMemo } from "react";
import { observer } from "mobx-react";

import {
  DataTable,
  createLocalStorageWidths,
  type DataTableColumn,
} from "../../../../../components/data-table";
import { Text } from "../../../../../components/text";
import { Link } from "../../../../../components/link";
import { useCommonTranslation } from "../../../../../utils/i18n";

import { usePaymentStore } from "../../../../store/PaymentStoreProvider";
import type { TUpcomingPayment } from "../../../../types";
import { getServiceQuantity } from "../../../utils";

import styles from "./UpcomingPaymentsTable.module.scss";

const COLUMN_WIDTHS = "upcomingPaymentsColumnsWidths_ver-1";

const getRowKey = (payment: TUpcomingPayment) => payment.id;

const CellText = ({ children }: { children: React.ReactNode }) => (
  <Text fontSize="12px" fontWeight={600} className={styles.cellText}>
    {children}
  </Text>
);

const ActionCell = ({ payment }: { payment: TUpcomingPayment }) => {
  const t = useCommonTranslation();
  const { actionType, actionRoute } = payment;

  const actionLabel =
    actionType === "edit-plan"
      ? t("EditPlan")
      : actionType === "edit-subscription"
        ? t("EditSubscription")
        : "";

  if (!actionLabel) return null;

  return (
    <Link
      fontSize="12px"
      fontWeight={600}
      textDecoration="underline"
      onClick={() => {
        if (actionRoute) window.DocSpace?.navigate(actionRoute);
      }}
      className={styles.actionLink}
    >
      {actionLabel}
    </Link>
  );
};

const TableView = () => {
  const t = useCommonTranslation();
  const { upcomingPayments, formatWalletCurrency, userId, language } =
    usePaymentStore();

  const columns = useMemo<DataTableColumn<TUpcomingPayment>[]>(
    () => [
      {
        id: "RenewalDate",
        title: t("RenewalDate"),
        width: { type: "fill" },
        cell: (payment) => <CellText>{payment.renewalDate}</CellText>,
      },
      {
        id: "Type",
        title: t("Type"),
        width: { type: "flex", min: 160 },
        cell: (payment) => <CellText>{payment.title}</CellText>,
      },
      {
        id: "Details",
        title: t("Details"),
        width: { type: "flex", min: 140 },
        cell: (payment) => (
          <CellText>
            {getServiceQuantity(
              t,
              language,
              payment.quantity,
              payment.unitOfMeasure,
            )}
          </CellText>
        ),
      },
      {
        id: "Amount",
        title: t("Amount"),
        width: { type: "flex", min: 120 },
        cell: (payment) => (
          <CellText>{formatWalletCurrency(payment.amount, 2)}</CellText>
        ),
      },
      {
        id: "Action",
        title: "",
        width: { type: "flex", min: 120 },
        resizable: false,
        cell: (payment) => <ActionCell payment={payment} />,
      },
    ],
    [t, language, formatWalletCurrency],
  );

  const widthStorage = useMemo(
    () => createLocalStorageWidths(`${COLUMN_WIDTHS}=${userId}`),
    [userId],
  );

  return (
    <DataTable<TUpcomingPayment>
      ariaLabel={t("UpcomingPayments")}
      columns={columns}
      rows={upcomingPayments}
      getRowKey={getRowKey}
      widthStorage={widthStorage}
      className={styles.table}
    />
  );
};

export default observer(TableView);
