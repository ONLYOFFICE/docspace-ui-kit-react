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
import { observer } from "mobx-react";

import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { useCommonTranslation } from "../../../utils/i18n";
import { Text } from "../../../components/text";
import { Link } from "../../../components/link";
import { toastr } from "../../../components/toast";
import PluginIncompatibleSvg from "../../../assets/plugin.incompatible.react.svg";
import { toAbsoluteUrl } from "../../utils/url";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import styles from "./UnlinkedCardBanner.module.scss";

const UnlinkedCardBanner = () => {
  const t = useCommonTranslation();
  const { isPayer, cardLinked, tariff } = usePaymentStore();
  const { walletCustomerEmail } = tariff;

  const goLinkCard = () => {
    cardLinked
      ? window.open(toAbsoluteUrl(cardLinked), "_self")
      : toastr.error(t("UnexpectedError"));
  };

  return (
    <div className={styles.banner}>
      <PluginIncompatibleSvg className={styles.icon} />
      <Text as="span" fontSize="12px" lineHeight="16px" className={styles.text}>
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
                  fontWeight={600}
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
  );
};

export default observer(UnlinkedCardBanner);

