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
import classNames from "classnames";

import { Text } from "../../components/text";
import {
  AI_ENUM,
  AI_TOOLS,
  BACKUP_SERVICE,
  DISK_STORAGE,
  TOTAL_SIZE,
} from "../constants";
import { calculateTotalPrice, getConvertedSize } from "../utils/common";
import type { TServiceFeatureWithPrice } from "../types";

import PriceIcon from "../../assets/icons/16/price.react.svg";

import styles from "./styles/AdditionalStorage.module.scss";
import { useServicesActions } from "./hooks/useServicesActions";
import { usePermissionTooltipText } from "./hooks/usePermissionTooltipText";

import ServiceCard from "./sub-components/ServiceCard";

import { usePaymentStore } from "../store/PaymentStoreProvider";
import { useServicesStore } from "../store/ServicesStoreProvider";
import { Link, LinkTarget } from "../../components/link";
import { CommonTrans } from "../../utils/i18n/CommonTrans";

type ServicesItemsProps = {
  onToggle?: (id: string, enabled: boolean) => void;
  onClick?: (id: string) => void;
  storageExpiryDate?: string;
  isMobile?: boolean;
  isTablet?: boolean;
  cardDisabled?: boolean;
  onOpenSupportedModels?: () => void;
};

const ServicesItems: React.FC<ServicesItemsProps> = ({
  onToggle,
  onClick,
  isMobile,
  isTablet,
  cardDisabled: forceCardDisabled,
  onOpenSupportedModels,
}) => {
  const paymentStore = usePaymentStore();

  const {
    isServiceActionDisabled,
    isPayer,
    isCardLinkedToPortal,
    servicesQuotasFeatures,
    storageSizeIncrement,
    storagePriceIncrement,
    formatWalletCurrency,
    availableBackupsCount,
    isBackupServiceOn,
    isStorageDeactivationVisited,
    isLowWalletBalance,
  } = paymentStore;

  const { isFreeTariff } = paymentStore.quotas;

  const {
    isGracePeriod,
    hasScheduledStorageChange,
    walletCustomerEmail,
    currentStoragePlanSize,
    nextStoragePlanSize,
    hasStorageSubscription,
    previousStoragePlanSize,
    storageExpiryDate,
  } = paymentStore.tariff;

  const isDisabled = isServiceActionDisabled;
  const { t } = useServicesActions();


  const permissionTooltipText = usePermissionTooltipText();

  const handleToggle = (
    e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>,
  ) => {
    const dataset = (e.currentTarget as HTMLElement).dataset;
    const handleDisabled = dataset.disabled?.toLowerCase() === "true";

    if (handleDisabled) return;

    e.preventDefault();
    e.stopPropagation();

    const isEnabled = dataset.enabled?.toLowerCase() === "true";
    const id = dataset.id;

    onToggle?.(id!, isEnabled);
  };

  const handleClick = (
    e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>,
  ) => {
    const dataset = (e.currentTarget as HTMLElement).dataset;
    const id = dataset.id;

    onClick?.(id!);
  };

  const onSupportedModelsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onOpenSupportedModels?.();
  };

  const onPricingLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const textTooltip = (
    <>
      <Text fontWeight={600} fontSize="12px">
        {t("StorageUpgradeMessage", {
          fromSize: `${currentStoragePlanSize} ${t("Gigabyte")}`,
          toSize: `${nextStoragePlanSize} ${t("Gigabyte")}`,
        })}
      </Text>
      <Text fontSize="12px">
        {nextStoragePlanSize === 0
          ? t("SubscriptionAutoCancellation", {
              finalDate: storageExpiryDate,
            })
          : t("SubscriptionAutoRenewed", {
              finalDate: storageExpiryDate,
            })}
      </Text>
    </>
  );

  const priceDescription = (
    serviceName: string | null | undefined,
    priceValue?: number,
    enabled?: boolean,
  ) => {
    switch (serviceName) {
      case TOTAL_SIZE:
        if (previousStoragePlanSize && !isStorageDeactivationVisited) {
          return t("SubscriptionDeactivated");
        }

        if (hasScheduledStorageChange) {
          return t("ChangeShedule");
        }

        if (!hasScheduledStorageChange && currentStoragePlanSize! > 0) {
          return t("CurrentPaymentMonth", {
            price: formatWalletCurrency(
              calculateTotalPrice(
                currentStoragePlanSize!,
                storagePriceIncrement,
              ),
              2,
            ),
            size: `${currentStoragePlanSize} ${t("Gigabyte")}`,
          });
        }

        return t("PerStorage", {
          currency: formatWalletCurrency(storagePriceIncrement, 2),
          amount: getConvertedSize(t, storageSizeIncrement || 0),
        });

      case BACKUP_SERVICE:
        if (isBackupServiceOn && availableBackupsCount === 0) {
          return isFreeTariff
            ? t("BackupsNotAvailable")
            : t("AdditionalBackupsNotAvailable");
        }

        if (isBackupServiceOn) {
          return t("BackupsAvailable", {
            currency: formatWalletCurrency(priceValue!, 2),
          });
        }

        return t("PerBackup", {
          currency: formatWalletCurrency(priceValue!, 2),
        });

      case AI_ENUM:
        if (isLowWalletBalance) {
          return (
            <CommonTrans
              i18nKey="AIPricingLowBalanceWithModels"
              values={{ price: formatWalletCurrency() }}
              components={{
                1: (
                  <Link
                    fontSize="13px"
                    fontWeight={600}
                    color="accent"
                    textDecoration="underline dotted"
                    onClick={onSupportedModelsClick}
                    dataTestId="ai_supported_models_link"
                  />
                ),
              }}
            />
          );
        }

        return (
          <CommonTrans
            i18nKey="AIUsagePricingNote"
            components={{
              1: (
                <Link
                  fontSize="13px"
                  fontWeight={600}
                  color="accent"
                  textDecoration="underline dotted"
                  href="https://openrouter.ai/models"
                  target={LinkTarget.blank}
                  onClick={onPricingLinkClick}
                  dataTestId="ai_openrouter_pricing_link"
                />
              ),
              2: (
                <Link
                  fontSize="13px"
                  fontWeight={600}
                  color="accent"
                  textDecoration="underline dotted"
                  onClick={onSupportedModelsClick}
                  dataTestId="ai_supported_models_link"
                />
              ),
            }}
          />
        );
      default:
        return "";
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Text className={styles.storageDescription}>
        {t("ConnectAndConfigureAddons")}
      </Text>

      <div
        className={classNames(styles.servicesWrapper, {
          [styles.servicesWrapperMobile]: isMobile,
          [styles.servicesWrapperTablet]: isTablet,
        })}
      >
        {(
          Array.from(
            servicesQuotasFeatures?.values() || [],
          ) as TServiceFeatureWithPrice[]
        ).map((item) => {
          if (!item.title || !item.image) return null;

          if (item.serviceName === BACKUP_SERVICE) {
            return (
              <ServiceCard
                key={item.id}
                cardDisabled={forceCardDisabled}
                toggleDisabled={isDisabled}
                priceTitle={item.priceTitle}
                id={item.id}
                image={item.image}
                isEnabled={item.value}
                serviceTitle={item.title}
                onClick={handleClick}
                onToggle={handleToggle}
                priceDescription={priceDescription(
                  item.serviceName,
                  item.price.value,
                )}
                tooltip={isDisabled ? permissionTooltipText : undefined}
                isWarningColor={
                  item.value && walletCustomerEmail
                    ? availableBackupsCount === 0
                    : false
                }
              />
            );
          }

          if (item.serviceName === AI_TOOLS) {
            return (
              <ServiceCard
                key={item.id}
                className={styles.aiCard}
                cardDisabled={forceCardDisabled}
                toggleDisabled={isDisabled}
                onClick={handleClick}
                onToggle={handleToggle}
                serviceTitle={item.title}
                priceDescription={priceDescription(item.id, 0, item.value)}
                priceTitle={item.priceTitle}
                id={item.id}
                image={item.image}
                isEnabled={item.value}
                tooltip={isDisabled ? permissionTooltipText : undefined}
                isErrorColor={isLowWalletBalance}
                icon={<PriceIcon />}
                withoutIcon={!isLowWalletBalance}
                withoutGreenColor
              />
            );
          }

          if (item.serviceName?.includes(DISK_STORAGE)) {
            const eventDisabled =
              isGracePeriod || isDisabled || hasScheduledStorageChange;

            return (
              <ServiceCard
                key={item.id}
                cardDisabled={
                  forceCardDisabled ||
                  (isCardLinkedToPortal && !isPayer
                    ? !hasStorageSubscription && !previousStoragePlanSize
                    : false)
                }
                toggleDisabled={!!eventDisabled}
                onClick={handleClick}
                onToggle={handleToggle}
                serviceTitle={item.title}
                priceDescription={priceDescription(item.id)}
                priceTitle={item.priceTitle}
                id={item.id}
                image={item.image}
                isEnabled={hasStorageSubscription}
                tooltip={isDisabled ? permissionTooltipText : undefined}
                priceTooltip={
                  hasScheduledStorageChange ? textTooltip : undefined
                }
                isWarningColor={hasScheduledStorageChange}
                isErrorColor={
                  !!previousStoragePlanSize && !isStorageDeactivationVisited
                }
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default observer(ServicesItems);

