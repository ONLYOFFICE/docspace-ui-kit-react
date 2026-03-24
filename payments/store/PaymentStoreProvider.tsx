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
import PaymentStore from "./PaymentStore";
import { useApi } from "../../providers";
import type { TPaymentConfig } from "../types";
import {
  CurrentTariffStatusStoreProvider,
  useCurrentTariffStatusStore,
} from "./CurrentTariffStatusStoreProvider";
import {
  CurrentQuotasStoreProvider,
  useCurrentQuotasStore,
} from "./CurrentQuotasStoreProvider";
import {
  PaymentQuotasStoreProvider,
  usePaymentQuotasStore,
} from "./PaymentQuotasStoreProvider";

type TPaymentStoreProviderProps = {
  children: React.ReactNode;
  config: TPaymentConfig;
};

const PaymentStoreContext = React.createContext<PaymentStore | null>(null);

export const usePaymentStore = () => {
  const store = React.useContext(PaymentStoreContext);

  if (!store) {
    throw new Error(
      "usePaymentStore must be used within a PaymentStoreProvider",
    );
  }

  return store;
};

type TPaymentStoreInnerProps = {
  children: React.ReactNode;
  config: TPaymentConfig;
};

const PaymentStoreInner = ({ children, config }: TPaymentStoreInnerProps) => {
  const { paymentApi, profilesApi } = useApi();
  const tariffStatusStore = useCurrentTariffStatusStore();
  const quotasStore = useCurrentQuotasStore();
  const paymentQuotasStore = usePaymentQuotasStore();

  const store = React.useMemo(
    () => new PaymentStore(paymentApi, profilesApi),
    [paymentApi, profilesApi],
  );

  React.useEffect(() => {
    store.setTariffStatusStore(tariffStatusStore);
  }, [store, tariffStatusStore]);

  React.useEffect(() => {
    store.setQuotasStore(quotasStore);
  }, [store, quotasStore]);

  React.useEffect(() => {
    store.setPaymentQuotasStore(paymentQuotasStore);
  }, [store, paymentQuotasStore]);

  React.useEffect(() => {
    store.configure(config);
  }, [store, config]);

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
  return (
    <CurrentTariffStatusStoreProvider language={config.language}>
      <CurrentQuotasStoreProvider>
        <PaymentQuotasStoreProvider>
          <PaymentStoreInner config={config}>{children}</PaymentStoreInner>
        </PaymentQuotasStoreProvider>
      </CurrentQuotasStoreProvider>
    </CurrentTariffStatusStoreProvider>
  );
};
