import React from "react";
import type { Decorator } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { PortalGate } from "../../../.storybook/decorators/PortalGate";
import { Provider } from "../../../utils/context";
import BillingRoot from "../../BillingRoot";
import type { TPaymentConfig } from "../../types";

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
  logoText: "ONLYOFFICE",
  openOnNewPage: true,
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
              <PortalGate
                apiConfig={context.globals.apiConfig}
                title="Payments"
                description="A portal connection is required to load payment components."
                storyId={context.id}
              >
                <BillingRoot config={config}>
                  <Story />
                </BillingRoot>
              </PortalGate>
            </div>
          </div>
        </div>
      </Provider>
    </MemoryRouter>
  );
};
