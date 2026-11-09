import React, { useMemo } from "react";
import { observer } from "mobx-react";
import classNames from "classnames";

import {
  DataTable,
  createLocalStorageWidths,
  type DataTableColumn,
} from "../../../../../components/data-table";
import { Text } from "../../../../../components/text";
import { useCommonTranslation } from "../../../../../utils/i18n";
import { Encoder } from "../../../../../utils/encoder";
import { getCorrectDate } from "../../../../../utils/date/getCorrectDate";

import type { WalletOperationDto } from "../../../../store/PaymentStore";
import { usePaymentStore } from "../../../../store/PaymentStoreProvider";
import {
  accountingLedgersFormat,
  getServiceQuantity,
} from "../../../../wallet/utils";
import { getTransactionSourceLabel, hasTransactionSource } from "../../utils";
import { TokenUsageAnchor } from "../TokenUsage";

import styles from "../../styles/TransactionHistory.module.scss";

const COLUMN_WIDTHS = "walletColumnsWidths_ver-1";

type TransactionHistoryProps = {
  serviceName?: string;
};

const getRowKey = (transaction: WalletOperationDto, index: number) =>
  `transaction-${index}-${transaction.date ?? ""}`;

const CellText = ({
  children,
  ...props
}: React.ComponentProps<typeof Text>) => (
  <Text fontWeight={600} fontSize="11px" {...props}>
    {children}
  </Text>
);

const TableView = ({ serviceName }: TransactionHistoryProps) => {
  const t = useCommonTranslation();
  const { transactionHistory, userId, language } = usePaymentStore();
  const history = transactionHistory ?? [];

  const columns = useMemo<DataTableColumn<WalletOperationDto>[]>(
    () => [
      {
        id: "Date",
        title: t("Date"),
        cellClassName: styles.cell,
        // Not "fill": the old header had no default column here, so every
        // column got an even share and Type did not wrap.
        width: { type: "flex", min: 150 },
        cell: (transaction) => (
          <CellText dataTestId="transaction_date">
            {getCorrectDate(language, transaction.date)}
          </CellText>
        ),
      },
      ...(hasTransactionSource(serviceName)
        ? [
            {
              id: "Source",
              title: t("Source"),
              cellClassName: styles.cell,
              width: { type: "flex", min: 150 },
              cell: (transaction) => (
                <CellText>
                  {getTransactionSourceLabel(t, transaction) ?? "—"}
                </CellText>
              ),
            } satisfies DataTableColumn<WalletOperationDto>,
          ]
        : []),
      {
        id: "Type",
        title: t("Type"),
        cellClassName: styles.cell,
        width: { type: "flex", min: 120 },
        cell: (transaction) => (
          <CellText as="span" className={styles.transactionRowDescription}>
            {transaction.description}
            {transaction.details ? ` (${transaction.details})` : ""}
          </CellText>
        ),
      },
      {
        id: "Contact",
        title: t("Contact"),
        cellClassName: styles.cell,
        width: { type: "flex", min: 120 },
        cell: (transaction) => (
          <CellText>
            {transaction.participantDisplayName
              ? Encoder.htmlDecode(transaction.participantDisplayName)
              : "—"}
          </CellText>
        ),
      },
      {
        id: "Quantity",
        title: t("Quantity"),
        cellClassName: styles.cell,
        width: { type: "flex", min: 150 },
        cell: (transaction) => (
          <TokenUsageAnchor usage={transaction.tokenUsage}>
            <CellText>
              {getServiceQuantity(
                t,
                language,
                transaction.quantity ?? 0,
                transaction.serviceUnit ?? undefined,
              )}
            </CellText>
          </TokenUsageAnchor>
        ),
      },
      {
        id: "Amount",
        title: t("Amount"),
        cellClassName: styles.cell,
        width: { type: "flex", min: 120 },
        cell: ({ credit, debit, currency }) => {
          const isCredit = (credit ?? 0) > 0;
          return (
            <CellText
              className={classNames({
                [styles.transactionRowAmountCredit]: isCredit,
              })}
            >
              {accountingLedgersFormat(
                language,
                credit || debit || 0,
                isCredit,
                currency ?? "",
              )}
            </CellText>
          );
        },
      },
    ],
    [t, language, serviceName],
  );

  const widthStorage = useMemo(
    () => createLocalStorageWidths(`${COLUMN_WIDTHS}=${userId}`),
    [userId],
  );

  return (
    <div className={styles.transactionHistoryBody}>
      <DataTable<WalletOperationDto>
        ariaLabel={t("TransactionHistory")}
        columns={columns}
        rows={history}
        getRowKey={getRowKey}
        widthStorage={widthStorage}
        className={styles.table}
      />
    </div>
  );
};

export default observer(TableView);
