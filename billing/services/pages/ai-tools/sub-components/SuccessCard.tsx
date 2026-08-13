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

import React from "react";

import { useCommonTranslation } from "../../../../../utils/i18n";
import { Text } from "../../../../../components/text";
import { Button, ButtonSize } from "../../../../../components/button";
import { Link, LinkType, LinkTarget } from "../../../../../components/link";

import CheckIcon from "../../../../../assets/check.edit.react.svg";

import BalanceAmount from "../../../../shared/balance-amount";

import { PaymentFlavor } from "../AiPaywallCompletePage.utils";
import styles from "../AiPaywallCompletePage.module.scss";

type SuccessCardProps = {
  flavor: PaymentFlavor;
  title: string;
  hint: string;
  buttonLabel: string;
  onGoToServiceClick: () => void;
  amount: number;
  currency: string;
  language: string;
  admins: string;
  storage: string;
  price: string;
  docsConnectUsers: number;
  formattedMonthlyPrice: string;
  docsConnectUrl?: string;
};

const SuccessCard = ({
  flavor,
  title,
  hint,
  buttonLabel,
  onGoToServiceClick,
  amount,
  currency,
  language,
  admins,
  storage,
  price,
  docsConnectUsers,
  formattedMonthlyPrice,
  docsConnectUrl,
}: SuccessCardProps) => {
  const t = useCommonTranslation();

  const isDocsConnect = flavor === PaymentFlavor.DocsConnect;

  return (
    <>
      <div
        className={styles.heroBadge}
        data-status="success"
        aria-hidden="true"
      >
        <CheckIcon />
      </div>

      <div className={styles.cardBody}>
        <Text fontSize="16px" fontWeight={600} className={styles.title}>
          {title}
        </Text>
        {flavor === PaymentFlavor.Tariff ? (
          <>
            <Text as="span" className={styles.adminsAmount}>
              {t("AdminsAddedAmount", { admins })}
            </Text>
            <Text fontSize="14px" className={styles.tariffActivationDetails}>
              {t("TariffSuccessDetails", { storage, price })}
            </Text>
          </>
        ) : isDocsConnect ? (
          <>
            <Text as="span" className={styles.adminsAmount}>
              {t("DocsConnectUsersAmount", {
                count: docsConnectUsers,
              })}
            </Text>
            <Text fontSize="14px" className={styles.tariffActivationDetails}>
              {t("DocsConnectPricePerMonth", {
                price: formattedMonthlyPrice,
              })}
            </Text>
          </>
        ) : flavor === PaymentFlavor.DiskStorage && storage ? (
          <>
            <Text as="span" className={styles.adminsAmount}>
              +{storage}
            </Text>
            <Text fontSize="14px" className={styles.tariffActivationDetails}>
              {t("StoragePaywallCallbackPricePerMonth", {
                price: formattedMonthlyPrice,
              })}
            </Text>
          </>
        ) : (
          <>
            <div className={styles.successAmount}>
              <Text as="span" fontSize="28px" fontWeight={700}>
                +
              </Text>
              <BalanceAmount
                amount={amount}
                currency={currency}
                language={language}
                maximumFractionDigits={2}
                mainFontSize="28px"
                fractionFontSize="20px"
                withoutMargin
                showRefresh={false}
              />
            </div>
            <Text fontSize="13px" lineHeight="18px">
              {hint}
            </Text>
          </>
        )}
      </div>

      <div className={styles.actions}>
        <Button
          size={ButtonSize.medium}
          primary
          scale
          label={buttonLabel}
          onClick={onGoToServiceClick}
          testId="ai_paywall_go_to_wallet_button"
        />
        {isDocsConnect && docsConnectUrl ? (
          <Link
            className={styles.docsLink}
            type={LinkType.page}
            href={docsConnectUrl}
            target={LinkTarget.blank}
            color="accent"
            fontSize="13px"
            fontWeight={600}
            dataTestId="docs_connect_read_api_docs_link"
          >
            {t("ReadApiDocumentation")}
          </Link>
        ) : null}
      </div>
    </>
  );
};

export default SuccessCard;
