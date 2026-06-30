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

import { useCommonTranslation } from "../../../utils/i18n";
import { Text } from "../../../components/text";
import { Button, ButtonSize } from "../../../components/button";
import { Checkbox } from "../../../components/checkbox";
import { Loader, LoaderTypes } from "../../../components/loader";
import { ModalDialog, ModalDialogType } from "../../../components/modal-dialog";
import { toastr } from "../../../components/toast";

import { useApi } from "../../../providers";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { getBrandName } from "../../../constants/brands";
import WalletInfo from "../../shared/top-up-balance/sub-components/WalletInfo";
import { formatRemainingDays } from "../../utils/common";

import InfoIcon from "../../../assets/info.outline.react.svg";

import styles from "./MigrateToWalletDialog.module.scss";

/** Response shape of GET api/2.0/portal/payment/subscription/balance. */
type TSubscriptionBalance = {
  currency: string;
  daysElapsed: number;
  periodStart: string;
  periodEnd: string;
  periodUsedUntil: string;
  /** unused part of the current subscription, credited to the wallet */
  remainingBalance: number;
  /** wallet currency code the remaining balance is converted to */
  walletCurrency: string;
  /** unused subscription part, expressed in the wallet currency */
  remainingBalanceInWalletCurrency: number;
  /** amount paid for the current subscription period */
  totalCost: number;
};

type MigrateToWalletDialogProps = {
  visible: boolean;
  onClose: () => void;
  /** refresh tariff / balance / quota after a successful migration */
  onMigrated: () => Promise<void> | void;
};

const MigrateToWalletDialog = observer(
  ({ visible, onClose, onMigrated }: MigrateToWalletDialogProps) => {
    const t = useCommonTranslation();
    const { rawApiClient } = useApi();
    const store = usePaymentStore();
    const {
      formatPaymentCurrency,
      formatWalletCurrency,
      language,
      totalPrice,
      walletBalance,
      managersCount,
    } = store;
    const { planCost } = store.paymentQuotas;
    const { maxCountManagersByQuota } = store.quotas;
    const { paymentDate, daysUntilPayment } = store.tariff;

    const [subscriptionDetails, setSubscriptionDetails] =
      useState<TSubscriptionBalance | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);

    const organizationName = getBrandName("ProductName");

    const hasFetchedRef = useRef(false);

    useEffect(() => {
      if (hasFetchedRef.current) return;

      hasFetchedRef.current = true;

      const fetchSubscriptionDetails = async () => {
        setIsLoading(true);

        try {
          const { data } = await rawApiClient.instance.get(
            "api/2.0/portal/payment/subscription/balance",
          );
          setSubscriptionDetails(data?.response as TSubscriptionBalance);
        } catch (e) {
          console.error(
            "[migrate-to-wallet] fetch subscriptionDetails failed",
            e,
          );
          toastr.error(t("ErrorNotification"));
        } finally {
          setIsLoading(false);
        }
      };

      fetchSubscriptionDetails();
    }, []);

    const onConfirm = async () => {
      setIsSubmitting(true);

      try {
        await rawApiClient.instance.post(
          "api/2.0/portal/payment/subscription/movetowallet",
          {
            quantity: { adminwallet: managersCount },
          },
        );
        await onMigrated();
        onClose();
      } catch (e) {
        console.error("[migrate-to-wallet] migration failed", e);
        toastr.error(t("ErrorNotification"));
      } finally {
        setIsSubmitting(false);
      }
    };

    const newAdmins = managersCount;
    const pricePerAdmin = planCost.value;
    const newSubscriptionAmount = totalPrice;

    const currentTariffCost = maxCountManagersByQuota * pricePerAdmin;
    const daysDisplay = formatRemainingDays(daysUntilPayment, language, t);

    const walletCredit =
      subscriptionDetails?.remainingBalanceInWalletCurrency ?? 0;
    const walletCurrency = subscriptionDetails?.walletCurrency;
    const walletApplied = Math.min(
      newSubscriptionAmount,
      walletCredit + walletBalance,
    );
    const cardCharge = Math.max(0, newSubscriptionAmount - walletApplied);

    const isDetailsReady = !isLoading && !!subscriptionDetails;

    const withLoader = (node: React.ReactNode) => (
      <div className={styles.valueLoader}>
        {isDetailsReady ? (
          node
        ) : (
          <Loader type={LoaderTypes.track} size="16px" />
        )}
      </div>
    );

    const renderRow = (
      label: React.ReactNode,
      value: React.ReactNode,
      valueClassName?: string,
    ) => (
      <div className={styles.row}>
        <Text as="span" fontSize="14px">
          {label}
        </Text>
        <Text
          as="div"
          fontSize="14px"
          fontWeight={600}
          className={valueClassName}
        >
          {value}
        </Text>
      </div>
    );

    const renderStep = (
      index: number,
      title: React.ReactNode,
      body: React.ReactNode,
    ) => (
      <li className={styles.step}>
        <div className={styles.badgeCol}>
          <span className={styles.badge}>{index}</span>
          <span className={styles.connector} aria-hidden="true" />
        </div>
        <div className={styles.stepContent}>
          <Text fontSize="14px" fontWeight={700} className={styles.title}>
            {title}
          </Text>
          {body}
        </div>
      </li>
    );

    return (
      <ModalDialog
        visible={visible}
        onClose={onClose}
        displayType={ModalDialogType.aside}
        withBodyScroll
        withFooterBorder
      >
        <ModalDialog.Header>{t("MigrateDialogTitle")}</ModalDialog.Header>
        <ModalDialog.Body>
          <div className={styles.content}>
            <WalletInfo balance={formatWalletCurrency()} />

            <div className={styles.banner}>
              <InfoIcon className={styles.bannerIcon} />
              <div>
                <Text
                  fontSize="13px"
                  fontWeight={600}
                  className={styles.bannerTitle}
                >
                  {t("MigrateBannerTitle")}
                </Text>
                <Text fontSize="13px" className={styles.muted}>
                  {t("MigrateBannerSubtitle")}
                </Text>
              </div>
            </div>

            <ol className={styles.steps}>
              {renderStep(
                1,
                t("MigrateStep1Title"),
                <div className={styles.card}>
                  {renderRow(
                    t("MigrateCurrentTariff"),
                    t("MigratePerMonth", {
                      price: formatPaymentCurrency(currentTariffCost),
                    }),
                  )}
                  {renderRow(
                    t("RemainingPeriod"),
                    <>
                      {`${daysDisplay} `}
                      <Text as="span" fontSize="14px" className={styles.muted}>
                        ({t("UntilDate", { date: paymentDate })})
                      </Text>
                    </>,
                  )}
                  <div className={styles.cardDivider} />
                  {renderRow(
                    t("MigrateRefundToWallet"),
                    withLoader(
                      `+ ${formatWalletCurrency(walletCredit, 2, walletCurrency)}`,
                    ),
                    styles.positive,
                  )}
                </div>,
              )}

              {renderStep(
                2,
                t("MigrateNewPlanTitle"),
                <div className={styles.card}>
                  {renderRow(
                    t("MigratePlanLine", {
                      count: newAdmins,
                      price: formatPaymentCurrency(pricePerAdmin),
                    }),
                    t("MigratePerMonth", {
                      price: formatPaymentCurrency(newSubscriptionAmount),
                    }),
                  )}
                  {renderRow(
                    t("MigrateFromWallet"),
                    withLoader(
                      `- ${formatWalletCurrency(walletApplied, 2, walletCurrency)}`,
                    ),
                    styles.positive,
                  )}
                  <div className={styles.cardDivider} />
                  {renderRow(
                    <Text as="span" fontSize="14px" fontWeight={600}>
                      {t("MigrateDueOnCard")}
                    </Text>,
                    withLoader(formatPaymentCurrency(cardCharge, 2)),
                  )}
                </div>,
              )}

              {renderStep(
                3,
                t("MigrateActiveUntil", { date: paymentDate }),
                <Text fontSize="13px" className={styles.muted}>
                  {t("MigrateAutoRenews", {
                    price: formatPaymentCurrency(newSubscriptionAmount),
                  })}
                </Text>,
              )}
            </ol>
          </div>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <div className={styles.footer}>
            <Checkbox
              isChecked={isAgreed}
              onChange={() => setIsAgreed((v) => !v)}
              label={t("MigrateAgree", { organizationName })}
              dataTestId="migrate_to_wallet_agree_checkbox"
            />
            <div className={styles.footerButtons}>
              <Button
                key="confirm"
                label={
                  cardCharge > 0
                    ? t("MigratePay", {
                        amount: subscriptionDetails
                          ? formatPaymentCurrency(cardCharge, 2)
                          : "",
                      })
                    : t("UpgradeNow")
                }
                size={ButtonSize.normal}
                primary
                scale
                isDisabled={isLoading || !subscriptionDetails || !isAgreed}
                isLoading={isSubmitting || !isDetailsReady}
                onClick={onConfirm}
                testId="migrate_to_wallet_confirm_button"
              />
              <Button
                key="cancel"
                label={t("CancelButton")}
                size={ButtonSize.normal}
                scale
                onClick={onClose}
                testId="migrate_to_wallet_cancel_button"
              />
            </div>
          </div>
        </ModalDialog.Footer>
      </ModalDialog>
    );
  },
);

export default MigrateToWalletDialog;

