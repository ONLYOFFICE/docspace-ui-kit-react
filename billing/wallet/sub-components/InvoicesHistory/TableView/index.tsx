import React, { useRef } from "react";
import { observer } from "mobx-react";

import { TableBody, TableContainer } from "../../../../../components/table";

import { usePaymentStore } from "../../../../store/PaymentStoreProvider";
import type { TInvoice } from "../../../../types";

import { getCorrectDate } from "../../../../../utils/date/getCorrectDate";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import styles from "../InvoicesHistory.module.scss";

const TABLE_VERSION = "1";
const COLUMNS_SIZE = `invoicesHistoryColumnsSize_ver-${TABLE_VERSION}`;
const INFO_PANEL_COLUMNS_SIZE = `infoPanelInvoicesHistoryColumnsSize_ver-${TABLE_VERSION}`;

type InvoicesHistoryTableViewProps = {
  sectionWidth: number;
  invoices: TInvoice[];
};

const TableView = ({
  sectionWidth,
  invoices,
}: InvoicesHistoryTableViewProps) => {
  const { formatWalletCurrency, userId, language } = usePaymentStore();

  const columnStorageName = `${COLUMNS_SIZE}=${userId}`;
  const columnInfoPanelStorageName = `${INFO_PANEL_COLUMNS_SIZE}=${userId}`;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <TableContainer
      forwardedRef={ref as React.RefObject<HTMLDivElement>}
      useReactWindow={false}
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
        useReactWindow={false}
        columnStorageName={columnStorageName}
        columnInfoPanelStorageName={columnInfoPanelStorageName}
        itemHeight={48}
        filesLength={invoices.length}
        fetchMoreFiles={() => Promise.resolve()}
        hasMoreFiles={false}
        itemCount={invoices.length}
      >
        {invoices.map((invoice) => (
          <TableRow
            key={invoice.id}
            date={getCorrectDate(language, invoice.date)}
            amount={formatWalletCurrency(invoice.amount, 2, invoice.currency)}
            url={invoice.url}
          />
        ))}
      </TableBody>
    </TableContainer>
  );
};

export default observer(TableView);
