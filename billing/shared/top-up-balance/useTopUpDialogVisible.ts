import { useEffect, useState } from "react";

import { usePaymentStore } from "../../store/PaymentStoreProvider";

export const useTopUpDialogVisible = () => {
  const { isVisibleWalletSettings } = usePaymentStore();
  const [isVisible, setIsVisible] = useState(isVisibleWalletSettings);

  useEffect(() => {
    if (isVisibleWalletSettings) setIsVisible(true);
  }, [isVisibleWalletSettings]);

  return [isVisible, setIsVisible] as const;
};
