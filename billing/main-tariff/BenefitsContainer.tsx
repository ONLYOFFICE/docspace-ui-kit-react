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
import { CommonTrans } from "../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";

import { Text } from "../../components/text";
import { HelpButton } from "../../components/help-button";
import { Link } from "../../components/link";
import { combineUrl } from "../../utils/combineUrl";
import type { TTranslation } from "../../utils/common";
import type { TenantQuotaFeatureDto } from "@onlyoffice/docspace-api-sdk";
import { FREE_BACKUP } from "../constants";

import HelpReactSvg from "../../assets/help.react.svg";

import { usePaymentStore } from "../store/PaymentStoreProvider";
import styles from "./MainTariff.module.scss";

const BenefitsContainer = observer(({ t }: { t: TTranslation }) => {
  const store = usePaymentStore();
  const { portalPaymentQuotasFeatures: features } = store.paymentQuotas;

  const renderTooltip = () => {
    const onClickServiceUrl = () => {
      window.DocSpace.navigate(store.routes.services);
    };

    return (
      <HelpButton
        className="payment-tooltip"
        offsetRight={0}
        iconNode={<HelpReactSvg />}
        tooltipContent={
          <CommonTrans
            i18nKey="NeedMoreGoToAddons"
            components={{
              1: (
                <Link
                  key="contact-payer-link"
                  tag="a"
                  color="accent"
                  onClick={onClickServiceUrl}
                />
              ),
            }}
          />
        }
      />
    );
  };

  return (
    <div className={styles.benefitsBody}>
      <Text fontSize="16px" fontWeight="600" className={styles.benefitsText}>
        {t("Benefits")}
      </Text>
      {features &&
        Array.from(features.values()).map((item: TenantQuotaFeatureDto) => {
          if (!item.title || !item.image) return;
          return (
            <div
              className={styles.paymentBenefits}
              key={item.title || item.image}
            >
              <div
                // biome-ignore lint/security/noDangerouslySetInnerHtml: TODO fix
                dangerouslySetInnerHTML={{ __html: item.image }}
                className={styles.iconsContainer}
              />
              <div className={styles.benefitsFeature}>
                <Text as="span">{item.title}</Text>
                {item.id === FREE_BACKUP ? renderTooltip() : null}
              </div>
            </div>
          );
        })}
    </div>
  );
});

export default BenefitsContainer;
