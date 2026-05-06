// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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
import PencilIcon from "../../../../assets/pencil.react.svg?url";
import RemoveSessionIcon from "../../../../assets/remove.session.svg?url";

import TransactionHistory from "../../../shared/transaction-history";
import styles from "./AdditionalStoragePage.module.scss";
import { DISK_STORAGE, STORAGE_ENUM } from "../../../constants";
import WalletInfo from "../../../shared/top-up-balance/sub-components/WalletInfo";
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
};

const AdditionalStoragePage: React.FC<AdditionalStoragePageProps> = () => {
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
      icon: PencilIcon,
      onClick: openUpgradeDialog,
    },
    {
      key: "cancel",
      label: t("CancelSubscription"),
      icon: RemoveSessionIcon,
      onClick: openCancelDialog,
    },
  ];

  const keyProp = isScheduled
    ? { tKey: "SubscriptionAutoCancellation" }
    : { tKey: "SubscriptionWillBeAutomaticallyRenewed" };

  if (shouldShowLoader) return <AdditionalStoragePageLoader />;

  return (
    <div className={styles.container}>
      <ServiceToggleSection
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

      <WalletInfo shortView withoutBackground balance={balance} />

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

      <div className={styles.subscriptionCard}>
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
          <div className={styles.priceContainer}>
            <BalanceAmount
              amount={monthlyPrice}
              currency={walletCodeCurrency}
              showRefresh={false}
              withoutMargin
              mainFontSize="28px"
              fractionFontSize="20px"
            />
            <Text fontWeight={700} fontSize="20px">
              <CommonTrans
                i18nKey="SizePerMonth"
                values={{
                  size: `${currentStoragePlanSize} ${t("Gigabyte")}`,
                }}
                components={{
                  1: (
                    <Text
                      as="span"
                      fontSize="20px"
                      className={styles.sizeText}
                      fontWeight={700}
                    />
                  ),
                }}
              />
            </Text>
          </div>
        ) : null}

        {isScheduled ? null : (
          <Button
            className={styles.increaseButton}
            label={
              previousStoragePlanSize ? t("BuyStorage") : t("EditSubscription")
            }
            size={ButtonSize.small}
            primary
            onClick={openUpgradeDialog}
            isDisabled={isDisabled}
          />
        )}
      </div>

      {currentStoragePlanSize ? (
        <Text className={styles.renewalText}>
          {isDowngrade ? (
            <CommonTrans
              i18nKey="SubscriptionAutoRenewedWithUpdate"
              values={{
                finalDate: storageExpiryDate,
                price: formatWalletCurrency(monthlyPrice, 2),
                amount: `${currentStoragePlanSize} ${t("Gigabyte")}`,
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
    </div>
  );
};

export default observer(AdditionalStoragePage);
