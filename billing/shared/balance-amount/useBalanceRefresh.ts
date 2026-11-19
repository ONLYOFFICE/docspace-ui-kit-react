import { useState } from "react";

import { toastr } from "../../../components/toast";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { finishRefreshingWithMinCycle } from "../../utils/refreshing";

export const useBalanceRefresh = (onRefreshExtra?: () => unknown) => {
  const { refreshBalance } = usePaymentStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    const startTime = Date.now();

    try {
      await Promise.all([refreshBalance(), onRefreshExtra?.()]);
    } catch (e) {
      toastr.error(e as Error);
    } finally {
      finishRefreshingWithMinCycle({
        startTime,
        setRefreshing: setIsRefreshing,
      });
    }
  };

  return { isRefreshing, onRefresh };
};
