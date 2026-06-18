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

import React, { useState, useEffect } from "react";
import { useCommonTranslation } from "../../../../utils/i18n";
import { CommonTrans } from "../../../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";

import { Text } from "../../../../components/text";
import { Button, ButtonSize } from "../../../../components/button";
import { Link } from "../../../../components/link";

import ServiceToggleSection from "../../sub-components/ServiceToggleSection";
import TransactionHistory from "../../../shared/transaction-history";
import styles from "./BackupPage.module.scss";
import { TenantWalletService } from "@onlyoffice/docspace-api-sdk";
import { BACKUP_SERVICE } from "../../../constants";
import WalletInfo from "../../../shared/top-up-balance/sub-components/WalletInfo";
import UnlinkedCardBanner from "../../../shared/unlinked-card-banner";
import { useApi } from "../../../../providers";
import {
  now,
  formatDateLocalized,
  formatWithTimezone,
  getAppTimezone,
} from "../../../../utils/date";
import { getCookie } from "../../../../utils/cookie";
import { LANGUAGE } from "../../../../constants";
import { toastr } from "../../../../components";
import ConfirmationDialog from "../../sub-components/ConfirmationDialog";
import SimpleTopUpDialog from "../../../shared/top-up-balance/SimpleTopUpDialogWrapper";
import BackupPageLoader from "./BackupPageLoader";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";
import { getBrandName } from "../../../../constants/brands";

type BackupPageProps = {
  withBottomMargin?: boolean;
  onViewMore?: () => void;
};

const BackupPage: React.FC<BackupPageProps> = ({
  withBottomMargin,
  onViewMore,
}) => {
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
    language,
  } = paymentStore;

  const { isFreeTariff, maxFreeBackups } = paymentStore.quotas;
  const {
    freeBackupsUsed,
    paidBackupsUsed,
    backupUsage,
    isInitServicesData,
    initServiceData,
  } = servicesStore;

  const t = useCommonTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [isTopUpVisible, setIsTopUpVisible] = useState(false);

  const shouldShowLoader = !isInitServicesData;
  const isDisabled = isServiceActionDisabled;

  useEffect(() => {
    initServiceData(t, BACKUP_SERVICE);
  }, []);

  // const handleToggleChange = () => {
  //   setIsConfirmDialogVisible(true);
  // };

  const onCloseConfirmDialog = () => {
    setIsConfirmDialogVisible(false);
  };

  const onConfirm = async () => {
    const raw = {
      service: TenantWalletService.Backup,
      enabled: !isBackupServiceOn,
    };

    setIsLoading(true);
    //  setIsConfirmDialogVisible(false);
    changeServiceState(BACKUP_SERVICE);

    try {
      await paymentApi.changeTenantWalletServiceState({
        changeWalletServiceStateRequestDto: raw,
      });
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

  const renewsDate = formatDateLocalized(
    now().setZone(window.timezone).startOf("month").plus({ months: 1 }),
    "DATE_MED",
    { locale: getCookie(LANGUAGE) ?? "en" },
  );

  const monthLabel = formatWithTimezone(now(), "LLLL yyyy", {
    locale: language,
    timezone: getAppTimezone(),
  });

  const monthSpend = backupUsage?.totalAmount ?? 0;
  const totalBackupsUsed = freeBackupsUsed + paidBackupsUsed;

  if (shouldShowLoader) return <BackupPageLoader />;

  return (
    <div className={styles.container}>
      <ServiceToggleSection
        withBottomMargin={withBottomMargin}
        isEnabled={isBackupServiceOn!}
        onToggle={onConfirm}
        title={
          <Text fontSize="12px" fontWeight={400}>
            <CommonTrans
              i18nKey="AdditionalBackupsTitle"
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
      <WalletInfo withoutBackground balance={balance} onTopUp={onTopUp} />
      {!paymentStore.tariff.isNotPaidPeriod && paymentStore.tariff.walletCustomerStatusNotActive ? (
        <div className={styles.unlinkedBanner}>
          <UnlinkedCardBanner />
        </div>
      ) : null}
      {isLowBalance ? (
        <Text className={styles.lowBalance} fontSize="15px" fontWeight={600}>
          {t("NeedTopUpWallet")}
        </Text>
      ) : null}
      <div className={styles.section}>
        <Text fontWeight="700" fontSize="14px">
          {t("AvailableBackups")}
        </Text>

        <div className={styles.cardsGrid}>
          {!isFreeTariff ? (
            <div className={styles.card}>
              <Text className={styles.cardLabel}>
                {t("FreeMonthlyBackups")}
              </Text>
              <Text className={styles.cardValue}>
                {`${freeBackupsUsed}/${maxFreeBackups}`}
              </Text>
              <Text className={styles.cardCaption}>
                {t("RenewsOnDate", { date: renewsDate })}
              </Text>
            </div>
          ) : null}

          <div className={styles.card}>
            {isBackupServiceOn ? (
              <>
                <Text className={styles.cardLabel}>
                  {t("AdditionalBackups")}
                </Text>
                <Text className={styles.cardValue}>
                  {availableBackupsCount}
                </Text>
                <Text className={styles.cardCaption}>
                  {t("PerBackup", {
                    currency: formatWalletCurrency(backupServicePrice, 2),
                  })}
                </Text>
              </>
            ) : (
              <>
                <Text fontWeight={600}>{t("AdditionalBackupsDisabled")}</Text>
                <Button
                  className={styles.cardEnableButton}
                  size={ButtonSize.small}
                  label={t("Enable")}
                  onClick={onConfirm}
                  isDisabled={isDisabled}
                  primary
                  scale
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Text fontWeight="700" fontSize="14px">
            {t("Usage")}
          </Text>
          {onViewMore ? (
            <Link
              className={styles.viewMoreLink}
              fontSize="13px"
              fontWeight="600"
              color="accent"
              textDecoration="underline"
              onClick={onViewMore}
              dataTestId="backup_view_more_link"
            >
              {t("ViewMore")}
            </Link>
          ) : null}
        </div>

        <div className={styles.cardsGrid}>
          <div className={styles.card}>
            <Text className={styles.cardLabel}>{t("MonthSpend")}</Text>
            <Text className={styles.cardValue}>
              {formatWalletCurrency(monthSpend, 2)}
            </Text>
            <Text className={styles.cardCaption}>
              {t("ForPeriod", { period: monthLabel })}
            </Text>
          </div>

          <div className={styles.card}>
            <Text className={styles.cardLabel}>{t("MonthUsage")}</Text>
            <Text className={styles.cardValue}>{totalBackupsUsed}</Text>
            {totalBackupsUsed > 0 ? (
              <>
                {!isFreeTariff ? (
                  <Text className={styles.cardCaption}>
                    {t("FreeBackups", { count: freeBackupsUsed })}
                  </Text>
                ) : null}
                <Text className={styles.cardCaption}>
                  {isFreeTariff
                    ? t("BilledBackupsLabel")
                    : t("BilledBackups", { count: paidBackupsUsed })}
                </Text>
              </>
            ) : (
              <Text className={styles.cardCaption}>
                {t("NoBackupsUsedInMonth", { month: monthLabel })}
              </Text>
            )}
          </div>
        </div>
      </div>

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
        <SimpleTopUpDialog
          visible={isTopUpVisible}
          onClose={onCloseTopUpModal}
          isFirstTopUp={!paymentStore.tariff.walletCustomerEmail}
        />
      ) : null}
    </div>
  );
};

export default observer(BackupPage);

