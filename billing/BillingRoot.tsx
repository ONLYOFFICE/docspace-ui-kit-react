import React from "react";
import { PaymentStoreProvider } from "./store/PaymentStoreProvider";
import { ServicesStoreProvider } from "./store/ServicesStoreProvider";
import { ServiceLimitStoreProvider } from "./store/ServiceLimitStoreProvider";
import type { TPaymentConfig } from "./types";

import styles from "./BillingRoot.module.scss";

type BillingRootProps = {
  config: TPaymentConfig;
  children: React.ReactNode;
};

const BillingRoot = ({ config, children }: BillingRootProps) => {
  return (
    <PaymentStoreProvider config={config}>
      <ServicesStoreProvider>
        <ServiceLimitStoreProvider>
          <div className={styles.paymentsRoot}>{children}</div>
        </ServiceLimitStoreProvider>
      </ServicesStoreProvider>
    </PaymentStoreProvider>
  );
};

export default BillingRoot;
