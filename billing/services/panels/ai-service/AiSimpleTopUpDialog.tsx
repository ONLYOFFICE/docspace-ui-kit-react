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
import { observer } from "mobx-react";

import { useCommonTranslation } from "../../../../utils/i18n";
import {
  ModalDialog,
  ModalDialogType,
} from "../../../../components/modal-dialog";
import { Button, ButtonSize } from "../../../../components/button";
import { Text } from "../../../../components/text";
import { InputType, TextInput } from "../../../../components/text-input";
import { toastr } from "../../../../components/toast";
import { useApi } from "../../../../providers";

import AiAgentsIcon from "../../../../assets/icons/32/ai-agents.svg";

import { TenantWalletService } from "@onlyoffice/docspace-api-sdk";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";
import { AI_ENUM, AI_TOOLS } from "../../../constants";
import { formatCurrencyValue } from "../../../utils/common";

import styles from "./AiSimpleTopUpDialog.module.scss";

interface AiSimpleTopUpDialogProps {
  visible: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [10, 20, 50, 100];
const DEFAULT_AMOUNT = 20;
const MIN_AMOUNT = 10;
const MAX_INPUT_LENGTH = 6;

const AiSimpleTopUpDialog: React.FC<AiSimpleTopUpDialogProps> = ({
  visible,
  onClose,
}) => {
  const t = useCommonTranslation();
  const { paymentApi, rawApiClient } = useApi();

  const paymentStore = usePaymentStore();
  const servicesStore = useServicesStore();

  const { logoText, language: storeLanguage } = paymentStore;
  const currency = paymentStore.walletCodeCurrency || "USD";
  const aiCurrency = servicesStore.aiServiceCodeCurrency || currency;
  const currentBalance = servicesStore.aiServiceBalance ?? 0;
  const language = storeLanguage || "en";

  const [amount, setAmount] = useState<string>(String(DEFAULT_AMOUNT));
  const [isLoading, setIsLoading] = useState(false);

  const parsedAmount = Number(amount) || 0;
  const isAmountValid = parsedAmount >= MIN_AMOUNT;
  const afterBalance = currentBalance + parsedAmount;

  const formattedCurrent = formatCurrencyValue(
    language,
    currentBalance,
    aiCurrency,
    2,
  );
  const formattedAfter = formatCurrencyValue(
    language,
    afterBalance,
    aiCurrency,
    2,
  );

  const onSelectPreset = (preset: number) => {
    setAmount(String(preset));
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, validity } = e.target;
    if (!validity.valid) return;
    setAmount(value);
  };

  const onConfirm = async () => {
    if (isLoading || !isAmountValid) return;

    setIsLoading(true);

    try {
      await paymentApi.topUpDeposit({
        topUpDepositRequestDto: { amount: parsedAmount, currency },
      });

      await rawApiClient.instance.post(
        "api/2.0/portal/payment/creditaibalance",
        { amount: parsedAmount },
      );

      if (!paymentStore.isAiToolsServiceOn) {
        await paymentApi.changeTenantWalletServiceState({
          changeWalletServiceStateRequestDto: {
            service: TenantWalletService.AITools,
            enabled: true,
          },
        });
        paymentStore.changeServiceState(AI_ENUM);
        await servicesStore.initServiceData(
          t,
          AI_TOOLS,
          AI_ENUM,
        );
      } else {
        await servicesStore.fetchAiServiceBalance();
      }

      toastr.success(t("AIServiceTopUpSuccess"));

      onClose();
    } catch (e) {
      console.error("[ai-simple-topup] failed", e);
      toastr.error(t("UnexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalDialog
      visible={visible}
      onClose={onClose}
      displayType={ModalDialogType.modal}
      withBodyScroll
      autoMaxHeight
    >
      <ModalDialog.Header>
        {t("AddCreditsToAI", { organizationName: logoText })}
      </ModalDialog.Header>

      <ModalDialog.Body>
        <div className={styles.body}>
          <div className={styles.balanceRow}>
            <Text fontSize="13px" className={styles.balanceRowLabel}>
              {t("AiTopUpCurrentBalance")}
            </Text>
            <Text fontSize="13px" fontWeight={600}>
              {formattedCurrent}
            </Text>
          </div>

          <Text fontSize="13px" fontWeight={600} className={styles.label}>
            {t("AmountSelection")}
          </Text>

          <div className={styles.chips} role="radiogroup">
            {PRESET_AMOUNTS.map((preset) => {
              const isSelected = String(preset) === amount;
              return (
                <button
                  key={preset}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`${styles.chip} ${
                    isSelected ? styles.chipSelected : ""
                  }`}
                  disabled={isLoading}
                  onClick={() => onSelectPreset(preset)}
                >
                  ${preset}
                </button>
              );
            })}
          </div>

          <div className={styles.inputWrapper}>
            <TextInput
              value={amount}
              onChange={onChangeInput}
              pattern="^[1-9]\d*$"
              scale
              withBorder
              type={InputType.text}
              placeholder={t("EnterAmount")}
              isDisabled={isLoading}
              maxLength={MAX_INPUT_LENGTH}
              className={styles.inputField}
              testId="ai_topup_amount_input"
            />
          </div>

          <Text fontSize="12px" className={styles.minHint}>
            {t("AiTopUpMinimum", { amount: MIN_AMOUNT })}
          </Text>

          <div className={styles.afterRow}>
            <Text fontSize="13px" className={styles.balanceRowLabel}>
              {t("AiTopUpAfterBalance")}
            </Text>
            <Text
              fontSize="13px"
              fontWeight={700}
              className={styles.afterValue}
            >
              {formattedAfter}
            </Text>
          </div>

          <Text fontSize="12px" className={styles.fundsNote}>
            {t("AiTopUpFundsNote")}
          </Text>
        </div>
      </ModalDialog.Body>

      <ModalDialog.Footer>
        <div className={styles.footerButtons}>
          <Button
            key="OkButton"
            label={t("TopUp")}
            size={ButtonSize.normal}
            primary
            scale
            onClick={onConfirm}
            isLoading={isLoading}
            isDisabled={!isAmountValid || isLoading}
            testId="ai_topup_confirm_button"
          />
          <Button
            key="CancelButton"
            label={t("CancelButton")}
            size={ButtonSize.normal}
            scale
            onClick={onClose}
            isDisabled={isLoading}
            testId="ai_topup_cancel_button"
          />
        </div>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default observer(AiSimpleTopUpDialog);

