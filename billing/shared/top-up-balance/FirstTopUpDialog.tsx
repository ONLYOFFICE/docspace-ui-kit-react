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

import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";

import {
  ModalDialog,
  ModalDialogType,
} from "../../../components/modal-dialog";
import { Button, ButtonSize } from "../../../components/button";
import { Text } from "../../../components/text";
import { toastr } from "../../../components/toast";

import { useCommonTranslation } from "../../../utils/i18n";
import { toAbsoluteUrl } from "../../utils/url";

import Amount from "./sub-components/Amount";
import { AmountProvider, useAmountValue } from "../../wallet/context";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import type PaymentStore from "../../store/PaymentStore";

import styles from "./styles/FirstTopUpDialog.module.scss";

const MIN_AMOUNT = "10";
const PAYMENT_CALLBACK_PATH = "/billing/payment-complete";
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const pollUntil = async (
  check: () => Promise<boolean>,
  isMountedRef: React.RefObject<boolean>,
) => {
  const startedAt = Date.now();
  while (isMountedRef.current) {
    if (await check()) return;
    if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
      throw new Error("Polling timeout");
    }
    await sleep(POLL_INTERVAL_MS);
  }
};

const buildBackUrl = (amount: string, currency: string) => {
  const integrationUrl = `${window.location.origin}${PAYMENT_CALLBACK_PATH}`;
  return `${integrationUrl}?currency=${currency}&amount=${amount}&type=wallet`;
};

const openStripeCheckout = async (
  paymentStore: PaymentStore,
  amount: string,
) => {
  const currency = paymentStore.walletCodeCurrency || "USD";
  const backUrl = buildBackUrl(amount, currency);

  await paymentStore.fetchCardLinked(backUrl);

  const linkUrl = paymentStore.cardLinked;
  if (!linkUrl) throw new Error("Missing Stripe checkout URL");

  window.open(toAbsoluteUrl(linkUrl), "_blank");
};

const waitForTopUpCompletion = async (
  paymentStore: PaymentStore,
  isMountedRef: React.RefObject<boolean>,
) => {
  const initialBalance = paymentStore.walletBalance;

  await pollUntil(async () => {
    await paymentStore.tariff.fetchCustomerInfo(true);
    return !!paymentStore.tariff.walletCustomerEmail;
  }, isMountedRef);

  await pollUntil(async () => {
    await paymentStore.fetchBalance(true);
    return paymentStore.walletBalance > initialBalance;
  }, isMountedRef);
};

type FirstTopUpDialogProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<void> | void;
};

const FirstTopUpDialogContent = observer(
  ({ visible, onClose, onConfirm }: FirstTopUpDialogProps) => {
    const t = useCommonTranslation();
    const paymentStore = usePaymentStore();

    const { formatWalletCurrency } = paymentStore;
    const { walletCustomerStatusNotActive } = paymentStore.tariff;

    const { amount, hasError } = useAmountValue();

    const [isLoading, setIsLoading] = useState(false);

    const isMountedRef = useRef(true);

    useEffect(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    const isDisabled = isLoading || !amount || hasError;

    const onContinue = async () => {
      if (isDisabled) return;

      setIsLoading(true);

      try {
        await openStripeCheckout(paymentStore, amount);

        await waitForTopUpCompletion(paymentStore, isMountedRef);

        if (!isMountedRef.current) return;

        await onConfirm?.();

        if (!isMountedRef.current) return;

        onClose();
      } catch (error) {
        console.error("[first-topup] flow failed", error);
        if (isMountedRef.current) toastr.error(t("UnexpectedError"));
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    };

    return (
      <ModalDialog
        visible={visible}
        onClose={isLoading ? () => {} : onClose}
        displayType={ModalDialogType.modal}
        autoMaxHeight
        withBodyScroll
      >
        <ModalDialog.Header>{t("TopUpCredits")}</ModalDialog.Header>

        <ModalDialog.Body>
          <div className={styles.body}>
            <Text className={styles.description}>
              {t("TopUpCreditsDescription")}
            </Text>

            <Amount
              formatWalletCurrency={formatWalletCurrency}
              isDisabled={isLoading}
              walletCustomerStatusNotActive={walletCustomerStatusNotActive}
              minValue={MIN_AMOUNT}
              withoutCustomerCheck
            />

            <Text fontSize="12px" className={styles.helperText}>
              {t("TopUpCreditsChargeHint")}
            </Text>
          </div>
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <div className={styles.footerButtons}>
            <Button
              key="ContinueToStripeButton"
              label={t("ContinueToStripe")}
              size={ButtonSize.normal}
              primary
              scale
              onClick={onContinue}
              isLoading={isLoading}
              isDisabled={isDisabled}
              testId="first_topup_continue_to_stripe"
            />
            <Button
              key="CancelButton"
              label={t("CancelButton")}
              size={ButtonSize.normal}
              scale
              onClick={onClose}
              isDisabled={isLoading}
              testId="first_topup_cancel"
            />
          </div>
        </ModalDialog.Footer>
      </ModalDialog>
    );
  },
);

const FirstTopUpDialog: React.FC<FirstTopUpDialogProps> = (props) => (
  <AmountProvider>
    <FirstTopUpDialogContent {...props} />
  </AmountProvider>
);

export default FirstTopUpDialog;
