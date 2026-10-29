import { observer } from "mobx-react";

import { RowContainer } from "../../../components/rows";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import type { TInvoice } from "../../types";

import { getCorrectDate } from "../../../utils/date/getCorrectDate";
import InvoiceRow from "./RowBody";
import styles from "../InvoiceHistory.module.scss";

type InvoiceHistoryRowViewProps = {
  sectionWidth: number;
  invoices: TInvoice[];
  onOpenInvoice: (id: number) => void;
};

const RowView = ({
  sectionWidth,
  invoices,
  onOpenInvoice,
}: InvoiceHistoryRowViewProps) => {
  const {
    formatWalletCurrency,
    language,
    invoicesTotal,
    hasMoreInvoices,
    fetchMoreInvoices,
  } = usePaymentStore();

  return (
    <RowContainer
      className={styles.rowContainer}
      useReactWindow
      fetchMoreFiles={fetchMoreInvoices}
      hasMoreFiles={hasMoreInvoices}
      itemCount={invoicesTotal}
      filesLength={invoices.length}
      itemHeight={58}
    >
      {invoices.map((invoice) => (
        <InvoiceRow
          key={invoice.id}
          sectionWidth={sectionWidth}
          date={getCorrectDate(language, invoice.date)}
          amount={formatWalletCurrency(invoice.amount, 2, invoice.currency)}
          hasInvoice={invoice.hasInvoice}
          onOpenInvoice={() => onOpenInvoice(invoice.id)}
        />
      ))}
    </RowContainer>
  );
};

export default observer(RowView);
