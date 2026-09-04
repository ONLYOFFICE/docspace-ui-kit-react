import React from "react";
import ServicesStore from "./ServicesStore";
import { useApi } from "../../providers/api";
import { usePaymentStore } from "./PaymentStoreProvider";

type TServicesStoreProviderProps = {
  children: React.ReactNode;
};

const ServicesStoreContext = React.createContext<ServicesStore | null>(null);

export const useServicesStore = () => {
  const store = React.useContext(ServicesStoreContext);

  if (!store) {
    throw new Error(
      "useServicesStore must be used within a ServicesStoreProvider",
    );
  }

  return store;
};

const ServicesStoreProviderInner = ({
  children,
}: TServicesStoreProviderProps) => {
  const { paymentApi, rawApiClient } = useApi();
  const paymentStore = usePaymentStore();

  const store = React.useMemo(
    () => new ServicesStore(paymentApi, paymentStore, rawApiClient),
    [paymentApi, paymentStore, rawApiClient],
  );

  React.useEffect(() => {
    return () => {
      store.dispose();
    };
  }, [store]);

  return (
    <ServicesStoreContext.Provider value={store}>
      {children}
    </ServicesStoreContext.Provider>
  );
};

export const ServicesStoreProvider = ({
  children,
}: TServicesStoreProviderProps) => {
  const existingStore = React.useContext(ServicesStoreContext);

  if (existingStore) {
    return <>{children}</>;
  }

  return <ServicesStoreProviderInner>{children}</ServicesStoreProviderInner>;
};
