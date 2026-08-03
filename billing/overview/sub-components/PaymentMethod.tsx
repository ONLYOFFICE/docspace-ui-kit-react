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

import { observer } from "mobx-react";

import { Text } from "../../../components/text";
import { Link } from "../../../components/link";
import { Avatar, AvatarRole, AvatarSize } from "../../../components/avatar";
import { useCommonTranslation } from "../../../utils/i18n";
import { Encoder } from "../../../utils/encoder";
import { useApi } from "../../../providers";

import { usePaymentStore } from "../../store/PaymentStoreProvider";

import CardIcon from "../../../assets/icons/16/card.react.svg";
import CheckIcon from "../../../assets/check.edit.react.svg";
import AlertIcon from "../../../assets/plugin.incompatible.react.svg";

import styles from "../Overview.module.scss";

type PaymentMethodProps = {
  onManagePaymentMethod?: () => void;
};

const PaymentMethod = ({ onManagePaymentMethod }: PaymentMethodProps) => {
  const t = useCommonTranslation();
  const { baseUrl } = useApi();
  const store = usePaymentStore();
  const { isCardLinkedToPortal } = store;

  const {
    walletCustomerEmail,
    walletCustomerInfo: payerInfo,
    walletCustomerStatusNotActive,
  } = store.tariff;

  const isInactive = walletCustomerStatusNotActive;

  const avatarSource =
    payerInfo?.hasAvatar && payerInfo.avatar
      ? `${baseUrl}${payerInfo.avatar}`
      : "default_user_photo";

  const payerName = payerInfo
    ? Encoder.htmlDecode(payerInfo.displayName ?? "")
    : walletCustomerEmail;

  const payerRow = (
    <div className={styles.pmRow}>
      <Avatar
        role={AvatarRole.none}
        size={AvatarSize.min}
        source={avatarSource}
        isDefaultSource
        userName={payerInfo?.displayName ?? undefined}
      />
      <div className={styles.pmInfo}>
        <Text fontSize="14px" fontWeight={600} truncate>
          {payerName}
        </Text>
        <Text fontSize="12px" className={styles.mutedTitle} truncate>
          {walletCustomerEmail}
        </Text>
      </div>
      <Text fontSize="13px" fontWeight={600} className={styles.pmPayerLabel}>
        {t("Payer")}
      </Text>
    </div>
  );

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Text fontSize="14px" fontWeight={700}>
          {t("PaymentMethod")}
        </Text>
        {onManagePaymentMethod ? (
          <Link
            onClick={onManagePaymentMethod}
            textDecoration="underline"
            color="accent"
            fontWeight={600}
            dataTestId="overview_manage_payment_method_link"
          >
            {isInactive ? t("AddPaymentMethod") : t("Manage")}
          </Link>
        ) : null}
      </div>

      {!isCardLinkedToPortal ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyContent}>
            <Text
              fontSize="12px"
              fontWeight={600}
              className={styles.mutedTitle}
            >
              {t("NoPaymentMethod")}
            </Text>
            <Text fontSize="12px" className={styles.mutedTitle}>
              {t("NoPaymentMethodDesc")}
            </Text>
          </div>
        </div>
      ) : (
        <div className={styles.pmSection}>
          <div className={styles.pmRow}>
            <CardIcon className={styles.pmCardIcon} />
            <div className={styles.pmInfo}>
              <Text
                fontSize="14px"
                fontWeight={600}
                className={isInactive ? styles.pmErrorTitle : undefined}
              >
                {isInactive
                  ? t("PaymentMethodUnlinked")
                  : t("PaymentMethodLinked")}
              </Text>
              <Text fontSize="12px" className={styles.mutedTitle}>
                {t("PaymentMethodDetailsStripe")}
              </Text>
            </div>
            {isInactive ? (
              <AlertIcon className={styles.pmStatusIcon} />
            ) : (
              <CheckIcon className={styles.pmCheckIcon} />
            )}
          </div>

          <div className={styles.pmDivider} />

          {payerRow}
        </div>
      )}
    </div>
  );
};

export default observer(PaymentMethod);

