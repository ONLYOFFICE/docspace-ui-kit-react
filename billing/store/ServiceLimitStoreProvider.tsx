import React from "react";
import ServiceLimitStore from "./ServiceLimitStore";
import { useApi } from "../../providers/api";

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

export const ServiceLimitStoreProvider = ({
  children,
}: TServiceLimitStoreProviderProps) => {
  const { rawApiClient } = useApi();

  const store = React.useMemo(
    () => new ServiceLimitStore(rawApiClient.instance),
    [rawApiClient],
  );

  return (
    <ServiceLimitStoreContext.Provider value={store}>
      {children}
    </ServiceLimitStoreContext.Provider>
  );
};
