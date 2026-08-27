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
import { Tooltip } from "../../../components/tooltip";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { formatterCurrencyWithoutTranction } from "../../wallet/utils";

export const MIN_DISPLAYED_AMOUNT = 0.01;

type SpendAmountProps = {
  amount: number;
  currency?: string;
  tooltipId: string;
  className?: string;
  fontSize?: string;
  fontWeight?: number;
};

/**
 * Renders a spent amount. A charge smaller than one cent would be truncated to
 * a plain 0.00, so it is shown as "<0.01" with the exact value in a tooltip.
 */
const SpendAmount = ({
  amount,
  currency,
  tooltipId,
  className,
  fontSize = "13px",
  fontWeight = 600,
}: SpendAmountProps) => {
  const { walletCodeCurrency, formatWalletCurrency, language } =
    usePaymentStore();

  const amountCurrency = currency || walletCodeCurrency;

  if (amount <= 0 || amount >= MIN_DISPLAYED_AMOUNT)
    return (
      <Text fontSize={fontSize} fontWeight={fontWeight} className={className}>
        {formatWalletCurrency(amount, 2, amountCurrency)}
      </Text>
    );

  return (
    <>
      <Text
        fontSize={fontSize}
        fontWeight={fontWeight}
        className={className}
        data-tooltip-id={tooltipId}
      >
        {`<${formatWalletCurrency(MIN_DISPLAYED_AMOUNT, 2, amountCurrency)}`}
      </Text>
      <Tooltip
        id={tooltipId}
        place="top-end"
        getContent={() => (
          <Text fontSize="12px" noSelect>
            {formatterCurrencyWithoutTranction(language, amount, amountCurrency)}
          </Text>
        )}
        dataTestId={`${tooltipId}_tooltip`}
      />
    </>
  );
};

export default observer(SpendAmount);
