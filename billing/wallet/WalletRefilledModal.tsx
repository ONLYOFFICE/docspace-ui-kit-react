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
import { useCommonTranslation } from "../../utils/i18n";
import { CommonTrans } from "../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";

import { ModalDialog, ModalDialogType } from "../../components/modal-dialog";
import { Text } from "../../components/text";
import { Button, ButtonSize } from "../../components/button";
import { toastr } from "../../components/toast";

import AutomaticPaymentsBlock from "../shared/top-up-balance/sub-components/AutoPayments";

import styles from "./styles/Wallet.module.scss";
import { usePaymentStore } from "../store/PaymentStoreProvider";

type WalletRefilledModalProps = {
  visible: boolean;
  onClose?: () => void;
};

const WalletRefilledModal = (props: WalletRefilledModalProps) => {
  const { visible, onClose } = props;

  const paymentStore = usePaymentStore();

  const {
    updateAutoPayments,
    isAutomaticPaymentsEnabled,
    upToBalanceError,
    minBalanceError,
    upToBalance,
    minBalance,
    updatePreviousBalance,
    formatWalletCurrency,
    wasChangeBalance,
  } = paymentStore;

  const t = useCommonTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const formattedBalance = formatWalletCurrency!();

  const onCloseDialog = () => {
    updatePreviousBalance!();
    onClose?.();
  };

  const onAdditionalSave = async () => {
    const timerId = setTimeout(() => {
      setIsLoading(true);
    }, 200);

    try {
      await updateAutoPayments!();

      setIsLoading(false);
    } catch (error) {
      toastr.error(error as string);
    }

    clearTimeout(timerId);
    setIsLoading(false);
    onCloseDialog();
  };

  return (
    <ModalDialog
      visible={visible}
      onClose={onCloseDialog}
      displayType={ModalDialogType.modal}
      autoMaxHeight
    >
      <ModalDialog.Header>
        {wasChangeBalance ? t("WalletRefilled") : t("TopUpCredits")}
      </ModalDialog.Header>
      <ModalDialog.Body>
        <div className={styles.modalContent}>
          {wasChangeBalance ? (
            <>
              <div>
                <Text as="span">{t("ToppedUpWallet")}</Text>
                <br />
                <Text as="span">
                  <CommonTrans
                    i18nKey="AvailableCreditsAmount"
                    values={{ balance: formattedBalance }}
                    components={{
                      1: <span style={{ fontWeight: 600 }} />,
                    }}
                  />
                </Text>
              </div>
              <Text>{t("WouldYouLikeToEnableAutoTopUps")}</Text>
            </>
          ) : null}

          <AutomaticPaymentsBlock
            onAdditionalSave={onAdditionalSave}
            noMargin
          />
        </div>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          key="EnableButton"
          label={t("SaveButton")}
          size={ButtonSize.normal}
          primary
          scale
          onClick={onAdditionalSave}
          isDisabled={
            !isAutomaticPaymentsEnabled ||
            minBalanceError ||
            upToBalanceError ||
            !minBalance ||
            !upToBalance
          }
          isLoading={isLoading}
          testId="wallet_refilled_save_button"
        />
        <Button
          key="CancelButton"
          label={t("CancelButton")}
          size={ButtonSize.normal}
          scale
          onClick={onCloseDialog}
          testId="wallet_refilled_cancel_button"
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default observer(WalletRefilledModal);

