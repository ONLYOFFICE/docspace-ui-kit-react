import React, { useRef } from "react";
import { observer } from "mobx-react";

import { TableBody, TableContainer } from "../../../../../components/table";
import { formatDateLocalized, getAppTimezone } from "../../../../../utils/date";

import { usePaymentStore } from "../../../../store/PaymentStoreProvider";

import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import styles from "./UpcomingPaymentsTable.module.scss";

const TABLE_VERSION = "1";
const COLUMNS_SIZE = `upcomingPaymentsColumnsSize_ver-${TABLE_VERSION}`;
const INFO_PANEL_COLUMNS_SIZE = `infoPanelUpcomingPaymentsColumnsSize_ver-${TABLE_VERSION}`;

type UpcomingPaymentsTableViewProps = {
  sectionWidth: number;
};

const TableView = ({ sectionWidth }: UpcomingPaymentsTableViewProps) => {
  const paymentStore = usePaymentStore();

  const { upcomingPayments, formatWalletCurrency, language, userId } =
    paymentStore;

  const columnStorageName = `${COLUMNS_SIZE}=${userId}`;
  const columnInfoPanelStorageName = `${INFO_PANEL_COLUMNS_SIZE}=${userId}`;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.tableWrapper}>
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
          filesLength={upcomingPayments.length}
          fetchMoreFiles={() => Promise.resolve()}
          hasMoreFiles={false}
          itemCount={upcomingPayments.length}
        >
          {upcomingPayments.map((payment) => (
            <TableRow
              key={payment.id}
              renewalDate={formatDateLocalized(
                payment.renewalDate,
                "DATE_FULL",
                {
                  locale: language,
                  timezone: getAppTimezone(),
                },
              )}
              type={payment.type}
              details={payment.details}
              amount={formatWalletCurrency(payment.amount, 2)}
              actionType={payment.actionType}
            />
          ))}
        </TableBody>
      </TableContainer>
    </div>
  );
};

export default observer(TableView);

