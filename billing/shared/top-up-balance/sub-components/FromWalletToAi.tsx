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

import { Text } from "../../../../components/text";
import modalStyles from "../styles/TopUpAiModal.module.scss";
import WalletInfo from "./WalletInfo";
import AiAgentsIcon from "../../../../assets/icons/16/ai-agents.svg";
import { useCommonTranslation } from "../../../../utils/i18n";
import { useAmountValue } from "../../../wallet/context";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";

interface IFromWalletToAi {
  onTopUpBalance: () => void;
  onAmountDifferenceChange?: (diff: number, amount: number) => void;
}

const FromWalletToAi = (props: IFromWalletToAi) => {
  const { onTopUpBalance, onAmountDifferenceChange } = props;

  const store = usePaymentStore();
  const servicesStore = useServicesStore();

  const { walletBalance, formatWalletCurrency, logoText } = store;
  const { formatAiServiceCurrency } = servicesStore;
  const { walletCustomerEmail } = store.tariff;
  const t = useCommonTranslation();
  const aiServiceBalanceValue = formatAiServiceCurrency!();
  const { amount, setIsBalanceInsufficient } = useAmountValue();
  const balanceValue = formatWalletCurrency!();

  const amountNumber = Number(amount);
  const walletBalanceNumber = walletBalance!;
  const amountDiff = Math.abs(amountNumber - walletBalanceNumber);

  useEffect(() => {
    if (onAmountDifferenceChange)
      onAmountDifferenceChange(Math.ceil(amountDiff), amountNumber);
  }, [amountDiff, amountNumber, onAmountDifferenceChange]);

  const isBalanceInsufficient =
    !walletCustomerEmail ||
    walletBalanceNumber === 0 ||
    amountNumber > walletBalanceNumber;

  useEffect(() => {
    setIsBalanceInsufficient(isBalanceInsufficient);
  }, [isBalanceInsufficient]);

  return (
    <div className={modalStyles.transferSection}>
      <div className={modalStyles.transferBlock}>
        <Text fontWeight="600">{t("TopUpFrom")}</Text>

        <WalletInfo
          balance={balanceValue}
          isBalanceInsufficient={isBalanceInsufficient}
          onTopUp={isBalanceInsufficient ? onTopUpBalance : undefined}
        />
      </div>

      <div className={modalStyles.transferBlock}>
        <Text fontWeight="600">{t("TopUpTo")}</Text>

        <WalletInfo
          title={t("OrganizationAI", {
            organizationName: logoText,
          })}
          balance={aiServiceBalanceValue}
          icon={<AiAgentsIcon />}
        />
      </div>
    </div>
  );
};

export default observer(FromWalletToAi);

