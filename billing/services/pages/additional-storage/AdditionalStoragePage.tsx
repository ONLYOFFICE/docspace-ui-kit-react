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

import React, { useState, useRef, useEffect } from "react";
import { useCommonTranslation } from "../../../../utils/i18n";
import { CommonTrans } from "../../../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";

import { Text } from "../../../../components/text";
import { Button, ButtonSize } from "../../../../components/button";
import {
  ContextMenu,
  type ContextMenuRefType,
} from "../../../../components/context-menu";

import ServiceToggleSection from "../../sub-components/ServiceToggleSection";
import BalanceAmount from "../../../shared/balance-amount";

import SettingsIcon from "../../../../assets/icons/16/catalog-settings-common.svg";
import PencilIcon from "../../../../assets/pencil.react.svg";
import RemoveSessionIcon from "../../../../assets/remove.session.svg";

import TransactionHistory from "../../../shared/transaction-history";
import styles from "./AdditionalStoragePage.module.scss";
import { DISK_STORAGE, STORAGE_ENUM } from "../../../constants";
import WalletInfo from "../../../shared/top-up-balance/sub-components/WalletInfo";
import SimpleTopUpDialog from "../../../shared/top-up-balance/SimpleTopUpDialog";
import { calculateTotalPrice, getConvertedSize } from "../../../utils/common";
import { useApi } from "../../../../providers";
import { toastr } from "../../../../components/toast";
import StoragePlanUpgrade from "../../panels/additional-storage/StoragePlanUpgrade";
import StoragePlanCancel from "../../panels/additional-storage/StoragePlanCancel";
import StorageWarning from "../../panels/additional-storage/StorageWarning";
import GracePeriodModal from "../../panels/additional-storage/GracePeriodModal";
import AdditionalStoragePageLoader from "./AdditionalStoragePageLoader";
import { useServicesActions } from "../../hooks/useServicesActions";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";
import StorageTariffDeactivated from "../../../dialogs/StorageTariffDeactivated";

type AdditionalStoragePageProps = {
  fetchPortalTariff?: () => Promise<void>;
  withBottomMargin?: boolean;
};

const AdditionalStoragePage: React.FC<AdditionalStoragePageProps> = ({
  withBottomMargin,
}) => {
  const { paymentApi } = useApi();
  const paymentStore = usePaymentStore();
  const servicesStore = useServicesStore();

  const {
    formatWalletCurrency,
    storagePriceIncrement,
    storageSizeIncrement,
    fetchBalance,
    walletCodeCurrency,
    storageServiceName,
    isShowStorageTariffDeactivatedModal,
    setStorageDeactivationVisited,
    isServiceActionDisabled,
  } = paymentStore;

  const {
    currentStoragePlanSize = 0,
    nextStoragePlanSize,
    storageExpiryDate = "",
    hasScheduledStorageChange,
    previousStoragePlanSize,
    isGracePeriod,
    hasStorageSubscription = false,
    walletCustomerEmail,
    fetchPortalTariff,
  } = paymentStore.tariff;

  const { isInitServicesData, initServiceData } = servicesStore;

  const t = useCommonTranslation();
  const contextMenuRef = useRef<ContextMenuRefType>(null);
  const [isStorageDialogVisible, setIsStorageDialogVisible] = useState(false);
  const [isCancelDialogVisible, setIsCancelDialogVisible] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isGracePeriodModalVisible, setIsGracePeriodModalVisible] =
    useState(false);
  const [isTopUpDialogVisible, setIsTopUpDialogVisible] = useState(false);

  useEffect(() => {
    initServiceData(t, DISK_STORAGE, STORAGE_ENUM);
  }, []);
  const shouldShowLoader = !isInitServicesData;

  const isDisabled = isServiceActionDisabled!;

  useEffect(() => {
    if (previousStoragePlanSize) {
      setStorageDeactivationVisited(true);
    }
  }, [previousStoragePlanSize]);

  const openUpgradeDialog = () => {
    if (isGracePeriod) {
      setIsGracePeriodModalVisible(true);
      return;
    }
    setIsStorageDialogVisible(true);
  };

  const openCancelDialog = () => {
    if (isGracePeriod) {
      setIsGracePeriodModalVisible(true);
      return;
    }
    setIsCancelDialogVisible(true);
  };

  const { isStorageCancellation } = useServicesActions();

  const isScheduled = !!hasScheduledStorageChange;
  const isDowngrade = isScheduled && !isStorageCancellation();

  const warningTitle = isStorageCancellation()
    ? t("CancellationScheduled", {
        fromSize: `${currentStoragePlanSize} ${t("Gigabyte")}`,
        toSize: `${nextStoragePlanSize ?? 0} ${t("Gigabyte")}`,
      })
    : t("DowngradeScheduled", {
        fromSize: `${currentStoragePlanSize} ${t("Gigabyte")}`,
        toSize: `${nextStoragePlanSize ?? 0} ${t("Gigabyte")}`,
      });

  const handleToggleChange = () => {
    if (hasStorageSubscription) openCancelDialog();
    else openUpgradeDialog();
  };

  const handleCancelChange = async () => {
    setIsCancelLoading(true);
    try {
      const walletRes = await paymentApi.updateWalletPayment({
        walletQuantityRequestDto: {
          quantity: { storage: null },
          productQuantityType: 0,
        },
      });
      const res = walletRes?.data?.response;
      if (res === false) throw new Error(t("UnexpectedError"));

      await Promise.all([fetchPortalTariff?.(), fetchBalance?.()]);

      toastr.success(t("StorageCapacityUpdated"));
    } catch (e) {
      toastr.error(e as unknown as string);
    } finally {
      setIsCancelLoading(false);
    }
  };

  const onCloseUpgradeStorage = () => {
    setIsStorageDialogVisible(false);
  };
  const onCloseCancelStorage = () => {
    setIsCancelDialogVisible(false);
  };

  const onCloseGracePeriod = () => {
    setIsGracePeriodModalVisible(false);
  };
  const monthlyPrice = calculateTotalPrice(
    currentStoragePlanSize,
    storagePriceIncrement,
  );
  const balance = formatWalletCurrency();

  const contextMenuItems = [
    {
      key: "edit",
      label: t("EditSubscription"),
      iconNode: <PencilIcon />,
      onClick: openUpgradeDialog,
    },
    {
      key: "cancel",
      label: t("CancelSubscription"),
      iconNode: <RemoveSessionIcon />,
      onClick: openCancelDialog,
    },
  ];

  const keyProp = isScheduled
    ? { tKey: "SubscriptionAutoCancellation" }
    : { tKey: "SubscriptionWillBeAutomaticallyRenewed" };

  if (shouldShowLoader) return <AdditionalStoragePageLoader />;

  const getTotalNextStoragePrice = () => {
    if (!nextStoragePlanSize) return;

    return calculateTotalPrice(+nextStoragePlanSize, storagePriceIncrement);
  };

  return (
    <div className={styles.container}>
      <ServiceToggleSection
        withBottomMargin={withBottomMargin}
        isEnabled={hasStorageSubscription}
        isDisabled={isDisabled || isScheduled}
        onToggle={handleToggleChange}
        title={t("AdditionalDiskStorage")}
        priceText={t("PerStorage", {
          currency: formatWalletCurrency(storagePriceIncrement, 2),
          amount: getConvertedSize(t, storageSizeIncrement || 0),
        })}
        description={t("AdjustStorageToExactAmount")}
      />

      <WalletInfo
        withoutBackground
        balance={balance}
        onTopUp={() => setIsTopUpDialogVisible(true)}
      />

      {isScheduled ? (
        <div style={{ marginTop: 16 }}>
          <StorageWarning
            title={warningTitle}
            onCancelChange={handleCancelChange}
            isCancelLoading={isCancelLoading}
            isDisabled={isDisabled}
          />
        </div>
      ) : null}

      <div className={styles.subscriptionSection}>
        <div className={styles.subscriptionHeader}>
          <Text fontWeight={700} fontSize="14px">
            {previousStoragePlanSize
              ? t("NoActiveSubscription")
              : t("CurrentSubscription")}
          </Text>
          {isDisabled || isScheduled || previousStoragePlanSize ? null : (
            <>
              <div
                className={styles.settingsIcon}
                onClick={(e) => contextMenuRef.current?.show(e)}
              >
                <SettingsIcon />
              </div>
              <ContextMenu ref={contextMenuRef} model={contextMenuItems} />
            </>
          )}
        </div>

        {currentStoragePlanSize ? (
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <Text className={styles.cardLabel}>{t("MonthlyCharge")}</Text>
              <BalanceAmount
                amount={monthlyPrice}
                currency={walletCodeCurrency}
                language={paymentStore.language}
                showRefresh={false}
                withoutMargin
                mainFontSize="18px"
                fractionFontSize="12px"
              />
              <Text className={styles.cardCaption}>
                {t("PerStorage", {
                  currency: formatWalletCurrency(storagePriceIncrement, 2),
                  amount: `1 ${t("Gigabyte")}`,
                })}
              </Text>
            </div>

            <div className={styles.summaryCard}>
              <Text className={styles.cardLabel}>{t("StorageAdded")}</Text>
              <Text className={styles.cardValue}>
                {`${currentStoragePlanSize} ${t("Gigabyte")}`}
              </Text>
              <Text className={styles.cardCaption}>
                {t("AdditionalDiskSpace")}
              </Text>
            </div>
          </div>
        ) : null}

        {!isScheduled || currentStoragePlanSize ? (
          <div className={styles.actionRow}>
            {isScheduled ? null : (
              <Button
                label={
                  previousStoragePlanSize
                    ? t("BuyStorage")
                    : t("EditSubscription")
                }
                size={ButtonSize.small}
                primary
                onClick={openUpgradeDialog}
                isDisabled={isDisabled}
                className="edit-subscription"
              />
            )}

            {currentStoragePlanSize ? (
              <Text className={styles.renewalText}>
                {isDowngrade ? (
                  <CommonTrans
                    i18nKey="SubscriptionAutoRenewedWithUpdate"
                    values={{
                      finalDate: storageExpiryDate,
                      price: formatWalletCurrency(
                        getTotalNextStoragePrice(),
                        2,
                      ),
                      amount: `${nextStoragePlanSize} ${t("Gigabyte")}`,
                    }}
                    components={{
                      1: <Text fontWeight="600" as="span" />,
                    }}
                  />
                ) : (
                  <CommonTrans
                    i18nKey={keyProp.tKey}
                    values={{
                      finalDate: storageExpiryDate,
                    }}
                    components={{
                      1: <Text fontWeight="600" as="span" />,
                    }}
                  />
                )}
              </Text>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className={styles.transactionSection}>
        <TransactionHistory
          serviceName={storageServiceName ?? DISK_STORAGE}
          hideTypeFilter
        />
      </div>

      {isShowStorageTariffDeactivatedModal ? (
        <StorageTariffDeactivated
          visible={isShowStorageTariffDeactivatedModal}
          onOpenPanel={() => setIsStorageDialogVisible(true)}
        />
      ) : null}
      {isStorageDialogVisible ? (
        <StoragePlanUpgrade
          visible={isStorageDialogVisible}
          onClose={onCloseUpgradeStorage}
          {...(previousStoragePlanSize && {
            previousValue: previousStoragePlanSize.toString(),
          })}
        />
      ) : null}
      {isCancelDialogVisible ? (
        <StoragePlanCancel
          visible={isCancelDialogVisible}
          onClose={onCloseCancelStorage}
        />
      ) : null}
      {isGracePeriodModalVisible ? (
        <GracePeriodModal
          visible={isGracePeriodModalVisible}
          onClose={onCloseGracePeriod}
        />
      ) : null}
      {isTopUpDialogVisible ? (
        <SimpleTopUpDialog
          visible={isTopUpDialogVisible}
          onClose={() => setIsTopUpDialogVisible(false)}
          isFirstTopUp={!walletCustomerEmail}
        />
      ) : null}
    </div>
  );
};

export default observer(AdditionalStoragePage);

