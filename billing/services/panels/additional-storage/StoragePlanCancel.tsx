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
import { CommonTrans } from "../../../../utils/i18n/CommonTrans";

import {
  ModalDialog,
  ModalDialogType,
} from "../../../../components/modal-dialog";
import { toastr } from "../../../../components/toast";
import { useApi } from "../../../../providers";
import { Button, ButtonSize } from "../../../../components/button";
import { calculateTotalPrice, getConvertedSize } from "../../../utils/common";
import { Text } from "../../../../components/text";

import { useServicesActions } from "../../hooks/useServicesActions";
import { PaymentProvider } from "../../context/PaymentContext";
import styles from "../../styles/index.module.scss";
import StorageWarning from "./StorageWarning";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";

type StorageDialogProps = {
  visible: boolean;
  onClose: () => void;
};

const StoragePlanCancel: React.FC<StorageDialogProps> = ({
  visible,
  onClose,
}) => {
  const { paymentApi } = useApi();
  const paymentStore = usePaymentStore();

  const {
    fetchBalance,
    storagePriceIncrement,
    handleServicesQuotas,
    formatWalletCurrency,
  } = paymentStore;

  const { currentStoragePlanSize, fetchPortalTariff } = paymentStore.tariff;
  const { usedTotalStorageSizeCount } = paymentStore.quotas;

  const totalPrice = calculateTotalPrice(
    currentStoragePlanSize,
    storagePriceIncrement,
  );

  const [isLoading, setIsLoading] = useState(false);

  const { t } = useServicesActions();

  const handleStoragePlanChange = async () => {
    const timerId = setTimeout(() => {
      setIsLoading(true);
    }, 200);

    try {
      const walletRes = await paymentApi.updateWalletPayment({
        walletQuantityRequestDto: {
          quantity: { storage: 0 },
          productQuantityType: 0,
        },
      });
      const res = walletRes?.data?.response;

      if (res === false) {
        toastr.error(t("UnexpectedError"));

        clearTimeout(timerId);
        setIsLoading(false);

        return;
      }

      await Promise.all([fetchPortalTariff?.(), handleServicesQuotas()]);

      onClose();
      fetchBalance();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      toastr.error(errorMessage);
    }

    clearTimeout(timerId);
    setIsLoading(false);
  };

  return (
    <PaymentProvider>
      <ModalDialog
        visible={visible}
        onClose={onClose}
        displayType={ModalDialogType.modal}
        autoMaxHeight
        isLarge
      >
        <ModalDialog.Header>{t("SubscriptionCancellation")}</ModalDialog.Header>
        <ModalDialog.Body>
          <div className={styles.cancelDialog}>
            <Text>{t("WantToCancelStoragePlan")}</Text>
            <br />
            <Text as="span">
              <CommonTrans
                i18nKey="YourCurrentPlan"
                values={{
                  amount: `${currentStoragePlanSize} ${t("Gigabyte")}`,
                  price: formatWalletCurrency(totalPrice, 2),
                }}
                components={{
                  1: <Text fontWeight={600} as="span" />,
                  2: <Text className={styles.monthPayment} as="span" />,
                }}
              />
            </Text>
            <Text>
              <CommonTrans
                i18nKey="StorageUsed"
                values={{
                  amount: getConvertedSize(t, usedTotalStorageSizeCount),
                }}
                components={{
                  1: <Text fontWeight={600} as="span" />,
                }}
              />
            </Text>
          </div>
          <StorageWarning />
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            key="OkButton"
            label={t("Yes")}
            size={ButtonSize.normal}
            primary
            onClick={handleStoragePlanChange}
            isLoading={isLoading}
            testId="storage_plan_cancel_ok_button"
          />
          <Button
            key="CancelButton"
            label={t("No")}
            size={ButtonSize.normal}
            onClick={onClose}
            testId="storage_plan_cancel_no_button"
          />
        </ModalDialog.Footer>
      </ModalDialog>
    </PaymentProvider>
  );
};

export default observer(StoragePlanCancel);
