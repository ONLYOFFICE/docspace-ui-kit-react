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
import { useCommonTranslation } from "../../../utils/i18n";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { useServicesStore } from "../../store/ServicesStoreProvider";
import { formatCompactNumber } from "../../utils/common";
import type { TServiceFeatureWithPrice } from "../../types";

import styles from "../Overview.module.scss";

type ActiveAddonsProps = {
  onManageAddons?: () => void;
};

const ActiveAddons = ({ onManageAddons }: ActiveAddonsProps) => {
  const t = useCommonTranslation();
  const { walletCodeCurrency, formatWalletCurrency, servicesQuotasFeatures } =
    usePaymentStore();
  const { serviceUsage } = useServicesStore();

  const enabledAddons = (
    Array.from(
      servicesQuotasFeatures?.values() ?? [],
    ) as TServiceFeatureWithPrice[]
  ).filter((f) => f.value && f.title && f.image);

  const usageForService = (serviceName?: string) =>
    serviceUsage.find(
      (u) =>
        u.service === serviceName ||
        (!!serviceName &&
          !!u.service &&
          (serviceName.includes(u.service) || u.service.includes(serviceName))),
    );

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Text fontSize="16px" fontWeight={600}>
          {t("ActiveAddons")}
        </Text>
        {onManageAddons ? (
          <Link
            onClick={onManageAddons}
            textDecoration="underline"
            color="accent"
            fontWeight={600}
            dataTestId="overview_manage_addons_link"
          >
            {t("Manage")}
          </Link>
        ) : null}
      </div>
      {enabledAddons.length === 0 ? (
        <div className={styles.emptyState}>
          <Text fontSize="12px" className={styles.mutedTitle}>
            {t("NoActiveAddons")}
          </Text>
        </div>
      ) : (
        <div className={styles.rows}>
          {enabledAddons.map((feature) => {
            const usage = usageForService(feature.serviceName);
            return (
              <div className={styles.row} key={feature.id}>
                <div className={styles.addonLeft}>
                  <div
                    className={styles.addonIcon}
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: service icon markup comes from the payment API
                    dangerouslySetInnerHTML={{ __html: feature.image ?? "" }}
                  />
                  <div className={styles.rowInfo}>
                    <Text fontSize="14px" fontWeight={600} truncate>
                      {feature.title}
                    </Text>
                    {usage ? (
                      <Text
                        fontSize="12px"
                        truncate
                        className={styles.mutedTitle}
                      >
                        {formatCompactNumber(usage.totalQuantity)}{" "}
                        {usage.serviceUnit}
                      </Text>
                    ) : null}
                  </div>
                </div>
                <Text fontSize="14px" fontWeight={700}>
                  {formatWalletCurrency(
                    usage?.totalAmount ?? 0,
                    2,
                    usage?.currency || walletCodeCurrency,
                  )}
                </Text>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default observer(ActiveAddons);
