// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import React from "react";
import type { Decorator } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { useApi } from "../../../providers";
import { Provider } from "../../../utils/context";
import BillingRoot from "../../BillingRoot";
import type { TPaymentConfig } from "../../types";

import styles from "./withPaymentsSetup.module.scss";

const defaultConfig: TPaymentConfig = {
  language: "en",
  routes: {
    portalPayments: "/portal-settings/payments",
    services: "/portal-settings/payments/services",
    aiServices: "/portal-settings/payments/services/ai",
    backup: "/portal-settings/payments/services/backup",
    diskStorage: "/portal-settings/payments/services/disk-storage",
  },
  logoText: "DocSpace",
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
