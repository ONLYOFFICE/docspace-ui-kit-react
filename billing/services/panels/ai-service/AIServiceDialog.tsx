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
import { useCommonTranslation } from "../../../../utils/i18n";
import { observer } from "mobx-react";

import {
  ModalDialog,
  ModalDialogType,
} from "../../../../components/modal-dialog";

import styles from "../../styles/BackupServiceDialog.module.scss";

import GetStartedBody from "./GetStartedBody";
import PricingBillingBody from "./PricingBillingBody";

import { DateTime } from "luxon";
import { useNavigate } from "react-router";
import { AI_TOOLS } from "../../../constants";
import TopUpButtons from "../../../shared/top-up-balance/sub-components/TopUpButtons";

import { useApi } from "../../../../providers";
import TopUpAiModal from "../../../shared/top-up-balance/TopUpAiModal";
import TopUpModal from "../../../shared/top-up-balance/TopUpModal";
import { AmountProvider } from "../../../wallet/context";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";

interface AIServiceDialogProps {
  visible: boolean;
  onClose: () => void;
}

type DialogView = "get-started" | "pricing" | "top-up" | "top-up-wallet";

const AIServiceDialog: React.FC<AIServiceDialogProps> = ({
  visible,
  onClose,
}) => {
  const { rawApiClient } = useApi();
  const paymentStore = usePaymentStore();
  const servicesStore = useServicesStore();

  const { fetchTransactionHistory, fetchBalance, walletCodeCurrency } =
    paymentStore;

  const { logoText } = paymentStore;

  const { fetchAiServiceBalance, featureCountData, wasFirstAiServiceTopUp } =
    servicesStore;

  const t = useCommonTranslation();

  const [view, setView] = useState<DialogView>("top-up");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendedAmount, setRecommendedAmount] = useState<number>(0);
  const [selectedAmount, setSelectedAmount] = useState<number>(
    featureCountData ?? 0,
  );

  const navigate = useNavigate();

  const onTopUpClick = () => {
    setView("top-up");
  };

  const onGetStartedClick = () => {
    setView("get-started");
  };

  const onPricingBillingClick = () => {
    setView("pricing");
  };

  const onFetchHistory = async () => {
    await fetchTransactionHistory(AI_TOOLS);
  };

  const onRedirect = () => {
    if (!wasFirstAiServiceTopUp)
      navigate(paymentStore.routes.aiServices);

    onClose();
  };

  const onTopUpBalance = () => {
    setView("top-up-wallet");
  };

  const onAmountDifferenceChange = (diff: number, amount: number) => {
    setRecommendedAmount(diff);
    setSelectedAmount(amount);
  };

  const onBackWalletClick = () => {
    setView("top-up");
  };

  const creditAiBalance = async (amount: number) => {
    const { data } = await rawApiClient.instance.post(
      "api/2.0/portal/payment/creditaibalance",
      { amount },
    );
    return data as string;
  };

  const container =
    view === "top-up-wallet" ? (
      <TopUpModal
        visible={view === "top-up-wallet"}
        onClose={onBackWalletClick}
        afterTopUp={onBackWalletClick}
        headerProps={{
          isBackButton: true,
          onBackClick: onBackWalletClick,
          onCloseClick: onClose,
        }}
        {...(recommendedAmount > 0 && {
          reccomendedAmount: recommendedAmount.toString(),
          amount: selectedAmount.toString(),
        })}
        serviceName={AI_TOOLS}
      />
    ) : view === "get-started" ? (
      <GetStartedBody
        onPricingBillingClick={onPricingBillingClick}
        visible={view === "get-started"}
        onClose={onClose}
        onBack={onTopUpClick}
      />
    ) : view === "pricing" ? (
      <PricingBillingBody
        onBack={onTopUpClick}
        visible={view === "pricing"}
        onClose={onClose}
        onTopUpClick={onTopUpClick}
      />
    ) : null;

  const initialAmount = selectedAmount > 0 ? selectedAmount.toString() : "";

  return (
    <AmountProvider initialAmount={initialAmount}>
      <ModalDialog
        visible={visible}
        onClose={onClose}
        displayType={ModalDialogType.aside}
        withBodyScroll
        containerVisible={view !== "top-up"}
      >
        <ModalDialog.Container>{container}</ModalDialog.Container>
        <ModalDialog.Header>
          {t("AddCreditsToAI", { organizationName: logoText })}
        </ModalDialog.Header>
        <ModalDialog.Body>
          <div className={styles.dialogBody}>
            <TopUpAiModal
              onPricingBillingClick={onPricingBillingClick}
              onGetStartedClick={onGetStartedClick}
              onTopUpBalance={onTopUpBalance}
              onAmountDifferenceChange={onAmountDifferenceChange}
              visible={visible}
            />
          </div>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <TopUpButtons
            currency={walletCodeCurrency}
            fetchBalance={fetchBalance}
            fetchServiceBalance={fetchAiServiceBalance}
            fetchTransactionHistory={onFetchHistory}
            onClose={onClose}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            onTopUpBalance={creditAiBalance}
            serviceName={AI_TOOLS}
            afterTopUp={onRedirect}
          />
        </ModalDialog.Footer>
      </ModalDialog>
    </AmountProvider>
  );
};

export default observer(AIServiceDialog);

