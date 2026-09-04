import React from "react";
import PaymentStore from "./PaymentStore";
import { useApi } from "../../providers/api";
import type { TPaymentConfig } from "../types";

type TPaymentStoreProviderProps = {
  children: React.ReactNode;
  config: TPaymentConfig;
};

export const PaymentStoreContext = React.createContext<PaymentStore | null>(null);

export const usePaymentStore = () => {
  const store = React.useContext(PaymentStoreContext);

  if (!store) {
    throw new Error(
      "usePaymentStore must be used within a PaymentStoreProvider",
    );
  }

  return store;
};

const PaymentStoreProviderInner = ({
  children,
  config,
}: TPaymentStoreProviderProps) => {
  const {
    paymentApi,
    profilesApi,
    portalQuotaApi,
    commonSettingsApi,
    rawApiClient,
  } = useApi();

  const store = React.useMemo(
    () =>
      new PaymentStore(
        paymentApi,
        profilesApi,
        portalQuotaApi,
        commonSettingsApi,
        rawApiClient,
      ),
    [paymentApi, profilesApi, portalQuotaApi, commonSettingsApi, rawApiClient],
  );

  React.useEffect(() => {
    store.configure(config);
  }, [store, config]);

  React.useEffect(() => {
    store.tariff.setLanguage(config.language);
  }, [store, config.language]);

  React.useEffect(() => {
    if (!config.user) {
      store.fetchCurrentUser();
    }
  }, [store, config.user]);

  React.useEffect(() => {
    if (!store.quotas.isLoaded) {
      const url =
        typeof window !== "undefined" ? window.location.search : "";
      const isRefresh = url.includes("complete=true");
      store.quotas.fetchPortalQuota(isRefresh);
    }
  }, [store]);

  React.useEffect(() => {
    return () => {
      store.dispose();
    };
  }, [store]);

  return (
    <PaymentStoreContext.Provider value={store}>
      {children}
    </PaymentStoreContext.Provider>
  );
};

export const PaymentStoreProvider = ({
  children,
  config,
}: TPaymentStoreProviderProps) => {
  const existingStore = React.useContext(PaymentStoreContext);

  if (existingStore) {
    return <>{children}</>;
  }

  return (
    <PaymentStoreProviderInner config={config}>
      {children}
    </PaymentStoreProviderInner>
  );
};

