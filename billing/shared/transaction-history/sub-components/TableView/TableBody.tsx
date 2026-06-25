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

import { TableRow, TableCell } from "../../../../../components/table";
import { Text } from "../../../../../components/text";
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

interface TransactionRowProps {
  transaction: WalletOperationDto;
  serviceName?: string;
}

const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  serviceName,
}) => {
  const paymentStore = usePaymentStore();
  const { language } = paymentStore;
  const { credit, debit, currency } = transaction;
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

  const correctDate = getCorrectDate(language, transaction.date);

  return (
    <TableRow>
      <TableCell>
        <Text fontWeight={600} fontSize="11px" dataTestId="transaction_date">
          {correctDate}
        </Text>
      </TableCell>
      {serviceName === AI_TOOLS ? (
        <TableCell>
          <Text fontWeight={600} fontSize="11px">
            {transaction.agentTitle
              ? t("AIAgentName", { AgentName: transaction.agentTitle })
              : "—"}
          </Text>
        </TableCell>
      ) : null}
      <TableCell>
        <Text
          fontWeight={600}
          fontSize="11px"
          as="span"
          className={styles.transactionRowDescription}
        >
          {transaction.description}
          {transaction.details ? ` (${transaction.details})` : ""}
        </Text>
      </TableCell>

      <TableCell>
        <Text fontWeight={600} fontSize="11px">
          {transaction.participantDisplayName
            ? Encoder.htmlDecode(transaction.participantDisplayName)
            : "—"}
        </Text>
      </TableCell>
      <TableCell>
        <Text fontWeight={600} fontSize="11px">
          {getServiceQuantity(
            t,
            transaction.quantity ?? 0,
            transaction.serviceUnit ?? undefined,
          )}
        </Text>
      </TableCell>
      <TableCell>
        <Text
          fontWeight={600}
          fontSize="11px"
          className={classNames({
            [styles.transactionRowAmountCredit]: isCredit,
          })}
        >
          {formattedAmount}
        </Text>
      </TableCell>
    </TableRow>
  );
};

export default observer(TransactionRow);

