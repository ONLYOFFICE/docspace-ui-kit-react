/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useCommonTranslation } from "../../utils/i18n";

import socket, { SocketEvents } from "../../utils/socket";

import { usePaymentStore } from "../store/PaymentStoreProvider";

import WalletLoader from "./WalletLoader";
import WalletContainer from "./WalletContainer";
import StorageTariffDeactivated from "../dialogs/StorageTariffDeactivated";

type WalletProps = {
  onSetDocumentTitle?: (title: string) => void;
  showPortalSettingsLoader?: boolean;
  isUpdatingTariff?: boolean;
  integrationUrl?: string;
  onViewUsage?: () => void;
  onAddonsClick?: () => void;
};

const Wallet = observer((props: WalletProps) => {
  const { showPortalSettingsLoader, integrationUrl } = props;

  const paymentStore = usePaymentStore();
  const {
    isInitWalletPage,
    isShowStorageTariffDeactivatedModal,
    walletInit,
    fetchBalance,
    fetchTransactionHistory,
  } = paymentStore;

  const t = useCommonTranslation();

  const shouldShowLoader = !isInitWalletPage;

  useEffect(() => {
    walletInit(t, integrationUrl);
  }, []);

  useEffect(() => {
    const onTopUpWallet = (data: { auto: boolean }) => {
      if (!data || data?.auto === false) return;

      fetchBalance(true);
      fetchTransactionHistory();
    };

    socket?.on(SocketEvents.TopUpWallet, onTopUpWallet);

    return () => {
      socket?.off(SocketEvents.TopUpWallet, onTopUpWallet);
    };
  }, [fetchBalance, fetchTransactionHistory]);

  return shouldShowLoader || showPortalSettingsLoader ? (
    <WalletLoader />
  ) : (
    <>
      <WalletContainer {...props} />
      {isShowStorageTariffDeactivatedModal ? (
        <StorageTariffDeactivated
          visible={isShowStorageTariffDeactivatedModal}
        />
      ) : null}
    </>
  );
});

export default Wallet;

