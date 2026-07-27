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

import { useEffect } from "react";
import { observer } from "mobx-react";

import { Text } from "../../components/text";
import { Heading } from "../../components/heading";
import { useCommonTranslation } from "../../utils/i18n";

import { usePaymentStore } from "../store/PaymentStoreProvider";

import OverviewLoader from "./OverviewLoader";
import {
  AvailableCredits,
  CurrentPlan,
  MonthToDateSpend,
  UpcomingPayments,
  ActiveAddons,
  PaymentMethod,
} from "./sub-components";

import styles from "./Overview.module.scss";

type BillingOverviewProps = {
  isMobile?: boolean;
  /** Navigate to the tariff-plan section. */
  onEditPlan?: () => void;
  /** Navigate to the usage section. */
  onViewUsage?: () => void;
  /** Navigate to the add-ons section. */
  onManageAddons?: () => void;
  /** Navigate to the payment-method section. */
  onManagePaymentMethod?: () => void;
  /** Navigate to the wallet section (upcoming payments live there). */
  onUpcomingDetails?: () => void;
};

const BillingOverview = ({
  isMobile,
  onEditPlan,
  onViewUsage,
  onManageAddons,
  onManagePaymentMethod,
  onUpcomingDetails,
}: BillingOverviewProps) => {
  const t = useCommonTranslation();
  const { overviewInit, isInitOverviewPage } = usePaymentStore();

  useEffect(() => {
    overviewInit?.(t).catch((e: unknown) => console.error(e));
  }, []);

  return (
    <div className={styles.overviewRoot}>
      <div className={styles.header}>
        <Text fontSize="23px" fontWeight={700}>
          {t("Billing")}
        </Text>
        <Text className={styles.headerDescription}>
          {t("BillingOverviewDescription")}
        </Text>
      </div>

      {!isInitOverviewPage ? (
        <OverviewLoader />
      ) : (
        <>
          <AvailableCredits isMobile={isMobile} />

          <CurrentPlan onEditPlan={onEditPlan} isMobile={isMobile} />

          <div className={styles.grid2}>
            <MonthToDateSpend onViewUsage={onViewUsage} />
            <UpcomingPayments onUpcomingDetails={onUpcomingDetails} />
          </div>

          <div className={styles.grid2}>
            <ActiveAddons onManageAddons={onManageAddons} />
            <PaymentMethod onManagePaymentMethod={onManagePaymentMethod} />
          </div>
        </>
      )}
    </div>
  );
};

export default observer(BillingOverview);

