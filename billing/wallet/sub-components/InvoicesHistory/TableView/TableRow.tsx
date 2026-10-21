import React from "react";

import { TableCell, TableRow } from "../../../../../components/table";
import { Text } from "../../../../../components/text";
import { Link, LinkTarget } from "../../../../../components/link";
import { useCommonTranslation } from "../../../../../utils/i18n";
import ExternalLinkIcon from "../../../../../assets/external.link.svg";

import styles from "../InvoicesHistory.module.scss";

type InvoiceRowProps = {
  date: string;
  amount: string;
  url: string;
};

const InvoiceRow: React.FC<InvoiceRowProps> = ({ date, amount, url }) => {
  const t = useCommonTranslation();

  return (
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
        <Link
          href={url}
          target={LinkTarget.blank}
          rel="noopener noreferrer"
          fontSize="12px"
          fontWeight={600}
          className={styles.invoiceLink}
          dataTestId="invoice_link"
        >
          {t("ViewInvoice")}
          <ExternalLinkIcon className={styles.externalIcon} aria-hidden />
        </Link>
      </TableCell>
    </TableRow>
  );
};

export default InvoiceRow;
