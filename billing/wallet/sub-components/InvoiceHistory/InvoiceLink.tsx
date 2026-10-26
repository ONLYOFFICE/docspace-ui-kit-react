import React from "react";

import { Link, LinkType } from "../../../../components/link";
import { useCommonTranslation } from "../../../../utils/i18n";
import ExternalLinkIcon from "../../../../assets/external.link.svg";

import styles from "./InvoiceHistory.module.scss";

type InvoiceLinkProps = {
  fontSize: string;
  onOpen: () => void;
};

const InvoiceLink = ({ fontSize, onOpen }: InvoiceLinkProps) => {
  const t = useCommonTranslation();

  const onKeyDown = (e: React.KeyboardEvent<Element>) => {
    if (e.key !== "Enter" && e.key !== " ") return;

    e.preventDefault();
    onOpen();
  };

  return (
    <Link
      type={LinkType.action}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={onKeyDown}
      fontSize={fontSize}
      fontWeight={600}
      className={styles.invoiceLink}
      dataTestId="invoice_link"
    >
      {t("ViewInvoice")}
      <ExternalLinkIcon className={styles.externalIcon} aria-hidden />
    </Link>
  );
};

export default InvoiceLink;
