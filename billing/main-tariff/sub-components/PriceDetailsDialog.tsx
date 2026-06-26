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
import { ProductQuantityType } from "@onlyoffice/docspace-api-sdk";

import { useCommonTranslation } from "../../../utils/i18n";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { Text } from "../../../components/text";
import { Button, ButtonSize } from "../../../components/button";
import { HelpButton } from "../../../components/help-button";
import { ModalDialog } from "../../../components/modal-dialog";
import { toastr } from "../../../components/toast";

import { useApi } from "../../../providers";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import WalletInfo from "../../shared/top-up-balance/sub-components/WalletInfo";
import { formatRemainingDays } from "../../utils/common";
import { AnalyticsEvents } from "../../../enums";

import InfoIcon from "../../../assets/info.outline.react.svg";

import styles from "./PriceDetailsDialog.module.scss";

type PriceDetailsDialogProps = {
  visible: boolean;
  onClose: () => void;
};

const PriceDetailsDialog = observer(
  ({ visible, onClose }: PriceDetailsDialogProps) => {
    const t = useCommonTranslation();
    const { paymentApi } = useApi();
    const store = usePaymentStore();
    const {
      setIsLoading,
      isLoading,
      managersCount,
      totalPrice,
      walletBalance,
      walletCodeCurrency,
      tariffDueTodayAmount,
      formatPaymentCurrency,
      formatWalletCurrency,
      fetchBalance,
      language,
    } = store;
    const { maxCountManagersByQuota, currentTariffPlanTitle, fetchPortalQuota } =
      store.quotas;
    const { planCost } = store.paymentQuotas;
    const { paymentDate, daysUntilPayment, fetchPortalTariff } = store.tariff;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentAdmins = maxCountManagersByQuota;
    const newAdmins = managersCount;
    const additionalAdmins = newAdmins - currentAdmins;
    const pricePerAdmin = planCost.value;
    const dueToday = tariffDueTodayAmount ?? 0;
    const daysDisplay = formatRemainingDays(daysUntilPayment, language, t);

    const onConfirm = async () => {
      setIsSubmitting(true);
      setIsLoading(true);
      try {
        const isBalanceInsufficient = walletBalance < dueToday;
        if (isBalanceInsufficient) {
          const recommendedAmount = Math.ceil(dueToday - walletBalance);
          if (recommendedAmount > 0) {
            await paymentApi.topUpDeposit({
              topUpDepositRequestDto: {
                amount: recommendedAmount,
                currency: walletCodeCurrency || "USD",
              },
            });
          }
        }

        const updateRes = await paymentApi.updateWalletPayment({
          walletQuantityRequestDto: {
            quantity: { adminwallet: additionalAdmins },
            productQuantityType: ProductQuantityType.Add,
          },
        });

        if (updateRes?.data?.response === false) {
          toastr.error(t("ErrorNotification"));
          return;
        }

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: AnalyticsEvents.Purchase,
          ecommerce: { items: [{ item_name: "DocSpace Business" }] },
        });

        await Promise.all([
          fetchPortalTariff(true),
          fetchBalance(true),
          fetchPortalQuota(true),
        ]);

        toastr.success(
          t("BusinessUpdated", { planName: currentTariffPlanTitle }),
        );
        onClose();
      } catch (e) {
        console.error(e);
        toastr.error(t("ErrorNotification"));
      } finally {
        setIsSubmitting(false);
        setIsLoading(false);
      }
    };

    const renderRow = (label: React.ReactNode, value: React.ReactNode) => (
      <div className={styles.row}>
        <Text as="span" fontSize="14px">
          {label}
        </Text>
        <Text as="span" fontSize="14px" fontWeight={600}>
          {value}
        </Text>
      </div>
    );

    return (
      <ModalDialog visible={visible} onClose={onClose} autoMaxHeight isLarge>
        <ModalDialog.Header>{t("PriceDetails")}</ModalDialog.Header>
        <ModalDialog.Body>
          <div className={styles.content}>
            <WalletInfo balance={formatWalletCurrency()} />

            <Text fontSize="16px" fontWeight={700} textAlign="center">
              {t("OrderSummary")}
            </Text>

            <div className={styles.summary}>
              {renderRow(
                t("AdminAdjustment"),
                `${currentAdmins} → ${newAdmins}`,
              )}
              {renderRow(t("AdditionalAdmins"), `+${additionalAdmins}`)}
              {renderRow(
                t("PricePerAdmin"),
                formatPaymentCurrency(pricePerAdmin),
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

              <div className={styles.divider} />

              <div className={styles.row}>
                <div className={styles.totalLabel}>
                  <Text as="span" fontSize="14px" fontWeight={600}>
                    {t("TotalDueToday")}
                  </Text>
                  <HelpButton
                    iconNode={<InfoIcon />}
                    tooltipContent={
                      <Text fontSize="12px">{t("DueTodayTooltip")}</Text>
                    }
                    dataTestId="price_details_due_today_help"
                  />
                </div>
                <Text as="span" fontSize="14px" fontWeight={600}>
                  {formatPaymentCurrency(dueToday)}
                </Text>
              </div>
            </div>

            <Text fontSize="13px">
              <CommonTrans
                i18nKey="PriceDetailsNextBill"
                values={{
                  price: formatPaymentCurrency(totalPrice),
                  date: paymentDate,
                }}
                components={{
                  1: <Text as="span" fontSize="13px" fontWeight={600} />,
                  2: <Text as="span" fontSize="13px" fontWeight={600} />,
                }}
              />
            </Text>
          </div>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            key="confirm"
            label={t("PayAndUpgrade", {
              amount: formatPaymentCurrency(dueToday),
            })}
            size={ButtonSize.normal}
            primary
            scale
            isDisabled={isLoading}
            isLoading={isSubmitting}
            onClick={onConfirm}
            testId="price_details_pay_button"
          />
          <Button
            key="cancel"
            label={t("CancelButton")}
            size={ButtonSize.normal}
            scale
            onClick={onClose}
            testId="price_details_cancel_button"
          />
        </ModalDialog.Footer>
      </ModalDialog>
    );
  },
);

export default PriceDetailsDialog;
