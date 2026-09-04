import React, { useRef } from "react";
import { observer } from "mobx-react";

import { TableBody, TableContainer } from "../../../../../components/table";

import styles from "../../styles/TransactionHistory.module.scss";
import TableHeader from "./TableHeader";
import TransactionRow from "./TableBody";
import { usePaymentStore } from "../../../../store/PaymentStoreProvider";

const TABLE_VERSION = "4";
const COLUMNS_SIZE = `walletColumnsSize_ver-${TABLE_VERSION}`;
const INFO_PANEL_COLUMNS_SIZE = `infoPanelWalletColumnsSize_ver-${TABLE_VERSION}`;

type TransactionHistoryProps = {
  sectionWidth: number;
  serviceName?: string;
};

const TableView = ({ sectionWidth, serviceName }: TransactionHistoryProps) => {
  const paymentStore = usePaymentStore();
  const history = paymentStore.transactionHistory ?? [];
  const userId = paymentStore.userId;
  const columnStorageName = `${COLUMNS_SIZE}=${userId}`;
  const columnInfoPanelStorageName = `${INFO_PANEL_COLUMNS_SIZE}=${userId}`;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.transactionHistoryBody}>
      <TableContainer
        forwardedRef={ref as React.RefObject<HTMLDivElement>}
        useReactWindow={false}
      >
        <TableHeader
          sectionWidth={sectionWidth}
          containerRef={ref as React.RefObject<HTMLDivElement>}
          columnStorageName={columnStorageName}
          columnInfoPanelStorageName={columnInfoPanelStorageName}
          itemHeight={48}
          serviceName={serviceName}
        />
        <TableBody
          useReactWindow={false}
          columnStorageName={columnStorageName}
          columnInfoPanelStorageName={columnInfoPanelStorageName}
          itemHeight={48}
          filesLength={history.length}
          fetchMoreFiles={() => Promise.resolve()}
          hasMoreFiles={false}
          itemCount={history.length}
        >
          {history.map((transaction, index) => (
            <TransactionRow
              transaction={transaction}
              key={`transaction-${index}-${transaction.date ?? ""}`}
              serviceName={serviceName}
            />
          ))}
        </TableBody>
      </TableContainer>
    </div>
  );
};

export default observer(TableView);

