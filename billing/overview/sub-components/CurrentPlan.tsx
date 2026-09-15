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

import { useState } from "react";
import { observer } from "mobx-react";
import { ProductQuantityType } from "@onlyoffice/docspace-api-sdk";

import { Text } from "../../../components/text";
import { Button, ButtonSize } from "../../../components/button";
import { useCommonTranslation } from "../../../utils/i18n";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import SimpleTopUpDialog from "../../shared/top-up-balance/SimpleTopUpDialogWrapper";
import { getConvertedSize } from "../../utils/common";
import { MANAGER, ROOM, TOTAL_SIZE } from "../../constants";

import styles from "../Overview.module.scss";

type CurrentPlanProps = {
  onEditPlan?: () => void;
  isMobile?: boolean;
};

const CurrentPlan = ({ onEditPlan, isMobile }: CurrentPlanProps) => {
  const t = useCommonTranslation();
  const store = usePaymentStore();

  const {
    formatPaymentCurrency,
    isCardMissingOrInactive,
    walletBalance,
    isLoading,
    setBasicTariffContainer,
    executeWalletUpdate,
  } = store;
  const {
    currentTariffPlanTitle,
    currentPlanCost,
    isFreeTariff,
    quotaCharacteristics,
    maxCountManagersByQuota,
  } = store.quotas;
  const { isGracePeriod, gracePeriodEndDate, isDelayedPaymentMethod } =
    store.tariff;
  const [isTopUpDialogVisible, setIsTopUpDialogVisible] = useState(false);
  const openTopUpDialog = () => setIsTopUpDialogVisible(true);
  const closeTopUpDialog = () => setIsTopUpDialogVisible(false);

  const limitValue = (id: string) =>
    quotaCharacteristics.find((f) => f.id === id)?.value ?? 0;

  const overduePlanCost = currentPlanCost?.value ?? 0;
  const planPrice = formatPaymentCurrency(overduePlanCost, 2);

  const isBalanceInsufficient =
    isGracePeriod && walletBalance < overduePlanCost;
  const isDelayedPaymentTopUp = isBalanceInsufficient && isDelayedPaymentMethod;
  const topUpShortfall = Math.max(0, Math.ceil(overduePlanCost - walletBalance));

  const onRenewPlan = () => {
    setBasicTariffContainer();
    executeWalletUpdate(maxCountManagersByQuota, ProductQuantityType.Add, t);
  };

  const getPlanButtonLabel = () => {
    if (!isGracePeriod) return t("UpgradePlan");
    if (isDelayedPaymentTopUp) return t("TopUpWallet");
    if (isBalanceInsufficient) return t("TopUpAndRenew");
    return t("PayNow");
  };

  const getPlanButtonAction = () => {
    if (isDelayedPaymentTopUp) return openTopUpDialog;
    if (isGracePeriod) return onRenewPlan;
    return onEditPlan;
  };

  const planDetails = isFreeTariff
    ? t("PlanLimits", {
        admins: limitValue(MANAGER),
        rooms: limitValue(ROOM),
        storage: getConvertedSize(t, limitValue(TOTAL_SIZE)),
      })
    : isGracePeriod
      ? t("OverduePaymentBlockedAfter", {
          price: planPrice,
          date: gracePeriodEndDate,
        })
      : t("PlanCost", { admins: limitValue(MANAGER), price: planPrice });

  return (
    <div className={`${styles.card} ${styles.planCard}`}>
      <div className={styles.planInfo}>
        <Text fontSize="14px" fontWeight={700}>
          {t("CurrentPlan")}
        </Text>
        <Text fontSize="18px" fontWeight={700}>
          {currentTariffPlanTitle}
        </Text>
        <Text fontSize="12px">{planDetails}</Text>
      </div>
      {onEditPlan ? (
        <Button
          size={isMobile ? ButtonSize.normal : ButtonSize.small}
          label={getPlanButtonLabel()}
          onClick={getPlanButtonAction()}
          isDisabled={isGracePeriod && isCardMissingOrInactive}
          isLoading={isLoading}
          className={styles.planButton}
          testId="overview_edit_plan_button"
        />
      ) : null}

      {isTopUpDialogVisible ? (
        <SimpleTopUpDialog
          visible={isTopUpDialogVisible}
          onClose={closeTopUpDialog}
          minValue={topUpShortfall > 0 ? `${topUpShortfall}` : undefined}
        />
      ) : null}
    </div>
  );
};

export default observer(CurrentPlan);
