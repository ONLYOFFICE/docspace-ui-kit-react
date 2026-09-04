import { observer } from "mobx-react";

import { RowContainer } from "../../../../../components/rows";
import type { OperationDto } from "@onlyoffice/docspace-api-sdk";

import TransactionRowView from "./RowBody";
import { usePaymentStore } from "../../../../store/PaymentStoreProvider";

const RowView = ({
  sectionWidth,
  serviceName,
}: {
  sectionWidth: number;
  serviceName?: string;
}) => {
  const paymentStore = usePaymentStore();
  const history = paymentStore.transactionHistory ?? [];

  return (
    <RowContainer
      useReactWindow
      fetchMoreFiles={() => Promise.resolve()}
      hasMoreFiles={false}
      itemCount={history.length}
      filesLength={history.length}
      itemHeight={50}
    >
      {history.map((transaction, index) => (
        <TransactionRowView
          transaction={transaction}
          key={`transaction-row-${index}-${transaction.date ?? ""}`}
          sectionWidth={sectionWidth}
          serviceName={serviceName}
        />
      ))}
    </RowContainer>
  );
};

export default observer(RowView);

