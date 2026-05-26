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

import React from "react";
import { observer } from "mobx-react";

import { Button, ButtonSize } from "../../../../components/button";

import { useServicesActions } from "../../hooks/useServicesActions";
import { usePaymentContext } from "../../context/PaymentContext";

import styles from "../../styles/index.module.scss";
import { Text } from "../../../../components";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";

interface ButtonContainerProps {
  onClose: () => void;
  onBuy: () => void;
  onSendRequest: () => void;
  isLoading: boolean;
  isExceedingStorageLimit: boolean;
  isPaymentBlockedByBalance: boolean;
  isCurrentStoragePlan?: boolean;
  isPaymentBlocked?: boolean;
  totalPrice?: number;
  isDisabled?: boolean;
  currentStoragePlanSize?: number;
  isDowngradeStoragePlan?: boolean;
}

const ButtonContainer: React.FC<ButtonContainerProps> = (props) => {
  const {
    isExceedingStorageLimit,
    onClose,
    isLoading,
    onBuy,
    onSendRequest,
    isPaymentBlockedByBalance,
    isCurrentStoragePlan,
    isPaymentBlocked,
    totalPrice = 0,
    isDowngradeStoragePlan,
    isDisabled,
  } = props;

  const paymentStore = usePaymentStore();
  const { hasStorageSubscription, storageExpiryDate } = paymentStore.tariff;
  const { formatWalletCurrency } = paymentStore;

  const { t } = useServicesActions();
  const { isWaitingCalculation } = usePaymentContext();

  const title = !hasStorageSubscription
    ? t("UpgradeNow")
    : isExceedingStorageLimit
      ? t("SendRequest")
      : t("Update");

  return (
    <div className={styles.buttonWrapper}>
      {hasStorageSubscription &&
      !isDowngradeStoragePlan &&
      !isCurrentStoragePlan &&
      !isPaymentBlocked &&
      !isExceedingStorageLimit &&
      totalPrice > 0 ? (
        <Text>
          {t("NextMonthBillDate", {
            currency: formatWalletCurrency(totalPrice, 2),
            date: storageExpiryDate,
          })}
        </Text>
      ) : null}

      <div className={styles.buttonContainer}>
        <Button
          key="OkButton"
          label={title}
          size={ButtonSize.normal}
          primary
          scale
          onClick={isExceedingStorageLimit ? onSendRequest : onBuy}
          isLoading={isLoading}
          isDisabled={
            isPaymentBlocked ||
            isPaymentBlockedByBalance ||
            isCurrentStoragePlan ||
            isDisabled ||
            isWaitingCalculation
          }
          testId="storage_plan_upgrade_ok_button"
        />
        <Button
          key="CancelButton"
          label={t("CancelButton")}
          size={ButtonSize.normal}
          scale
          onClick={onClose}
          isDisabled={isLoading}
          testId="storage_plan_upgrade_cancel_button"
        />
      </div>
    </div>
  );
};

export default observer(ButtonContainer);

