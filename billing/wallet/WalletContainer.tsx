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

import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { useCommonTranslation } from "../../utils/i18n";
import { CommonTrans } from "../../utils/i18n/CommonTrans";

import { toAbsoluteUrl } from "../utils/url";

import classNames from "classnames";

import { Text } from "../../components/text";
import { Button, ButtonSize } from "../../components/button";
import { toastr } from "../../components/toast";
import { Link } from "../../components/link";
import { finishRefreshingWithMinCycle } from "../utils/refreshing";

import TransactionHistory from "../shared/transaction-history";
import TopUpModal from "../shared/top-up-balance/TopUpModal";
import WalletRefilledModal from "./WalletRefilledModal";
import AutoPaymentInfo from "./sub-components/AutoPaymentInfo";
import styles from "./styles/Wallet.module.scss";
import BalanceAmount from "../shared/balance-amount";
import { usePaymentStore } from "../store/PaymentStoreProvider";
import { getBrandName } from "../../constants/brands";
import FirstTopUpDialog from "../shared/top-up-balance/FirstTopUpDialog";

type WalletProps = {
  isMobile?: boolean;
};

const Wallet = (props: WalletProps) => {
  const { isMobile } = props;

  const store = usePaymentStore();

  const {
    walletBalance,
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
  } = store;

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

  const [isAutoSpinning, setIsAutoSpinning] = useState(isAutoTopUpInProgress);
  const autoStartTimeRef = useRef<number | null>(null);

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

  const onOpenLink = () => {
    setVisible(true);
    setIsEditAutoPayment(true);
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

  return (
    <div className={styles.walletContainer}>
      <Text className={styles.walletDescription}>
        {t("WalletSectionDescription", {
          productName: getBrandName("ProductName"),
        })}
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

      <div className={styles.balanceWrapper}>
        <BalanceAmount
          title={t("BalanceText")}
          showRefresh={!isNotPaidPeriod && isCardLinkedToPortal}
          isRefreshing={isRefreshing || isAutoSpinning}
          progressText={t("TopUpInProgress")}
          isProgressTextVisible={isAutoSpinning}
          onRefresh={onClick}
          amount={walletBalance}
          currency={walletCodeCurrency}
          language={store.language}
        />

        <Button
          size={isMobile ? ButtonSize.normal : ButtonSize.small}
          primary
          label={t("TopUpBalance")}
          onClick={onOpen}
          isDisabled={!canUpdateTariff || isNotPaidPeriod}
          scale={isMobile}
          className={classNames(styles.topUpButton, {
            [styles.isMobileButton]: isMobile,
          })}
          testId="top_up_balance_button"
        />
      </div>

      {!isNotPaidPeriod && walletCustomerStatusNotActive ? (
        <div className={styles.walletCustomerStatusNotActive}>
          <Text fontWeight={600} className={styles.warningColor}>
            {t("PaymentMethodUnlinked")}
          </Text>
          <Text as="span" className={styles.warningColor}>
            {isPayer ? (
              t("LinkPaymentMethod")
            ) : (
              <Text className={styles.warningColor}>
                <CommonTrans
                  i18nKey="LinkNewPaymentMethodEmail"
                  values={{ email: walletCustomerEmail }}
                  components={{
                    1: (
                      <Link
                        href={`mailto:${walletCustomerEmail}`}
                        color="accent"
                        textDecoration="underline"
                      />
                    ),
                  }}
                />
              </Text>
            )}
          </Text>{" "}
          {isPayer ? (
            <Link
              as="span"
              onClick={goLinkCard}
              fontWeight={600}
              textDecoration="underline"
            >
              {t("AddPaymentMethod")}
            </Link>
          ) : null}
        </div>
      ) : (
        <AutoPaymentInfo onOpen={onOpenLink} />
      )}

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

      {wasChangeBalance ? (
        <WalletRefilledModal visible={wasChangeBalance} />
      ) : null}

      <TransactionHistory withoutRoleFilter />
    </div>
  );
};

export default observer(Wallet);

