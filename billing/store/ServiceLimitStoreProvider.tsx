import React from "react";
import ServiceLimitStore from "./ServiceLimitStore";
import { useApi } from "../../providers/api";
import { usePaymentStore } from "./PaymentStoreProvider";

type TServiceLimitStoreProviderProps = {
  children: React.ReactNode;
};

const ServiceLimitStoreContext = React.createContext<ServiceLimitStore | null>(
  null,
);

export const useServiceLimitStore = () => {
  const store = React.useContext(ServiceLimitStoreContext);

  if (!store) {
    throw new Error(
      "useServiceLimitStore must be used within a ServiceLimitStoreProvider",
    );
  }

  return store;
};

const ServiceLimitStoreProviderInner = ({
  children,
}: TServiceLimitStoreProviderProps) => {
  const { rawApiClient } = useApi();
  const paymentStore = usePaymentStore();

  const store = React.useMemo(
    () => new ServiceLimitStore(rawApiClient.instance, paymentStore),
    [rawApiClient, paymentStore],
  );

  return (
    <ServiceLimitStoreContext.Provider value={store}>
      {children}
    </ServiceLimitStoreContext.Provider>
  );
};

export const ServiceLimitStoreProvider = ({
  children,
}: TServiceLimitStoreProviderProps) => {
  const existingStore = React.useContext(ServiceLimitStoreContext);

  if (existingStore) {
    return <>{children}</>;
  }

  return (
    <ServiceLimitStoreProviderInner>{children}</ServiceLimitStoreProviderInner>
  );
};
