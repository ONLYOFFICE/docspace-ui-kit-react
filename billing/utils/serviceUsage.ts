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

import type { TTranslation } from "../../utils/common";
import type { TServiceUsage } from "../types";
import {
  ADMIN,
  AI_TOOLS,
  BACKUP_SERVICE,
  DISK_STORAGE,
  DOCS_CONNECT,
  DOCS_CONNECT_DEVPACK_SERVICE,
  DOCS_CONNECT_SERVICE,
  MANAGER,
  STORAGE_ENUM,
} from "../constants";
import { formatCompactNumber } from "./common";

/**
 * Localized per-unit price label for a service, e.g. "$12.00/user". The unit
 * word is translated per service so each language localizes it correctly.
 * Returns an empty string for services without a defined unit rate.
 */
export const getServiceUnitRate = (
  t: TTranslation,
  service: string,
  price: string,
): string => {
  switch (service) {
    case ADMIN:
    case MANAGER:
      return t("Common:SpendRatePerAdmin", { price });
    case DISK_STORAGE:
    case STORAGE_ENUM:
      return t("Common:SpendRatePerGB", { price });
    case DOCS_CONNECT:
    case DOCS_CONNECT_SERVICE:
    case DOCS_CONNECT_DEVPACK_SERVICE:
      return t("Common:SpendRatePerUser", { price });
    default:
      return "";
  }
};

/**
 * Human-readable usage summary for a single service, e.g. "Admins: 50",
 * "Tokens: 14.28M" or "Billed backups: 18".
 */
export const getServiceUsageSubLabel = (
  t: TTranslation,
  item: TServiceUsage,
  language?: string,
): string => {
  if (item.service === BACKUP_SERVICE)
    return t("Common:BilledBackups", { count: item.totalQuantity });

  if (item.service === AI_TOOLS)
    return t("Common:UnitCount", {
      unit: item.serviceUnit,
      count: formatCompactNumber(item.totalQuantity, language),
    });

  if (!item.serviceUnit) return "—";

  return t("Common:UnitCount", {
    unit: item.serviceUnit,
    count: item.totalQuantity,
  });
};
