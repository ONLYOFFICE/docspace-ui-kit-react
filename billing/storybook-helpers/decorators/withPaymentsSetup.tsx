import React from "react";
import type { Decorator } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { useApi } from "../../../providers/api";
import { Provider } from "../../../utils/context";
import BillingRoot from "../../BillingRoot";
import type { TPaymentConfig } from "../../types";

import styles from "./withPaymentsSetup.module.scss";

const defaultConfig: TPaymentConfig = {
  language: "en",
  routes: {
    portalPayments: "/billing/tariff-plan",
    services: "/billing/addons",
    aiServices: "/billing/addons/ai-services",
    aiSearch: "/billing/addons/ai-search",
    backup: "/billing/addons/backup",
    diskStorage: "/billing/addons/disk-storage",
  },
  logoText: "DocSpace",
  openOnNewPage: true,
};

const PaymentsSetupWrapper: React.FC<{
  config: TPaymentConfig;
  children: React.ReactNode;
}> = ({ config, children }) => {
  const { profilesApi } = useApi();

  const [isValidating, setIsValidating] = React.useState(true);
  const [apiError, setApiError] = React.useState<string | undefined>();

  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        await profilesApi.getSelfProfile();
        setApiError(undefined);
      } catch {
        setApiError(
          "Failed to connect to the portal. Please check your API settings in the API Config.",
        );
      } finally {
        setIsValidating(false);
      }
    };

    checkConnection();
  }, [profilesApi]);

  if (isValidating) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Payments</h2>
          <p className={styles.spinner}>Checking portal connection...</p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Payments</h2>
          <p className={styles.description}>
            A portal connection is required to load payment components.
          </p>
          <div className={styles.error}>
            <span>{"\u26A0"}</span>
            <span>{apiError}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BillingRoot config={config}>
      {children}
    </BillingRoot>
  );
};

export const withPaymentsSetup: Decorator = (Story, context) => {
  const config: TPaymentConfig = {
    ...defaultConfig,
    ...context.parameters?.paymentsConfig,
  };

  return (
    <MemoryRouter>
      <Provider value={{ sectionWidth: 1024, sectionHeight: 800 }}>
        <div id="sectionScroll">
          <div className="scroll-wrapper">
            <div className="scroller">
              <PaymentsSetupWrapper config={config}>
                <Story />
              </PaymentsSetupWrapper>
            </div>
          </div>
        </div>
      </Provider>
    </MemoryRouter>
  );
};
