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

import type { TToolCallContent } from "../../../../../../../../../types/ai";
import styles from "../../../../../ChatMessageBody.module.scss";
import MarkdownField from "../../../Markdown";
import { formatJsonWithMarkdown } from "../../../../../../../utils";
import { Text } from "../../../../../../../../../components/text";
import type { ToolCallPlacement } from "../../tool-call/ToolCall.enum";
import { useCommonTranslation } from "../../../../../../../../../utils/i18n";

export const CodeView = observer(
  ({
    content,
    placement,
  }: {
    content: TToolCallContent;
    placement: ToolCallPlacement;
  }) => {
    const t = useCommonTranslation();
    const getResult = () => {
      if (content.result && typeof content.result === "string") {
        return content.result;
      }

      if (content?.result?.data) return JSON.stringify(content.result.data);

      if (content.result && "content" in content.result) {
        return ((content.result?.content as Record<string, unknown>[])?.[0]
          ?.text ?? "") as string;
      }

      return "";
    };

    const result = getResult();

    let isJson = false;

    try {
      JSON.parse(result);
      isJson = true;
    } catch {
      isJson = false;
    }

    const showResult = placement === "message" && content.result;
    const isErrorResult =
      content.result &&
      typeof content.result !== "string" &&
      "isError" in content.result &&
      content.result?.isError;

    return (
      <>
        <div
          className={styles.toolCallCodeViewItem}
          data-testid="tool-call-code-view-item-arg"
        >
          <Text fontSize="15px" lineHeight="16px" fontWeight={600}>
            {t("ToolCallArg")}
          </Text>
          <MarkdownField
            chatMessage={formatJsonWithMarkdown(content.arguments ?? {})}
            successCopyMessage={t("ToolCallArgCopied")}
          />
        </div>
        {showResult ? (
          <div
            className={styles.toolCallCodeViewItem}
            data-testid="tool-call-code-view-item-result"
          >
            <Text fontSize="15px" lineHeight="16px" fontWeight={600}>
              {t("ToolCallResult")}
            </Text>
            <MarkdownField
              chatMessage={formatJsonWithMarkdown(
                isJson ? JSON.parse(result) : result,
              )}
              propLanguage={isErrorResult && !isJson ? "text" : undefined}
              successCopyMessage={t("ToolCallResultCopied")}
            />
          </div>
        ) : null}
      </>
    );
  },
);
