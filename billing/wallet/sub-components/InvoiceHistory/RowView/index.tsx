import { observer } from "mobx-react";

import { RowContainer } from "../../../../../components/rows";
import { usePaymentStore } from "../../../../store/PaymentStoreProvider";
import type { TInvoice } from "../../../../types";

import { getCorrectDate } from "../../../../../utils/date/getCorrectDate";
import InvoiceRow from "./RowBody";

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
  const { formatWalletCurrency, language } = usePaymentStore();

  return (
    <RowContainer
      useReactWindow={false}
      fetchMoreFiles={() => Promise.resolve()}
      hasMoreFiles={false}
      itemCount={invoices.length}
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
