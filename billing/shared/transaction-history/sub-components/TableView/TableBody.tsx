import React from "react";
import { observer } from "mobx-react";
import { useCommonTranslation } from "../../../../../utils/i18n";
import classNames from "classnames";

import { TableRow, TableCell } from "../../../../../components/table";
import { Text } from "../../../../../components/text";
import type { WalletOperationDto } from "../../../../store/PaymentStore";
import { Encoder } from "../../../../../utils/encoder";

import { getCorrectDate } from "../../../../../utils/date/getCorrectDate";
import styles from "../../styles/TransactionHistory.module.scss";
import {
  accountingLedgersFormat,
  getServiceQuantity,
} from "../../../../wallet/utils";
import { usePaymentStore } from "../../../../store/PaymentStoreProvider";
import { AI_TOOLS } from "../../../../constants";
import { getTransactionSourceLabel } from "../../utils";

interface TransactionRowProps {
  transaction: WalletOperationDto;
  serviceName?: string;
}

const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  serviceName,
}) => {
  const paymentStore = usePaymentStore();
  const { language } = paymentStore;
  const { credit, debit, currency } = transaction;
  const t = useCommonTranslation();
  const creditValue = credit ?? 0;
  const debitValue = debit ?? 0;

  const isCredit = creditValue > 0;

  const formattedAmount = accountingLedgersFormat(
    language,
    creditValue || debitValue,
    isCredit,
    currency ?? "",
  );

  const correctDate = getCorrectDate(language, transaction.date);

  return (
    <TableRow>
      <TableCell>
        <Text fontWeight={600} fontSize="11px" dataTestId="transaction_date">
          {correctDate}
        </Text>
      </TableCell>
      {serviceName === AI_TOOLS ? (
        <TableCell>
          <Text fontWeight={600} fontSize="11px">
            {getTransactionSourceLabel(t, transaction) ?? "—"}
          </Text>
        </TableCell>
      ) : null}
      <TableCell>
        <Text
          fontWeight={600}
          fontSize="11px"
          as="span"
          className={styles.transactionRowDescription}
        >
          {transaction.description}
          {transaction.details ? ` (${transaction.details})` : ""}
        </Text>
      </TableCell>

      <TableCell>
        <Text fontWeight={600} fontSize="11px">
          {transaction.participantDisplayName
            ? Encoder.htmlDecode(transaction.participantDisplayName)
            : "—"}
        </Text>
      </TableCell>
      <TableCell>
        <Text fontWeight={600} fontSize="11px">
          {getServiceQuantity(
            t,
            transaction.quantity ?? 0,
            transaction.serviceUnit ?? undefined,
          )}
        </Text>
      </TableCell>
      <TableCell>
        <Text
          fontWeight={600}
          fontSize="11px"
          className={classNames({
            [styles.transactionRowAmountCredit]: isCredit,
          })}
        >
          {formattedAmount}
        </Text>
      </TableCell>
    </TableRow>
  );
};

export default observer(TransactionRow);

