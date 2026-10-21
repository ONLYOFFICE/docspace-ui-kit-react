import React from "react";

import { Row, RowContent } from "../../../../../components/rows";
import { Text } from "../../../../../components/text";
import { Link, LinkTarget } from "../../../../../components/link";
import { useCommonTranslation } from "../../../../../utils/i18n";
import ExternalLinkIcon from "../../../../../assets/external.link.svg";

import styles from "../InvoicesHistory.module.scss";

type InvoiceRowProps = {
  sectionWidth: number;
  date: string;
  amount: string;
  url: string;
};

const InvoiceRow: React.FC<InvoiceRowProps> = ({
  sectionWidth,
  date,
  amount,
  url,
}) => {
  const t = useCommonTranslation();

  const onOpenInvoice = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Row
      className={styles.row}
      onRowClick={onOpenInvoice}
      badgesComponent={
        <Link
          href={url}
          target={LinkTarget.blank}
          rel="noopener noreferrer"
          fontSize="13px"
          fontWeight={600}
          className={styles.invoiceLink}
          dataTestId="invoice_link"
        >
          {t("ViewInvoice")}
          <ExternalLinkIcon className={styles.externalIcon} aria-hidden />
        </Link>
      }
    >
      <RowContent sectionWidth={sectionWidth}>
        <Text
          key="date"
          fontWeight={600}
          fontSize="14px"
          dataTestId="invoice_date"
        >
          {date}
        </Text>
        <div key="spacer" />
        <Text key="amount" fontWeight={600} fontSize="11px">
          {amount}
        </Text>
      </RowContent>
    </Row>
  );
};

export default InvoiceRow;
