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

import React, { useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react";
import { useCommonTranslation } from "../../utils/i18n";
import { CommonTrans } from "../../utils/i18n/CommonTrans";

import { toAbsoluteUrl } from "../utils/url";

import { Text } from "../../components/text";
import { Button, ButtonSize } from "../../components/button";
import { toastr } from "../../components/toast";
import { Link } from "../../components/link";
import { Tabs, type TTabItem } from "../../components/tabs";
import { finishRefreshingWithMinCycle } from "../utils/refreshing";

import TransactionHistory from "../shared/transaction-history";
import UpcomingPayments from "./sub-components/UpcomingPayments";
import TopUpModal from "../shared/top-up-balance/TopUpModal";
import WalletRefilledModal from "./WalletRefilledModal";
import AutoPaymentInfo from "./sub-components/AutoPaymentInfo";
import PluginIncompatibleSvg from "../../assets/plugin.incompatible.react.svg";
import styles from "./styles/Wallet.module.scss";
import BalanceAmount from "../shared/balance-amount";
import { usePaymentStore } from "../store/PaymentStoreProvider";
import { getBrandName } from "../../constants/brands";
import FirstTopUpDialog from "../shared/top-up-balance/FirstTopUpDialog";

type WalletProps = {
  isMobile?: boolean;
  onViewUsage?: () => void;
  onAddonsClick?: () => void;
};

const Wallet = (props: WalletProps) => {
  const { isMobile, onViewUsage, onAddonsClick } = props;

  const store = usePaymentStore();

  const {
    walletBalance,
    walletMonthToDateSpend,
    walletCodeCurrency,
    isCardLinkedToPortal,
    isVisibleWalletSettings,
    wasChangeBalance,
    fetchBalance,
    fetchTransactionHistory,
    canUpdateTariff,
    cardLinked,
    isPayer,
    recommendedAmount,
    walletHelpUrl,
    isAutoTopUpInProgress,
    autoPayments,
    isAutoPaymentExist,
    language,
    wasFirstTopUp,
  } = store;

  const isAutoPaymentSetup = Boolean(
    isAutoPaymentExist &&
    language &&
    walletCodeCurrency &&
    autoPayments?.minBalance &&
    autoPayments?.upToBalance,
  );

  const {
    isNotPaidPeriod,
    walletCustomerStatusNotActive,
    walletCustomerEmail,
  } = store.tariff;

  const t = useCommonTranslation();

  const [visible, setVisible] = useState(isVisibleWalletSettings);
  const [isEditAutoPayment, setIsEditAutoPayment] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFirstTopUpDialogVisible, setIsFirstTopUpDialogVisible] =
    useState(false);
  const [isWalletRefilledOpen, setIsWalletRefilledOpen] = useState(false);
  const [selectedTabId, setSelectedTabId] = useState("transaction-history");

  const [isAutoSpinning, setIsAutoSpinning] = useState(isAutoTopUpInProgress);
  const autoStartTimeRef = useRef<number | null>(null);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(store.language || "en", {
        month: "long",
        year: "numeric",
      }).format(new Date()),
    [store.language],
  );

  useEffect(() => {
    if (isAutoTopUpInProgress) {
      autoStartTimeRef.current ??= Date.now();
      setIsAutoSpinning(true);
      return;
    }

    const startTime = autoStartTimeRef.current;

    if (startTime === null) {
      setIsAutoSpinning(false);
      return;
    }

    autoStartTimeRef.current = null;

    const timerId = finishRefreshingWithMinCycle({
      startTime,
      setRefreshing: setIsAutoSpinning,
    });

    return () => {
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [isAutoTopUpInProgress]);

  const onClose = () => {
    setVisible(false);
  };

  const onOpen = () => {
    if (!walletCustomerEmail) {
      setIsFirstTopUpDialogVisible(true);
      return;
    }
    setVisible(true);
    setIsEditAutoPayment(false);
  };

  const onClick = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    const startTime = Date.now();

    try {
      await Promise.all([fetchBalance!(true), fetchTransactionHistory!()]);
    } catch (e) {
      toastr.error(e as Error);
    } finally {
      finishRefreshingWithMinCycle({
        startTime,
        setRefreshing: setIsRefreshing,
      });
    }
  };

  const goLinkCard = () => {
    cardLinked
      ? window.open(toAbsoluteUrl(cardLinked), "_self")
      : toastr.error(t("UnexpectedError"));
  };

  const tabsItems: TTabItem[] = [
    {
      id: "transaction-history",
      name: t("TransactionHistory"),
      content: (
        <div>
          <TransactionHistory withoutRoleFilter withoutHeader />
        </div>
      ),
    },
    {
      id: "upcoming-payments",
      name: t("UpcomingPayments"),
      content: <UpcomingPayments />,
    },
  ];

  return (
    <div className={styles.walletContainer}>
      <Text className={styles.walletDescription}>
        <CommonTrans
          i18nKey="WalletSectionDescriptionAddons"
          components={{
            1: (
              <Link
                as="span"
                onClick={onAddonsClick}
                color="accent"
                textDecoration="underline"
              />
            ),
          }}
        />
      </Text>

      {walletHelpUrl ? (
        <Link
          textDecoration="underline"
          fontWeight={600}
          href={walletHelpUrl}
          className={styles.learnMoreLink}
          dataTestId="wallet_learn_more_link"
        >
          {t("LearnMore")}
        </Link>
      ) : null}

      <div className={styles.summaryGrid}>
        <div className={`${styles.summaryCard} ${styles.summaryCardBalance}`}>
          <BalanceAmount
            title={t("AvailableCredits")}
            titleFontSize="14px"
            mainFontSize="28px"
            fractionFontSize="18px"
            showRefresh={!isNotPaidPeriod && isCardLinkedToPortal}
            isRefreshing={isRefreshing || isAutoSpinning}
            progressText={t("TopUpInProgress")}
            isProgressTextVisible={isAutoSpinning}
            onRefresh={onClick}
            amount={walletBalance}
            currency={walletCodeCurrency}
            language={store.language}
          />

          <div className={styles.cardButtons}>
            <Button
              size={isMobile ? ButtonSize.normal : ButtonSize.small}
              primary
              label={t("TopUp")}
              onClick={onOpen}
              isDisabled={!canUpdateTariff || isNotPaidPeriod}
              className={styles.cardButton}
              testId="top_up_balance_button"
            />
            {wasFirstTopUp ? (
              <Button
                size={isMobile ? ButtonSize.normal : ButtonSize.small}
                label={t("AutoTopUp")}
                onClick={() => setIsWalletRefilledOpen(true)}
                isDisabled={!canUpdateTariff || isNotPaidPeriod}
                className={styles.cardButton}
                testId="auto_top_up_button"
              />
            ) : null}
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.summaryCardSpend}`}>
          <CommonTrans
            i18nKey="CurrentMonthToDateSpendForMonth"
            values={{
              month: monthLabel,
              spend: (
                <BalanceAmount
                  key="spend"
                  showRefresh={false}
                  amount={walletMonthToDateSpend}
                  currency={walletCodeCurrency}
                  language={store.language}
                  mainFontSize="18px"
                  fractionFontSize="12px"
                  withoutMargin
                  className={styles.spendAmount}
                />
              ),
            }}
            components={{
              1: (
                <Text
                  fontSize="12px"
                  lineHeight="16px"
                  fontWeight={600}
                  className={styles.spendTitle}
                />
              ),
              2: <Text fontSize="12px" lineHeight="16px" />,
            }}
          />
          {onViewUsage ? (
            <Link
              onClick={onViewUsage}
              textDecoration="underline"
              color="accent"
              className={styles.viewUsageLink}
              dataTestId="wallet_view_usage_link"
              fontWeight={600}
            >
              {t("ViewUsage")}
            </Link>
          ) : null}
        </div>
      </div>

      {!isNotPaidPeriod && walletCustomerStatusNotActive ? (
        <div className={styles.autoPaymentBanner}>
          <PluginIncompatibleSvg className={styles.warningBannerIcon} />
          <Text
            as="span"
            fontSize="12px"
            lineHeight="16px"
            className={styles.autoPaymentBannerText}
          >
            {isPayer ? (
              <CommonTrans
                i18nKey="PaymentMethodUnlinkedBanner"
                components={{
                  1: <Text as="span" fontWeight={600} />,
                  2: (
                    <Link
                      as="span"
                      onClick={goLinkCard}
                      color="accent"
                      textDecoration="underline"
                    />
                  ),
                }}
              />
            ) : (
              <CommonTrans
                i18nKey="PaymentMethodUnlinkedEmailBanner"
                values={{ email: walletCustomerEmail }}
                components={{
                  1: <Text as="span" fontWeight={600} />,
                  2: (
                    <Link
                      href={`mailto:${walletCustomerEmail}`}
                      color="accent"
                      textDecoration="underline"
                    />
                  ),
                }}
              />
            )}
          </Text>
        </div>
      ) : isAutoPaymentSetup ? (
        <AutoPaymentInfo />
      ) : null}

      {visible ? (
        <TopUpModal
          visible={visible}
          onClose={onClose}
          isEditAutoPayment={isEditAutoPayment}
          recommendedAmount={recommendedAmount}
        />
      ) : null}

      {isFirstTopUpDialogVisible ? (
        <FirstTopUpDialog
          visible={isFirstTopUpDialogVisible}
          onClose={() => setIsFirstTopUpDialogVisible(false)}
        />
      ) : null}

      {wasChangeBalance || isWalletRefilledOpen ? (
        <WalletRefilledModal
          visible={wasChangeBalance || isWalletRefilledOpen}
          onClose={() => setIsWalletRefilledOpen(false)}
        />
      ) : null}

      <div className={styles.tabsWrapper}>
        <Tabs
          items={tabsItems}
          selectedItemId={selectedTabId}
          onSelect={(item) => setSelectedTabId(item.id)}
          withoutStickyIntend
        />
      </div>
    </div>
  );
};

export default observer(Wallet);

