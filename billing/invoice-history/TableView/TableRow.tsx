import React from "react";

import { TableCell, TableRow } from "../../../components/table";
import { Text } from "../../../components/text";

import InvoiceLink from "../InvoiceLink";
import styles from "../InvoiceHistory.module.scss";

type InvoiceRowProps = {
  date: string;
  amount: string;
  hasInvoice: boolean;
  onOpenInvoice: () => void;
};

const InvoiceRow: React.FC<InvoiceRowProps> = ({
  date,
  amount,
  hasInvoice,
  onOpenInvoice,
}) => (
  <TableRow>
    <TableCell>
      <Text
        fontSize="12px"
        fontWeight={600}
        className={styles.cellText}
        dataTestId="invoice_date"
      >
        {date}
      </Text>
    </TableCell>
    <TableCell>
      <Text fontSize="12px" fontWeight={600} className={styles.cellText}>
        {amount}
      </Text>
    </TableCell>
    <TableCell>
      {hasInvoice ? (
        <InvoiceLink fontSize="12px" onOpen={onOpenInvoice} />
      ) : null}
    </TableCell>
  </TableRow>
);

export default InvoiceRow;
