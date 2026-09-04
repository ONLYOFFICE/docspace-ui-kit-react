import { observer } from "mobx-react";

import { RowContainer } from "../../../../../components/rows";
import { usePaymentStore } from "../../../../store/PaymentStoreProvider";
import { useCommonTranslation } from "../../../../../utils/i18n";
import { getServiceQuantity } from "../../../utils";

import UpcomingPaymentRow from "./RowBody";

const RowView = ({ sectionWidth }: { sectionWidth: number }) => {
  const store = usePaymentStore();
  const t = useCommonTranslation();
  const { upcomingPayments, formatWalletCurrency } = store;

  return (
    <RowContainer
      useReactWindow={false}
      fetchMoreFiles={() => Promise.resolve()}
      hasMoreFiles={false}
      itemCount={upcomingPayments.length}
      filesLength={upcomingPayments.length}
      itemHeight={58}
    >
      {upcomingPayments.map((payment) => (
        <UpcomingPaymentRow
          key={payment.id}
          sectionWidth={sectionWidth}
          title={payment.title}
          renewalDate={payment.renewalDate}
          details={getServiceQuantity(
            t,
            payment.quantity,
            payment.unitOfMeasure,
          )}
          amount={formatWalletCurrency(payment.amount, 2)}
          actionType={payment.actionType}
          actionRoute={payment.actionRoute}
        />
      ))}
    </RowContainer>
  );
};

export default observer(RowView);

