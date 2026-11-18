import React from "react";
import classNames from "classnames";

import { Row, RowContent } from "../../../components/rows";
import { Text } from "../../../components/text";

import InvoiceLink from "../InvoiceLink";
import styles from "../InvoiceHistory.module.scss";

type InvoiceRowProps = {
  sectionWidth: number;
  date: string;
  amount: string;
  type: string;
  hasInvoice: boolean;
  onOpenInvoice: () => void;
};

const InvoiceRow: React.FC<InvoiceRowProps> = ({
  sectionWidth,
  date,
  amount,
  type,
  hasInvoice,
  onOpenInvoice,
}) => {
  const content = [
    <Text key="date" fontWeight={600} fontSize="14px" dataTestId="invoice_date">
      {date}
    </Text>,
    <div key="spacer" />,
    <Text key="amount" fontWeight={600} fontSize="11px">
      {amount}
    </Text>,
  ];

  if (type) {
    content.push(
      <Text
        key="type"
        fontWeight={600}
        fontSize="11px"
        dataTestId="invoice_type"
      >
        {type}
      </Text>,
    );
  }

  return (
    <Row
      className={classNames(styles.row, {
        [styles.rowWithInvoice]: hasInvoice,
      })}
      onRowClick={hasInvoice ? onOpenInvoice : undefined}
      badgesComponent={
        hasInvoice ? (
          <InvoiceLink fontSize="13px" onOpen={onOpenInvoice} />
        ) : undefined
      }
    >
      <RowContent sectionWidth={sectionWidth}>{content}</RowContent>
    </Row>
  );
};

export default InvoiceRow;
