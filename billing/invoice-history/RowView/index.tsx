import { observer } from "mobx-react";

import { RowContainer } from "../../../components/rows";
import { useCommonTranslation } from "../../../utils/i18n";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import type { TInvoice } from "../../types";

import { getCorrectDate } from "../../../utils/date/getCorrectDate";
import { getInitiatorLabel } from "../getInitiatorLabel";
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
  const t = useCommonTranslation();
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
          type={getInitiatorLabel(t, invoice.initiator)}
          hasInvoice={invoice.hasInvoice}
          onOpenInvoice={() => onOpenInvoice(invoice.id)}
        />
      ))}
    </RowContainer>
  );
};

export default observer(RowView);
