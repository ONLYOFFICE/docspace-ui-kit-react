import React, { useRef } from "react";
import { observer } from "mobx-react";

import { TableBody, TableContainer } from "../../../../../components/table";

import { usePaymentStore } from "../../../../store/PaymentStoreProvider";
import type { TInvoice } from "../../../../types";

import { getCorrectDate } from "../../../../../utils/date/getCorrectDate";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import styles from "../InvoiceHistory.module.scss";

const TABLE_VERSION = "1";
const COLUMNS_SIZE = `invoiceHistoryColumnsSize_ver-${TABLE_VERSION}`;
const INFO_PANEL_COLUMNS_SIZE = `infoPanelInvoiceHistoryColumnsSize_ver-${TABLE_VERSION}`;

type InvoiceHistoryTableViewProps = {
  sectionWidth: number;
  invoices: TInvoice[];
  onOpenInvoice: (id: number) => void;
};

const TableView = ({
  sectionWidth,
  invoices,
  onOpenInvoice,
}: InvoiceHistoryTableViewProps) => {
  const {
    formatWalletCurrency,
    userId,
    language,
    invoicesTotal,
    hasMoreInvoices,
    fetchMoreInvoices,
  } = usePaymentStore();

  const columnStorageName = `${COLUMNS_SIZE}=${userId}`;
  const columnInfoPanelStorageName = `${INFO_PANEL_COLUMNS_SIZE}=${userId}`;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <TableContainer
      forwardedRef={ref as React.RefObject<HTMLDivElement>}
      useReactWindow
      className={styles.tableContainer}
    >
      <TableHeader
        sectionWidth={sectionWidth}
        containerRef={ref as React.RefObject<HTMLDivElement>}
        columnStorageName={columnStorageName}
        columnInfoPanelStorageName={columnInfoPanelStorageName}
        itemHeight={48}
      />
      <TableBody
        useReactWindow
        columnStorageName={columnStorageName}
        columnInfoPanelStorageName={columnInfoPanelStorageName}
        itemHeight={48}
        filesLength={invoices.length}
        fetchMoreFiles={fetchMoreInvoices}
        hasMoreFiles={hasMoreInvoices}
        itemCount={invoicesTotal}
      >
        {invoices.map((invoice) => (
          <TableRow
            key={invoice.id}
            date={getCorrectDate(language, invoice.date)}
            amount={formatWalletCurrency(invoice.amount, 2, invoice.currency)}
            hasInvoice={invoice.hasInvoice}
            onOpenInvoice={() => onOpenInvoice(invoice.id)}
          />
        ))}
      </TableBody>
    </TableContainer>
  );
};

export default observer(TableView);
