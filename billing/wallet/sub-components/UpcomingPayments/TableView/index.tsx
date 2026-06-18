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

import React, { useRef } from "react";
import { observer } from "mobx-react";

import { TableBody, TableContainer } from "../../../../../components/table";
import { useCommonTranslation } from "../../../../../utils/i18n";

import { usePaymentStore } from "../../../../store/PaymentStoreProvider";
import { getServiceQuantity } from "../../../utils";

import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import styles from "./UpcomingPaymentsTable.module.scss";

const TABLE_VERSION = "1";
const COLUMNS_SIZE = `upcomingPaymentsColumnsSize_ver-${TABLE_VERSION}`;
const INFO_PANEL_COLUMNS_SIZE = `infoPanelUpcomingPaymentsColumnsSize_ver-${TABLE_VERSION}`;

type UpcomingPaymentsTableViewProps = {
  sectionWidth: number;
};

const TableView = ({ sectionWidth }: UpcomingPaymentsTableViewProps) => {
  const paymentStore = usePaymentStore();
  const t = useCommonTranslation();

  const { upcomingPayments, formatWalletCurrency, userId } = paymentStore;

  const columnStorageName = `${COLUMNS_SIZE}=${userId}`;
  const columnInfoPanelStorageName = `${INFO_PANEL_COLUMNS_SIZE}=${userId}`;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.tableWrapper}>
      <TableContainer
        forwardedRef={ref as React.RefObject<HTMLDivElement>}
        useReactWindow={false}
        className={styles.tableContainer}
      >
        <TableHeader
          sectionWidth={sectionWidth}
          containerRef={ref as React.RefObject<HTMLDivElement>}
          columnStorageName={columnStorageName}
          columnInfoPanelStorageName={columnInfoPanelStorageName}
          itemHeight={48}
        />
        <TableBody
          useReactWindow={false}
          columnStorageName={columnStorageName}
          columnInfoPanelStorageName={columnInfoPanelStorageName}
          itemHeight={48}
          filesLength={upcomingPayments.length}
          fetchMoreFiles={() => Promise.resolve()}
          hasMoreFiles={false}
          itemCount={upcomingPayments.length}
        >
          {upcomingPayments.map((payment) => (
            <TableRow
              key={payment.id}
              renewalDate={payment.renewalDate}
              type={payment.title}
              details={getServiceQuantity(
                t,
                payment.quantity,
                payment.unitOfMeasure,
              )}
              amount={formatWalletCurrency(payment.amount, 2)}
              actionType={payment.actionType}
            />
          ))}
        </TableBody>
      </TableContainer>
    </div>
  );
};

export default observer(TableView);

