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

import React, { useState } from "react";
import { useCommonTranslation } from "../../../utils/i18n";
import { observer } from "mobx-react";

import {
  ModalDialog,
  ModalDialogType,
} from "../../../components/modal-dialog";
import { Text } from "../../../components/text";

import Amount from "./sub-components/Amount";
import TopUpButtons from "./sub-components/TopUpButtons";
import { AmountProvider } from "../../wallet/context";
import styles from "./styles/TopUpModal.module.scss";

import modalStyles from "./styles/TopUpAiModal.module.scss";

import { useNavigate } from "react-router";

import FromWalletToAi from "./sub-components/FromWalletToAi";
import { AI_TOOLS } from "../../constants";
import { DateTime } from "luxon";
import { Link } from "../../../components";
import { usePaymentStore } from "../../store/PaymentStoreProvider";

type TopUpAiModalProps = {
  onTopUpBalance: () => void;
  onPricingBillingClick: () => void;
  onGetStartedClick: () => void;
  onAmountDifferenceChange?: (diff: number, amount: number) => void;
  visible: boolean;
  recommendedAmount?: string;
  isLoading?: boolean;
};

const TopUpAiModal = (props: TopUpAiModalProps) => {
  const {
    onTopUpBalance,
    onAmountDifferenceChange,
    onPricingBillingClick,
    onGetStartedClick,
    isLoading,
    recommendedAmount,
  } = props;

  const store = usePaymentStore();

  const { formatWalletCurrency, logoText, isAlreadyPaid } = store;
  const { walletCustomerEmail } = store.tariff;

  const t = useCommonTranslation();

  const isDisabled = (isLoading || !isAlreadyPaid) ?? false;

  return (
    <>
      <Text className={modalStyles.description}>
        {t("CreditsFromWalletDescription", {
          organizationName: logoText,
        })}
      </Text>

      <Link
        onClick={onGetStartedClick}
        textDecoration="underline dotted"
        color="accent"
        fontWeight={600}
      >
        {t("HowDoesItWork")}
      </Link>

      <FromWalletToAi
        onTopUpBalance={onTopUpBalance}
        onAmountDifferenceChange={onAmountDifferenceChange}
      />

      <Amount
        formatWalletCurrency={formatWalletCurrency}
        walletCustomerEmail={walletCustomerEmail}
        isDisabled={isDisabled}
        recommendedAmount={recommendedAmount}
        minValue={"10"}
      />

      <Text fontSize="12px" className={modalStyles.helperText}>
        {t("AICreditsHelper")}
      </Text>

      <Link
        className={modalStyles.pricingBillingLink}
        onClick={onPricingBillingClick}
        textDecoration="underline dotted"
        color="accent"
        fontWeight={600}
      >
        {t("AIPricingAndBilling")}
      </Link>
    </>
  );
};

export default observer(TopUpAiModal);
