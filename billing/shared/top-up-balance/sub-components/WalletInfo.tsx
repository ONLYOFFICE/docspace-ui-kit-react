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
import { useCommonTranslation } from "../../../../utils/i18n";
import { CommonTrans } from "../../../../utils/i18n/CommonTrans";
import classNames from "classnames";

import { Text } from "../../../../components/text";
import { Link } from "../../../../components/link";

import WalletIcon from "../../../../assets/icons/16/wallet.react.svg";

import styles from "../styles/TopUpModal.module.scss";
import { getBrandName } from "../../../../constants/brands";

type WalletInfoProps = {
  balance?: string;
  onTopUp?: () => void;
  isBalanceInsufficient?: boolean;
  title?: string;
  icon?: React.ReactNode;
  shortView?: boolean;
  withoutBackground?: boolean;
};

const WalletInfo = (props: WalletInfoProps) => {
  const {
    balance,
    onTopUp,
    isBalanceInsufficient,
    title,
    icon,
    shortView,
    withoutBackground,
  } = props;
  const t = useCommonTranslation();

  const keyProp = isBalanceInsufficient
    ? { tKey: "BalanceInsufficient" }
    : { tKey: "Balance" };

  return (
    <div
      className={classNames(styles.walletInfoContainer, {
        [styles.shortView]: shortView,
        [styles.withoutBackground]: withoutBackground,
      })}
    >
      <div className={styles.walletInfoIcon}>
        {icon ?? <WalletIcon />}
      </div>
      <div className={styles.walletInfoBody}>
        <Text
          className={styles.walletInfoTitle}
          fontWeight="600"
          fontSize="14px"
        >
          {title ??
            t("ProductNameWallet", { productName: getBrandName("ProductName") })}
        </Text>
        <div
          className={classNames(styles.walletInfoBalance, {
            [styles.warningColor]: isBalanceInsufficient,
          })}
        >
          <CommonTrans
           
            i18nKey={keyProp.tKey}
            values={{ balance }}
            components={{
              1: isBalanceInsufficient ? (
                <Text key="balance-text" as="span" fontWeight={600} />
              ) : (
                <Text
                  key="balance-text"
                  fontWeight={600}
                  isInline
                  className={styles.balanceValue}
                />
              ),
            }}
          />
        </div>
      </div>
      {onTopUp ? (
        <Link
          className={styles.walletInfoTopUp}
          fontSize="13px"
          fontWeight="600"
          onClick={onTopUp}
          textDecoration="underline"
          dataTestId="top_up_wallet_link"
          color="accent"
        >
          {t("TopUp")}
        </Link>
      ) : null}
    </div>
  );
};

export default WalletInfo;

