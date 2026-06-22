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

import type { ReactNode } from "react";

import { ComboBox, ComboBoxSize, TOption } from "../../../components/combobox";
import { Text } from "../../../components/text";
import { useCommonTranslation } from "../../../utils/i18n";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { now } from "../../../utils/date";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import type { TUsagePeriodKey } from "../../types";
import { USAGE_PERIODS } from "../utils";
import styles from "../styles/Usage.module.scss";

type PeriodSelectProps = {
  value: TUsagePeriodKey;
  onSelect: (period: TUsagePeriodKey) => void;
};

const PeriodSelect = ({ value, onSelect }: PeriodSelectProps) => {
  const t = useCommonTranslation();
  const { language } = usePaymentStore();

  const getLabel = (period: TUsagePeriodKey): ReactNode => {
    const current = now().setLocale(language || "en");
    const hintSpan = (
      <Text as="span" className={styles.periodHint} fontWeight={600} />
    );

    switch (period) {
      case "thisMonth":
        return (
          <CommonTrans
            i18nKey="ThisMonthWithHint"
            values={{ month: current.toFormat("LLLL") }}
            components={{ 1: hintSpan }}
          />
        );
      case "lastMonth":
        return (
          <CommonTrans
            i18nKey="LastMonthWithHint"
            values={{ month: current.minus({ months: 1 }).toFormat("LLLL") }}
            components={{ 1: hintSpan }}
          />
        );
      case "thisYear":
        return (
          <CommonTrans
            i18nKey="ThisYearWithHint"
            values={{ year: current.year }}
            components={{ 1: hintSpan }}
          />
        );
      case "lastYear":
        return (
          <CommonTrans
            i18nKey="LastYearWithHint"
            values={{ year: current.year - 1 }}
            components={{ 1: hintSpan }}
          />
        );
      case "last3Months":
        return t("Last3Months");
      case "last6Months":
        return t("Last6Months");
      case "last12Months":
        return t("Last12Months");
      default:
        return null;
    }
  };

  const options: TOption[] = USAGE_PERIODS.map((period) => ({
    key: period,
    label: getLabel(period),
    dataTestId: `usage_period_${period}`,
  }));

  const selectedOption =
    options.find((option) => option.key === value) ?? options[0];

  const handleSelect = (option: TOption) => {
    onSelect(option.key as TUsagePeriodKey);
  };

  return (
    <ComboBox
      options={options}
      selectedOption={selectedOption}
      onSelect={handleSelect}
      directionY="both"
      size={ComboBoxSize.content}
      scaled={false}
      dropDownMaxHeight={320}
      dataTestId="usage_period_combobox"
      dropDownTestId="usage_period_dropdown"
    />
  );
};

export default PeriodSelect;

