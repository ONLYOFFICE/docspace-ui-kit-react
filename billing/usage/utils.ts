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

import type { DateTime } from "luxon";

import type { TUsagePeriodKey } from "../types";
import { now } from "../../utils/date";

export const USAGE_PERIODS: TUsagePeriodKey[] = [
  "thisMonth",
  "lastMonth",
  "last3Months",
  "last6Months",
  "last12Months",
  "thisYear",
  "lastYear",
];

export const getUsageRange = (
  period: TUsagePeriodKey,
): { from: DateTime; to: DateTime } => {
  const current = now();

  switch (period) {
    case "lastMonth": {
      const lastMonth = current.minus({ months: 1 });
      return { from: lastMonth.startOf("month"), to: lastMonth.endOf("month") };
    }
    case "last3Months":
      return {
        from: current.minus({ months: 2 }).startOf("month"),
        to: current.endOf("month"),
      };
    case "last6Months":
      return {
        from: current.minus({ months: 5 }).startOf("month"),
        to: current.endOf("month"),
      };
    case "last12Months":
      return {
        from: current.minus({ months: 11 }).startOf("month"),
        to: current.endOf("month"),
      };
    case "thisYear":
      return { from: current.startOf("year"), to: current.endOf("year") };
    case "lastYear": {
      const lastYear = current.minus({ years: 1 });
      return { from: lastYear.startOf("year"), to: lastYear.endOf("year") };
    }
    default:
      return { from: current.startOf("month"), to: current.endOf("month") };
  }
};

