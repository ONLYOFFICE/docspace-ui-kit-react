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
import { DateTime } from "luxon";

import { Button, ButtonSize } from "../../../components/button";
import { Text } from "../../../components/text";
import { toastr } from "../../../components/toast";
import { useCommonTranslation } from "../../../utils/i18n";
import { getAppTimezone } from "../../../utils/date";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { finishRefreshingWithMinCycle } from "../../utils/refreshing";
import BalanceAmount from "../../shared/balance-amount";
import AutoPaymentInfo from "../../wallet/sub-components/AutoPaymentInfo";
import SimpleTopUpDialog from "../../shared/top-up-balance/SimpleTopUpDialogWrapper";
import WalletRefilledModal from "../../wallet/WalletRefilledModal";

import WarningIcon from "../../../assets/danger.toast.react.svg";

import styles from "../Overview.module.scss";

type AvailableCreditsProps = {
  isMobile?: boolean;
};

const AvailableCredits = ({ isMobile }: AvailableCreditsProps) => {
  const t = useCommonTranslation();
  const store = usePaymentStore();

  const {
    walletBalance,
    walletCodeCurrency,
    isCardLinkedToPortal,
    isPayer,
    recommendedAmount,
    fetchBalance,
    isAutoPaymentExist,
    autoPayments,
    wasFirstTopUp,
    language,
    formatWalletCurrency,
    upcomingPaymentsCurrentMonth,
  } = store;

  const { isNotPaidPeriod } = store.tariff;

  const toDueDay = (dueDate: string) =>
    DateTime.fromISO(dueDate).setZone(getAppTimezone()).toISODate();

  const sortedUpcoming = [...upcomingPaymentsCurrentMonth].sort(
    (a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate),
  );
  const nextPayment = sortedUpcoming[0];
  const nextDueDay = nextPayment && toDueDay(nextPayment.dueDate);
  const nextPaymentsTotal = sortedUpcoming
    .filter((item) => toDueDay(item.dueDate) === nextDueDay)
    .reduce((sum, item) => sum + item.amount, 0);
  const topUpShortfall = nextPayment ? nextPaymentsTotal - walletBalance : 0;

  const isNextPayment = nextPayment && topUpShortfall > 0;

  const [isTopUpDialogVisible, setIsTopUpDialogVisible] = useState(false);
  const [isWalletRefilledOpen, setIsWalletRefilledOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isAutoPaymentSetup = Boolean(
    isAutoPaymentExist &&
    language &&
    walletCodeCurrency &&
    autoPayments?.minBalance &&
    autoPayments?.upToBalance,
  );

  const onRefreshBalance = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    const startTime = Date.now();

    try {
      await fetchBalance?.(true);
    } catch (e) {
      toastr.error(e as Error);
    } finally {
      finishRefreshingWithMinCycle({
        startTime,
        setRefreshing: setIsRefreshing,
      });
    }
  };

  return (
    <div className={`${styles.card} ${styles.creditsCard}`}>
      <div className={styles.creditsTop}>
        <BalanceAmount
          className={styles.creditsBalance}
          title={t("AvailableCredits")}
          titleFontSize="14px"
          mainFontSize="28px"
          fractionFontSize="20px"
          showRefresh={!isNotPaidPeriod && isCardLinkedToPortal}
          isRefreshing={isRefreshing}
          onRefresh={onRefreshBalance}
          amount={walletBalance}
          currency={walletCodeCurrency}
          language={language}
          withoutMargin
        />
        {isPayer ? (
          <div className={styles.cardButtons}>
            <Button
              size={isMobile ? ButtonSize.normal : ButtonSize.small}
              primary
              label={t("TopUp")}
              onClick={() => setIsTopUpDialogVisible(true)}
              isDisabled={isNotPaidPeriod}
              className={styles.cardButton}
              testId="overview_top_up_button"
            />
            {wasFirstTopUp ? (
              <Button
                size={isMobile ? ButtonSize.normal : ButtonSize.small}
                label={t("AutoTopUp")}
                onClick={() => setIsWalletRefilledOpen(true)}
                isDisabled={isNotPaidPeriod}
                className={styles.cardButton}
                testId="overview_auto_top_up_button"
              />
            ) : null}
          </div>
        ) : null}
      </div>
      {isNextPayment ? (
        <div className={styles.topUpWarning}>
          <WarningIcon className={styles.topUpWarningIcon} />
          <Text
            as="span"
            fontSize="12px"
            fontWeight={600}
            lineHeight="16px"
            className={styles.topUpWarningText}
          >
            {t("TopUpBeforeNextPayment", {
              amount: formatWalletCurrency(
                Math.ceil(topUpShortfall),
                0,
                walletCodeCurrency,
              ),
              date: nextPayment.renewalDateShort,
            })}
          </Text>
        </div>
      ) : null}

      {isAutoPaymentSetup && !isNextPayment ? (
        <div className={styles.autoPaymentWrap}>
          <AutoPaymentInfo />
        </div>
      ) : null}

      {isTopUpDialogVisible ? (
        <SimpleTopUpDialog
          visible={isTopUpDialogVisible}
          onClose={() => setIsTopUpDialogVisible(false)}
          recommendedAmount={recommendedAmount}
        />
      ) : null}

      {isWalletRefilledOpen ? (
        <WalletRefilledModal
          visible={isWalletRefilledOpen}
          onClose={() => setIsWalletRefilledOpen(false)}
        />
      ) : null}
    </div>
  );
};

export default observer(AvailableCredits);

