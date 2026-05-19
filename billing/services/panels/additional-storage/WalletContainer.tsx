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
import { observer } from "mobx-react";

import WalletInfo from "../../../shared/top-up-balance/sub-components/WalletInfo";

import styles from "../../styles/StorageSummary.module.scss";
import { usePaymentContext } from "../../context/PaymentContext";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";

type WalletContainerProps = {
  onTopUp: () => void;
  isExceedingStorageLimit: boolean;
  isPaymentBlockedByBalance: boolean;
  isCurrentStoragePlan: boolean;
  isDowngradeStoragePlan: boolean;
  isLoading: boolean;
  hasMinError: boolean;
};

const WalletContainer = (props: WalletContainerProps) => {
  const {
    onTopUp,
    isExceedingStorageLimit,
    isPaymentBlockedByBalance,
    isCurrentStoragePlan,
    isDowngradeStoragePlan,
    isLoading,
    hasMinError,
  } = props;

  const paymentStore = usePaymentStore();
  const { hasScheduledStorageChange } = paymentStore.tariff;
  const { formatWalletCurrency } = paymentStore;

  const { isWaitingCalculation } = usePaymentContext();

  if (hasScheduledStorageChange) return null;

  const isBalanceInsufficient =
    !isCurrentStoragePlan &&
    isPaymentBlockedByBalance &&
    !isLoading &&
    !isDowngradeStoragePlan &&
    !isExceedingStorageLimit && !hasMinError;

  return (
    <div className={styles.walletContainer}>
      <WalletInfo
        balance={formatWalletCurrency()}
        isBalanceInsufficient={isBalanceInsufficient}
        {...(isBalanceInsufficient && !isWaitingCalculation && { onTopUp })}
      />
    </div>
  );
};

export default observer(WalletContainer);
