import React, { useMemo } from "react";
import { observer } from "mobx-react";

import {
  DataTable,
  createLocalStorageWidths,
  type DataTableColumn,
} from "../../../components/data-table";
import { Text } from "../../../components/text";
import { useCommonTranslation } from "../../../utils/i18n";
import { getCorrectDate } from "../../../utils/date/getCorrectDate";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import type { TInvoice } from "../../types";

import InvoiceLink from "../InvoiceLink";
import styles from "../InvoiceHistory.module.scss";

const COLUMN_WIDTHS = "invoiceHistoryColumnsWidths_ver-1";

type InvoiceHistoryTableViewProps = {
  invoices: TInvoice[];
  onOpenInvoice: (id: number) => void;
};

const getRowKey = (invoice: TInvoice) => invoice.id;

const TableView = ({
  invoices,
  onOpenInvoice,
}: InvoiceHistoryTableViewProps) => {
  const t = useCommonTranslation();
  const {
    formatWalletCurrency,
    userId,
    language,
    hasMoreInvoices,
    fetchMoreInvoices,
  } = usePaymentStore();

  const columns = useMemo<DataTableColumn<TInvoice>[]>(
    () => [
      {
        id: "Date",
        title: t("Date"),
        width: { type: "fill" },
        cell: (invoice) => (
          <Text
            fontSize="12px"
            fontWeight={600}
            className={styles.cellText}
            dataTestId="invoice_date"
          >
            {getCorrectDate(language, invoice.date)}
          </Text>
        ),
      },
      {
        id: "Amount",
        title: t("Amount"),
        width: { type: "flex", min: 120 },
        cell: (invoice) => (
          <Text fontSize="12px" fontWeight={600} className={styles.cellText}>
            {formatWalletCurrency(invoice.amount, 2, invoice.currency)}
          </Text>
        ),
      },
      {
        id: "Actions",
        title: t("Actions"),
        width: { type: "flex", min: 140 },
        cell: (invoice) =>
          invoice.hasInvoice ? (
            <InvoiceLink
              fontSize="12px"
              onOpen={() => onOpenInvoice(invoice.id)}
            />
          ) : null,
      },
    ],
    [t, language, formatWalletCurrency, onOpenInvoice],
  );

  const widthStorage = useMemo(
    () => createLocalStorageWidths(`${COLUMN_WIDTHS}=${userId}`),
    [userId],
  );

  const loadMore = useMemo(
    () => ({ hasMore: hasMoreInvoices, onLoadMore: fetchMoreInvoices }),
    [hasMoreInvoices, fetchMoreInvoices],
  );

  return (
    <DataTable<TInvoice>
      ariaLabel={t("InvoiceHistory")}
      columns={columns}
      rows={invoices}
      getRowKey={getRowKey}
      widthStorage={widthStorage}
      virtualize
      loadMore={loadMore}
      className={styles.table}
    />
  );
};

export default observer(TableView);
