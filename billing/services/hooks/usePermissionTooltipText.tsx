import React from "react";

import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { usePaymentStore } from "../../store/PaymentStoreProvider";

export const usePermissionTooltipText = (): React.ReactNode => {
  const paymentStore = usePaymentStore();
  const { walletCustomerInfo, walletCustomerEmail } = paymentStore.tariff;

  return (
    <CommonTrans
      i18nKey="InsufficientPermissionsMessage"
      values={{
        payerContact:
          (walletCustomerInfo as { displayName?: string })?.displayName ||
          walletCustomerEmail ||
          "",
      }}
      components={{ 1: <strong /> }}
    />
  );
};
