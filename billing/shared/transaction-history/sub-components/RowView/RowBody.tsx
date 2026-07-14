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
import { useCommonTranslation } from "../../../../../utils/i18n";
import classNames from "classnames";

import { Text } from "../../../../../components/text";
import { Row, RowContent } from "../../../../../components/rows";
import type { WalletOperationDto } from "../../../../store/PaymentStore";
import { Encoder } from "../../../../../utils/encoder";
import { getCorrectDate } from "../../../../../utils/date/getCorrectDate";

import styles from "../../styles/TransactionHistory.module.scss";
import {
  accountingLedgersFormat,
  getServiceQuantity,
} from "../../../../wallet/utils";
import { usePaymentStore } from "../../../../store/PaymentStoreProvider";
import { AI_TOOLS } from "../../../../constants";

type TransactionRowViewProps = {
  transaction: WalletOperationDto;
  sectionWidth: number;
  serviceName?: string;
};

const TransactionRowView: React.FC<TransactionRowViewProps> = ({
  transaction,
  sectionWidth,
  serviceName,
}) => {
  const paymentStore = usePaymentStore();
  const { language } = paymentStore;
  const { credit, debit, currency, date } = transaction;
  const t = useCommonTranslation();
  const creditValue = credit ?? 0;
  const debitValue = debit ?? 0;

  const isCredit = creditValue > 0;

  const formattedAmount = accountingLedgersFormat(
    language,
    creditValue || debitValue,
    isCredit,
    currency ?? "",
  );

  const correctDate = getCorrectDate(language, date);

  const getRowChildren = () => {
    const children = [
      <div key="description">
        <Text
          fontWeight={600}
          fontSize="14px"
          as="span"
          className={styles.transactionRowDescription}
        >
          {transaction.description}
        </Text>
        {transaction.details ? (
          <Text fontWeight={600} fontSize="14px" as="span">
            ({transaction.details})
          </Text>
        ) : null}
      </div>,
      <div key="spacer" />,
      <Text
        key="date"
        fontWeight={600}
        fontSize="11px"
        dataTestId="transaction_date"
      >
        {correctDate}
      </Text>,
    ];

    if (serviceName === AI_TOOLS && transaction.agentTitle) {
      children.push(
        <Text key="source" fontWeight={600} fontSize="11px">
          {t("AIAgentName", { AgentName: transaction.agentTitle })}
        </Text>,
      );
    }

    if (transaction.participantDisplayName) {
      children.push(
        <Text key="participant" fontWeight={600} fontSize="11px">
          {Encoder.htmlDecode(transaction.participantDisplayName)}
        </Text>,
      );
    }

    if (transaction.serviceUnit) {
      children.push(
        <Text key="quantity" fontWeight={600} fontSize="11px">
          {getServiceQuantity(
            t,
            transaction.quantity ?? 0,
            transaction.serviceUnit ?? undefined,
          )}
        </Text>,
      );
    }

    return children;
  };

  return (
    <Row
      className={styles.transactionRow}
      badgesComponent={
        <Text
          fontWeight={600}
          fontSize="13px"
          className={classNames(styles.transactionRowAmount, {
            [styles.transactionRowAmountCredit]: isCredit,
          })}
        >
          {formattedAmount}
        </Text>
      }
    >
      <RowContent sectionWidth={sectionWidth}>{getRowChildren()}</RowContent>
    </Row>
  );
};

export default observer(TransactionRowView);

