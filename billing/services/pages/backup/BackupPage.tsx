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

import React, { useState, useEffect } from "react";
import { useCommonTranslation } from "../../../../utils/i18n";
import { CommonTrans } from "../../../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";

import { Text } from "../../../../components/text";
import { Button, ButtonSize } from "../../../../components/button";

import ServiceToggleSection from "../../sub-components/ServiceToggleSection";
import TransactionHistory from "../../../shared/transaction-history";
import styles from "./BackupPage.module.scss";
import { TenantWalletService } from "@onlyoffice/docspace-api-sdk";
import { BACKUP_SERVICE } from "../../../constants";
import WalletInfo from "../../../shared/top-up-balance/sub-components/WalletInfo";
import { useApi } from "../../../../providers";
import { now, formatDateLocalized } from "../../../../utils/date";
import { getCookie } from "../../../../utils/cookie";
import { LANGUAGE } from "../../../../constants";
import { toastr } from "../../../../components";
import ConfirmationDialog from "../../sub-components/ConfirmationDialog";
import TopUpModal from "../../../shared/top-up-balance/TopUpModal";
import BackupPageLoader from "./BackupPageLoader";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";
import { getBrandName } from "../../../../constants/brands";

const BackupPage: React.FC = () => {
  const { paymentApi } = useApi();
  const paymentStore = usePaymentStore();
  const servicesStore = useServicesStore();

  const {
    formatWalletCurrency,
    availableBackupsCount,
    backupServicePrice,
    changeServiceState,
    isBackupServiceOn,
    isServiceActionDisabled,
  } = paymentStore;

  const { isFreeTariff, maxFreeBackups } = paymentStore.quotas;
  const { usedBackupsCount, isInitServicesData, initServiceData } =
    servicesStore;

  const t = useCommonTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [isTopUpVisible, setIsTopUpVisible] = useState(false);

  const shouldShowLoader = !isInitServicesData;
  const isDisabled = isServiceActionDisabled;

  useEffect(() => {
    initServiceData(t, BACKUP_SERVICE);
  }, []);

  const handleToggleChange = () => {
    setIsConfirmDialogVisible(true);
  };

  const onCloseConfirmDialog = () => {
    setIsConfirmDialogVisible(false);
  };

  const onConfirm = async () => {
    const raw = {
      service: TenantWalletService.Backup,
      enabled: !isBackupServiceOn,
    };

    setIsLoading(true);
    setIsConfirmDialogVisible(false);
    changeServiceState(BACKUP_SERVICE);

    try {
      await paymentApi.changeTenantWalletServiceState(raw);
    } catch (error) {
      console.error(error);
      toastr.error(t("UnexpectedError"));
      changeServiceState(BACKUP_SERVICE);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmationDialogContent = {
    title: t("Confirmation"),

    body: !isBackupServiceOn
      ? t("EnableBackupConfirm", {
          productName: getBrandName("ProductName"),
        })
      : isFreeTariff
        ? t("DisableBackupConfirmWithoutQuota", {
            productName: getBrandName("ProductName"),
          })
        : t("DisableBackupConfirm", {
            productName: getBrandName("ProductName"),
          }),
  };

  const onTopUp = () => {
    setIsTopUpVisible(true);
  };

  const onCloseTopUpModal = () => {
    setIsTopUpVisible(false);
  };

  const balance = formatWalletCurrency();

  const isLowBalance = isBackupServiceOn && availableBackupsCount === 0;

  if (shouldShowLoader) return <BackupPageLoader />;

  return (
    <div className={styles.container}>
      <ServiceToggleSection
        isEnabled={isBackupServiceOn!}
        onToggle={handleToggleChange}
        title={
          <Text fontSize="12px" fontWeight={400}>
            <CommonTrans
             
              i18nKey="BackupTitle"
              values={{
                currency: formatWalletCurrency(backupServicePrice, 2),
              }}
              components={{
                1: <Text as="span" fontSize="13px" fontWeight={600} />,
              }}
            />
          </Text>
        }
        description={t("BackupDescription")}
        isDisabled={isDisabled || isLoading}
      />
      <WalletInfo
        shortView
        withoutBackground
        balance={balance}
        onTopUp={isLowBalance && !isDisabled ? onTopUp : undefined}
      />
      {isLowBalance ? (
        <Text className={styles.lowBalance} fontSize="15px" fontWeight={600}>
          {t("NeedTopUpWallet")}
        </Text>
      ) : null}
      <div className={styles.backupsCard}>
        <div className={styles.backupsHeader}>
          <Text fontWeight="700" fontSize="14px">
            {isFreeTariff && !isBackupServiceOn
              ? t("PaidBackupDisabled")
              : t("AvailableBackups")}
          </Text>
        </div>

        {!isFreeTariff ? (
          <div className={styles.freeBackupsAmountContainer}>
            <div className={styles.backupsCount}>
              <Text fontSize="28px" fontWeight="700">
                {usedBackupsCount}
              </Text>{" "}
              <Text fontSize="20px" fontWeight="700">
                /{maxFreeBackups}
              </Text>
            </div>
            <Text className={styles.grayText}>{t("FreeMonthly")}</Text>
          </div>
        ) : null}
        {isBackupServiceOn ? (
          <>
            {!isFreeTariff ? <div className={styles.divider} /> : null}
            <div className={styles.backupsAmountContainer}>
              <Text fontSize="28px" fontWeight="700">
                {availableBackupsCount}
              </Text>
              <Text className={styles.grayText}>
                {t("CurrencyPerBackup", {
                  currency: formatWalletCurrency(backupServicePrice, 2),
                })}
              </Text>
            </div>
          </>
        ) : (
          <Button
            className={styles.backupButton}
            size={ButtonSize.small}
            label={
              !isFreeTariff
                ? t("EnablePaidBackup")
                : t("Enable")
            }
            onClick={handleToggleChange}
            isDisabled={isDisabled}
            primary
            scale
          />
        )}
      </div>
      {!isFreeTariff ? (
        <Text className={styles.backupPaidInfo}>
          <CommonTrans
           
            i18nKey="FreeBackupsRenewsDate"
            values={{
              date: formatDateLocalized(
                now()
                  .setZone(window.timezone)
                  .startOf("month")
                  .plus({ months: 1 }),
                "DATE_MED",
                { locale: getCookie(LANGUAGE) ?? "en" },
              ),
            }}
            components={{
              1: <Text fontWeight="600" as="span" />,
            }}
          />
        </Text>
      ) : null}
      {isFreeTariff && !isBackupServiceOn ? (
        <Text className={styles.backupPaidInfo}>
          {t("ActivateServiceToAllow")}
        </Text>
      ) : null}
      <div>
        <TransactionHistory serviceName={BACKUP_SERVICE} hideTypeFilter />
      </div>

      {isConfirmDialogVisible ? (
        <ConfirmationDialog
          visible={isConfirmDialogVisible}
          onClose={onCloseConfirmDialog}
          onConfirm={onConfirm}
          title={confirmationDialogContent.title}
          bodyText={confirmationDialogContent.body}
        />
      ) : null}
      {isTopUpVisible ? (
        <TopUpModal
          visible={isTopUpVisible}
          onClose={onCloseTopUpModal}
          serviceName={BACKUP_SERVICE}
        />
      ) : null}
    </div>
  );
};

export default observer(BackupPage);

