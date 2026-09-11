import React from "react";
import { observer } from "mobx-react";
import { useCommonTranslation } from "../../../../../utils/i18n";
import classNames from "classnames";

import { Text } from "../../../../../components/text";
import { Row, RowContent } from "../../../../../components/rows";
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

type TransactionRowViewProps = {
  transaction: WalletOperationDto;
  sectionWidth: number;
  serviceName?: string;
};

const TransactionRowView: React.FC<TransactionRowViewProps> = ({
  transaction,
  sectionWidth,
  serviceName,
}) => {
  const paymentStore = usePaymentStore();
  const { language } = paymentStore;
  const { credit, debit, currency, date } = transaction;
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

  const correctDate = getCorrectDate(language, date);

  const getRowChildren = () => {
    const children = [
      <div key="description">
        <Text
          fontWeight={600}
          fontSize="14px"
          as="span"
          className={styles.transactionRowDescription}
        >
          {transaction.description}
        </Text>
        {transaction.details ? (
          <Text fontWeight={600} fontSize="14px" as="span">
            ({transaction.details})
          </Text>
        ) : null}
      </div>,
      <div key="spacer" />,
      <Text
        key="date"
        fontWeight={600}
        fontSize="11px"
        dataTestId="transaction_date"
      >
        {correctDate}
      </Text>,
    ];

    const sourceLabel =
      serviceName === AI_TOOLS
        ? getTransactionSourceLabel(t, transaction)
        : null;

    if (sourceLabel) {
      children.push(
        <Text key="source" fontWeight={600} fontSize="11px">
          {sourceLabel}
        </Text>,
      );
    }

    if (transaction.participantDisplayName) {
      children.push(
        <Text key="participant" fontWeight={600} fontSize="11px">
          {Encoder.htmlDecode(transaction.participantDisplayName)}
        </Text>,
      );
    }

    if (transaction.serviceUnit) {
      children.push(
        <Text key="quantity" fontWeight={600} fontSize="11px">
          {getServiceQuantity(
            t,
            transaction.quantity ?? 0,
            transaction.serviceUnit ?? undefined,
          )}
        </Text>,
      );
    }

    return children;
  };

  return (
    <Row
      className={styles.transactionRow}
      badgesComponent={
        <Text
          fontWeight={600}
          fontSize="13px"
          className={classNames(styles.transactionRowAmount, {
            [styles.transactionRowAmountCredit]: isCredit,
          })}
        >
          {formattedAmount}
        </Text>
      }
    >
      <RowContent sectionWidth={sectionWidth}>{getRowChildren()}</RowContent>
    </Row>
  );
};

export default observer(TransactionRowView);

