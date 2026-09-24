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

import type { TTranslation } from "../../../utils/common";
import type {
  OperationTokenUsage,
  TransactionSourceType,
  WalletOperationDto,
} from "../../store/PaymentStore";
import { AI_SEARCH, AI_TOOLS } from "../../constants";

export const isAiServiceName = (serviceName?: string) =>
  serviceName === AI_TOOLS || serviceName === AI_SEARCH;

export const hasTransactionSource = isAiServiceName;

const getSourceTypeLabel = (t: TTranslation, type: TransactionSourceType) => {
  switch (type) {
    case "Agent":
      return t("AIAgent");
    case "File":
      return t("File");
    case "Folder":
      return t("Folder");
    case "Room":
      return t("Room");
    case "Form":
      return t("FormSpaceTitle");
    default:
      return null;
  }
};

const getSourceLabelWithTitle = (
  t: TTranslation,
  type: TransactionSourceType,
  title: string,
) => {
  switch (type) {
    case "Agent":
      return t("AIAgentName", { AgentName: title });
    case "File":
      return t("TransactionSourceFile", { fileName: title });
    case "Folder":
      return t("TransactionSourceFolder", { folderName: title });
    case "Room":
      return t("TransactionSourceRoom", { roomName: title });
    case "Form":
      return t("TransactionSourceFormSpace", { formSpaceName: title });
    default:
      return title;
  }
};

export const getTransactionSourceLabel = (
  t: TTranslation,
  transaction: Pick<WalletOperationDto, "sourceType" | "sourceTitle">,
) => {
  const { sourceType, sourceTitle } = transaction;

  if (sourceType && sourceTitle) {
    return getSourceLabelWithTitle(t, sourceType, sourceTitle);
  }

  const typeLabel = sourceType ? getSourceTypeLabel(t, sourceType) : null;

  return typeLabel || sourceTitle || null;
};

export const TOKEN_USAGE_TOOLTIP_ID = "tokenUsageTooltip";

export const getCachedTokensPercent = (usage: OperationTokenUsage) => {
  if (usage.promptTokens <= 0 || usage.cachedTokens <= 0) return null;

  const percent = Math.round((usage.cachedTokens / usage.promptTokens) * 100);

  return percent > 0 ? percent : null;
};

export const getTokenUsageSegments = (usage: OperationTokenUsage) => ({
  fromCache: usage.cachedTokens,
  notFromCache: Math.max(usage.promptTokens - usage.cachedTokens, 0),
  received: usage.completionTokens,
});

export const serializeTokenUsage = (usage: OperationTokenUsage) =>
  JSON.stringify(usage);

export const parseTokenUsage = (
  content: string | null,
): OperationTokenUsage | null =>
  content ? (JSON.parse(content) as OperationTokenUsage) : null;
