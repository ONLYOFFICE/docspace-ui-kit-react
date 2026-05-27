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

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useCommonTranslation } from "../../../../utils/i18n";
import { CommonTrans } from "../../../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";

import { Text } from "../../../../components/text";
import { TextInput, InputType } from "../../../../components/text-input";
import { FieldContainer } from "../../../../components/field-container";

import {
  ModalDialog,
  ModalDialogType,
} from "../../../../components/modal-dialog";
import { toastr } from "../../../../components/toast";
import { useApi } from "../../../../providers";
import { calculateTotalPrice } from "../../../utils/common";
import {
  DISK_STORAGE,
  STORAGE_DEACTIVATION_VISITED,
  STORAGE_TARIFF_DEACTIVATED,
} from "../../../constants";
import { useNavigate } from "react-router";

import styles from "../../styles/index.module.scss";

import { useServicesActions } from "../../hooks/useServicesActions";
import { PaymentProvider } from "../../context/PaymentContext";
import ButtonContainer from "./ButtonContainer";

import CurrentSubscription from "./CurrentSubscription";
import OrderSummary from "./OrderSummary";
import WalletContainer from "./WalletContainer";
import TopUpContainer from "./TopUpContainer";
import StorageWarning from "./StorageWarning";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";
import SalesDepartmentRequestDialog from "../../../dialogs/SalesDepartmentRequestDialog";

type StorageDialogProps = {
  visible: boolean;
  onClose: () => void;
  previousValue?: string;
};

const MAX_ATTEMPTS = 30;
const MIN_VALUE = 100;

const StoragePlanUpgrade: React.FC<StorageDialogProps> = ({
  visible,
  onClose,
  previousValue = "",
}) => {
  const { paymentApi } = useApi();
  const paymentStore = usePaymentStore();
  const servicesStore = useServicesStore();

  const {
    hasStorageSubscription,
    currentStoragePlanSize = 0,
    hasScheduledStorageChange,
    fetchPortalTariff,
  } = paymentStore.tariff;

  const {
    fetchBalance,
    fetchTransactionHistory,
    storageServiceName,
    storagePriceIncrement,
    formatWalletCurrency,
    walletBalance,
  } = paymentStore;

  const {
    isVisibleWalletSettings,
    partialUpgradeFee,
    featureCountData = 0,
    setPartialUpgradeFee,
  } = servicesStore;

  const t = useCommonTranslation();
  const [amount, setAmount] = useState<string>(
    isVisibleWalletSettings
      ? featureCountData.toString()
      : previousValue
        ? previousValue
        : "",
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isVisibleContainer, setIsVisibleContainer] = useState(
    isVisibleWalletSettings,
  );
  const [isRequestDialog, setIsRequestDialog] = useState(false);
  const [debouncedAmount, setDebouncedAmount] = useState(amount);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      (setDebouncedAmount(amount), setIsWaiting(false));
    }, 1000);
    return () => clearTimeout(timer);
  }, [amount]);

  const {
    isExceedingPlanLimit,
    isCurrentPlan,
    calculateDifferenceBetweenPlan,
    isWalletBalanceInsufficient,
    isPlanUpgrade,
    isPlanDowngrade,
  } = useServicesActions();

  const isExceedingStorageLimit = isExceedingPlanLimit(+debouncedAmount);
  const isCurrentStoragePlan = isCurrentPlan(+debouncedAmount);
  const totalPrice = calculateTotalPrice(
    +debouncedAmount,
    storagePriceIncrement,
  );

  const isUpgradeStoragePlan = isPlanUpgrade(+debouncedAmount);
  const isDowngradeStoragePlan = isPlanDowngrade(+debouncedAmount);
  const hasMinError = +debouncedAmount > 0 && +debouncedAmount < MIN_VALUE;
  const newStorageSizeOnUpgrade =
    isUpgradeStoragePlan && currentStoragePlanSize! > 0;

  const isPaymentBlockedByBalance =
    isDowngradeStoragePlan || isExceedingStorageLimit
      ? false
      : newStorageSizeOnUpgrade
        ? isWalletBalanceInsufficient(partialUpgradeFee)
        : isWalletBalanceInsufficient(totalPrice);

  const isPaymentBlocked =
    (!hasScheduledStorageChange && +amount < MIN_VALUE && amount === "") ||
    +amount < MIN_VALUE;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isWaitingRef = useRef(false);

  const recommendedAmount = isPaymentBlockedByBalance
    ? hasStorageSubscription && isUpgradeStoragePlan
      ? Math.ceil(partialUpgradeFee - walletBalance)
      : Math.ceil(totalPrice - walletBalance)
    : 0;

  const amountRef = useRef(amount);
  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setPartialUpgradeFee(0);
    };
  }, []);

  const onCloseDialog = useCallback(() => {
    onClose();
  }, []);

  const resetIntervalSuccess = async (isCancellation: boolean) => {
    if (isUpgradeStoragePlan) onCloseDialog();

    if (isCancellation || !isUpgradeStoragePlan)
      setAmount(String(currentStoragePlanSize ?? ""));

    if (intervalRef.current) {
      toastr.success(t("StorageCapacityUpdated"));
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (localStorage.getItem(STORAGE_TARIFF_DEACTIVATED) !== null) {
      localStorage.removeItem(STORAGE_TARIFF_DEACTIVATED);
    }

    if (localStorage.getItem(STORAGE_DEACTIVATION_VISITED) !== null) {
      localStorage.removeItem(STORAGE_DEACTIVATION_VISITED);
    }

    setIsLoading(false);
  };

  const isUpdatedTariff = (
    walletQuotas: { quantity?: number; nextQuantity?: number | null }[],
    isCancellation: boolean,
  ) => {
    const walletQuantity =
      isUpgradeStoragePlan || isCancellation
        ? walletQuotas[0]?.quantity
        : walletQuotas[0]?.nextQuantity;

    const updated = isCancellation
      ? !walletQuotas[0]?.nextQuantity
      : walletQuantity === +amountRef.current;

    return updated;
  };

  const waitingForTariff = useCallback(
    (isCancellation: boolean) => {
      isWaitingRef.current = false;
      let requestsCount = 0;

      intervalRef.current = setInterval(async () => {
        try {
          if (requestsCount === MAX_ATTEMPTS) {
            setIsLoading(false);
            toastr.error(t("ErrorNotification"));
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            return;
          }

          requestsCount++;

          if (isWaitingRef.current) return;
          isWaitingRef.current = true;

          const tariff = await fetchPortalTariff!(true);
          const quotas = tariff?.quotas ?? [];

          if (isUpdatedTariff(quotas, isCancellation)) {
            resetIntervalSuccess(isCancellation);
          }
        } catch (e) {
          setIsLoading(false);
          toastr.error(e as unknown as string);
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
        } finally {
          isWaitingRef.current = false;
        }
      }, 2000);
    },
    [isUpgradeStoragePlan],
  );

  const handleStoragePlanChange = useCallback(
    async (isCancellation: boolean = false) => {
      if (isLoading) return;

      setIsLoading(true);

      const amountValue = +amountRef.current;
      const difference = calculateDifferenceBetweenPlan(amountValue);
      const productType = isUpgradeStoragePlan && !isCancellation ? 1 : 0;
      const quantity = isUpgradeStoragePlan ? difference : amountValue;
      const value = isCancellation ? null : quantity;

      const isNewSubscription = !hasStorageSubscription;

      try {
        const walletRes = await paymentApi.updateWalletPayment({
          walletQuantityRequestDto: {
            quantity: value !== null ? { storage: value } : null,
            productQuantityType: productType,
          },
        });
        const res = walletRes?.data?.response;

        if (res === false) {
          throw new Error(t("UnexpectedError"));
        }

        if (isNewSubscription) {
          const targetPath = `${paymentStore.routes.diskStorage}?complete=true`;

          if (!window.location.pathname.includes("/disk-storage")) {
            navigate(targetPath);
          }
          return;
        }

        if (isUpgradeStoragePlan) {
          fetchBalance();
          fetchTransactionHistory(storageServiceName ?? DISK_STORAGE);
        }
        const tariff = await fetchPortalTariff!(true);
        const quotas = tariff?.quotas ?? [];

        if (isUpdatedTariff(quotas, isCancellation)) {
          resetIntervalSuccess(isCancellation);
        } else {
          waitingForTariff(isCancellation);
        }

        onClose();
      } catch (e) {
        toastr.error(e as Error);
        setIsLoading(false);
      }
    },
    [isLoading, isUpgradeStoragePlan],
  );

  const onBuy = useCallback(
    () => handleStoragePlanChange(),
    [handleStoragePlanChange],
  );

  const onSendRequest = useCallback(() => {
    setIsRequestDialog(true);
  }, []);

  const onTopUpClick = useCallback(() => {
    setIsVisibleContainer(true);
  }, []);

  const onChangeNumber = (value: string) => {
    setAmount(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, validity } = e.target;

    if (!validity.valid) return;

    onChangeNumber(value);
    setIsWaiting(true);
  };

  const onCloseTopUpModal = () => {
    setIsVisibleContainer(false);
  };

  const container = isVisibleContainer ? (
    <TopUpContainer
      isVisibleContainer={isVisibleContainer}
      onCloseTopUpModal={onCloseTopUpModal}
      amount={+amount}
      initialAmount={recommendedAmount}
    />
  ) : null;

  if (isRequestDialog) {
    return (
      <SalesDepartmentRequestDialog
        visible={isRequestDialog}
        onClose={() => setIsRequestDialog(false)}
      />
    );
  }

  return (
    <PaymentProvider>
      <ModalDialog
        visible={visible}
        onClose={onClose}
        displayType={ModalDialogType.aside}
        containerVisible={isVisibleContainer}
        withBodyScroll
      >
        <ModalDialog.Container>{container}</ModalDialog.Container>
        <ModalDialog.Header>
          {hasStorageSubscription
            ? t("EditSubscription")
            : t("AdditionalDiskStorage")}
        </ModalDialog.Header>
        <ModalDialog.Body>
          <div className={styles.dialogBody}>
            <WalletContainer
              onTopUp={onTopUpClick}
              isPaymentBlockedByBalance={isPaymentBlockedByBalance}
              isExceedingStorageLimit={isExceedingStorageLimit}
              isCurrentStoragePlan={isCurrentStoragePlan}
              isDowngradeStoragePlan={isDowngradeStoragePlan}
              isLoading={isLoading}
              hasMinError={hasMinError}
            />

            <div className={styles.inputSection}>
              <Text fontWeight={600}>
                {!hasStorageSubscription
                  ? t("AmoutWithStorageUnit", {
                      storageUnit: t("Gigabyte"),
                    })
                  : t("NewTotalStorage", {
                      storageUnit: t("Gigabyte"),
                    })}
              </Text>
              <FieldContainer
                isVertical
                errorMessage={
                  hasMinError
                    ? t("MinCurrency", {
                        currency: `${MIN_VALUE} ${t("Gigabyte")}`,
                      })
                    : ""
                }
                hasError={hasMinError}
                removeMargin
              >
                <TextInput
                  className={styles.storageInput}
                  value={amount}
                  type={InputType.text}
                  onChange={handleInputChange}
                  onFocus={(e) => e.target.select()}
                  isDisabled={!!hasScheduledStorageChange || isLoading}
                  isAutoFocussed
                  hasError={hasMinError}
                  pattern="^(?!^0(?:\.\d{0,2})?$)\d+(?:\.\d{0,2})?$"
                  scale
                />
              </FieldContainer>
              {!hasMinError ? (
                <Text className={styles.perStorageInfo} fontSize="12px">
                  <CommonTrans
                    i18nKey="PerStorageWitnMinValue"
                    values={{
                      currency: formatWalletCurrency(storagePriceIncrement, 2),
                      amount: `1 ${t("Gigabyte")}`,
                      minValue: MIN_VALUE,
                      storageUnit: t("Gigabyte"),
                    }}
                    components={{
                      1: <Text as="span" fontSize="12px" fontWeight={600} />,
                    }}
                  />
                </Text>
              ) : null}
            </div>
            <div className={styles.dialogBodyContent}>
              {hasStorageSubscription && currentStoragePlanSize ? (
                <CurrentSubscription />
              ) : null}
              {(!isCurrentStoragePlan && debouncedAmount && !hasMinError) ||
              !hasStorageSubscription ? (
                <OrderSummary
                  amount={+debouncedAmount}
                  totalPrice={totalPrice}
                  isUpgradeStoragePlan={isUpgradeStoragePlan}
                  isDowngradeStoragePlan={isDowngradeStoragePlan}
                  recommendedAmount={recommendedAmount}
                  hasMinError={hasMinError}
                  isExceedingStorageLimit={isExceedingStorageLimit}
                />
              ) : null}
            </div>
            {isDowngradeStoragePlan && debouncedAmount && !hasMinError ? (
              <div className={styles.warningContainer}>
                <StorageWarning />
              </div>
            ) : null}
          </div>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <ButtonContainer
            isDowngradeStoragePlan={isDowngradeStoragePlan}
            totalPrice={totalPrice}
            isCurrentStoragePlan={isCurrentStoragePlan}
            isExceedingStorageLimit={isExceedingStorageLimit}
            onClose={onCloseDialog}
            isLoading={isLoading}
            onBuy={onBuy}
            onSendRequest={onSendRequest}
            isPaymentBlockedByBalance={isPaymentBlockedByBalance}
            isPaymentBlocked={isPaymentBlocked}
            isDisabled={isWaiting}
          />
        </ModalDialog.Footer>
      </ModalDialog>
    </PaymentProvider>
  );
};

export default observer(StoragePlanUpgrade);
