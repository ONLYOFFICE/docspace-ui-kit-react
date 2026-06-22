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

import { Row, RowContent } from "../../../../../components/rows";
import { Text } from "../../../../../components/text";
import PencilIcon from "../../../../../assets/pencil.react.svg";
import type { TUpcomingPayment } from "../../../../types";

import { usePaymentStore } from "../../../../store/PaymentStoreProvider";
import styles from "./UpcomingPaymentsRow.module.scss";

type UpcomingPaymentRowProps = {
  sectionWidth: number;
  title: string;
  renewalDate: string;
  details: string;
  amount: string;
  actionType?: TUpcomingPayment["actionType"];
};

const UpcomingPaymentRow: React.FC<UpcomingPaymentRowProps> = ({
  sectionWidth,
  title,
  renewalDate,
  details,
  amount,
  actionType,
}) => {
  const store = usePaymentStore();

  const onAction = () => {
    if (actionType === "edit-plan")
      window.DocSpace?.navigate(store.routes.portalPayments);
    else if (actionType === "edit-subscription")
      window.DocSpace?.navigate(store.routes.diskStorage);
  };

  const getRowChildren = () => [
    <Text key="title" fontWeight={600} fontSize="14px">
      {title}
    </Text>,
    <div key="spacer" />,
    <Text key="date" fontWeight={600} fontSize="12px">
      {renewalDate}
    </Text>,
    <Text key="details" fontWeight={600} fontSize="12px">
      {details}
    </Text>,
  ];

  return (
    <Row
      className={styles.row}
      badgesComponent={
        <div className={styles.badges}>
          <Text fontWeight={600} fontSize="13px">
            {amount}
          </Text>
          {actionType ? (
            <div
              className={styles.action}
              onClick={onAction}
              role="button"
              tabIndex={0}
            >
              <PencilIcon />
            </div>
          ) : null}
        </div>
      }
    >
      <RowContent
        sectionWidth={sectionWidth}
        sideColor="var(--payment-inactive-color)"
      >
        {getRowChildren()}
      </RowContent>
    </Row>
  );
};

export default observer(UpcomingPaymentRow);

