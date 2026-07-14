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

import WordIcon from "../../../../../../../../assets/icons/16/word.svg";
import CellIcon from "../../../../../../../../assets/icons/16/cell.svg";
import CellCommonIcon from "../../../../../../../../assets/icons/16/cellCommon.svg";
import TextIcon from "../../../../../../../../assets/icons/16/text.svg";
import PdfIcon from "../../../../../../../../assets/icons/16/pdf.svg";

import type {
  TToolCallContent,
  TToolCallResultSource,
  TToolCallResultSourceData,
} from "../../../../../../../../types/ai";

/**
 * Safely extracts the first (or only) normalized source from a tool call
 * result. Returns undefined when the result is missing or doesn't match the
 * expected DTO shape, so callers never dereference an unexpected payload.
 */
export const getToolResultData = (
  content: TToolCallContent,
): TToolCallResultSourceData | undefined => {
  const data = (content.result as TToolCallResultSource | undefined)?.data;

  const source = Array.isArray(data) ? data[0] : data;

  return source && typeof source === "object" ? source : undefined;
};

/**
 * A tool call is treated as failed when the backend reports an explicit error,
 * or when a result arrived for one of the known DocSpace tools (knowledge /
 * web search, web crawling) without the expected `data` DTO — e.g. a raw MCP
 * error payload like `{ Content: [{ Text: "Error: ..." }] }`. The loading
 * state (no result yet) is never treated as an error, and tools whose result
 * shape is unknown (arbitrary MCP tools) keep their explicit-error-only check.
 */
export const hasToolResultError = (
  content: TToolCallContent,
  knownToolNames: (string | undefined)[] = [],
): boolean => {
  const result = content.result as TToolCallResultSource | undefined;

  if (!result) return false;

  if (typeof result.error === "string" && result.error.length > 0) return true;

  const isKnownTool =
    !!content.name && knownToolNames.includes(content.name);

  return isKnownTool && !("data" in result);
};

export const getRootDomain = (url: string) => {
  try {
    const hostname = new URL(url).hostname;

    return hostname.split(".").slice(-2).join(".");
  } catch {
    return "";
  }
};

const knowledgeIcons: Record<string, React.ReactNode> = {
  ".docx": <WordIcon />,
  ".xlsx": <CellIcon />,
  ".csv": <CellCommonIcon />,
  ".txt": <TextIcon />,
  ".pdf": <PdfIcon />,
};

const getExtension = (fileName: string) => {
  const idx = fileName.lastIndexOf(".");
  return idx !== -1 ? fileName.slice(idx) : "";
};

export const getKnowledgeDocumentIconByFileName = (fileName: string) => {
  const extension = getExtension(fileName);

  return knowledgeIcons[extension] || "";
};
