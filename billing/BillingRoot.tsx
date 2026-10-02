import React from "react";
import { PaymentStoreProvider } from "./store/PaymentStoreProvider";
import { ServicesStoreProvider } from "./store/ServicesStoreProvider";
import type { TPaymentConfig } from "./types";

import styles from "./BillingRoot.module.scss";

type BillingRootProps = {
  config: TPaymentConfig;
  children: React.ReactNode;
};

/**
 * Root wrapper for all payment pages.
 * Provides PaymentStore and ServicesStore contexts.
 * CSS custom properties for theming are defined in BillingRoot.module.scss.
 * Client just renders:
 *   <BillingRoot config={...}>
 *     <MainTariff />
 *   </BillingRoot>
 */
const BillingRoot = ({ config, children }: BillingRootProps) => {
  return (
    <PaymentStoreProvider config={config}>
      <ServicesStoreProvider>
        <div className={styles.paymentsRoot}>{children}</div>
      </ServicesStoreProvider>
    </PaymentStoreProvider>
  );
};

export default BillingRoot;
