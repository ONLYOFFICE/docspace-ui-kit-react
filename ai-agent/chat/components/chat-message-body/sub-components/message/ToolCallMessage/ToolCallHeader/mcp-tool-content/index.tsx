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

import WordIcon from "../../../../../../../../../assets/icons/16/word.svg";
import FormIcon from "../../../../../../../../../assets/icons/16/pdf.svg";
import PresentationIcon from "../../../../../../../../../assets/icons/16/presentation.svg";

import type { TToolCallContent } from "../../../../../../../../../types/ai";
import { useTheme } from "../../../../../../../../../context/ThemeContext";
import { getServerIcon } from "../../../../../../../../../utils/ai/getServerIcon";
import { ServerType } from "../../../../../../../../../enums";
import { Text } from "../../../../../../../../../components/text";
import styles from "../../../../../ChatMessageBody.module.scss";
import {
  MCPIcon,
  MCPIconSize,
} from "../../../../../../../../../components/mcp-icon";
import { useCommonTranslation } from "../../../../../../../../../utils/i18n";

import { useMessageStore } from "../../../../../../../store/messageStore";
import { useApi } from "../../../../../../../../../providers";

export const MCPToolContent = observer(
  ({ content }: { content: TToolCallContent }) => {
    const {
      generateDocxToolName,
      generateFormToolName,
      generatePresentationToolName,
    } = useMessageStore();
    const { isBase } = useTheme();
    const { baseUrl } = useApi();
    const t = useCommonTranslation();

    const isGenerateDocx = generateDocxToolName === content.name;
    const isGenerateForm = generateFormToolName === content.name;
    const isGeneratePresentation =
      generatePresentationToolName === content.name;

    const ownIcon = content.mcpServerInfo?.icon?.icon16;

    const icon = isGenerateDocx ? (
      <WordIcon data-testid="word-icon" />
    ) : isGenerateForm ? (
      <FormIcon data-testid="form-icon" />
    ) : isGeneratePresentation ? (
      <PresentationIcon data-testid="presentation-icon" />
    ) : null;

    return (
      <>
        <Text fontSize="13px" lineHeight="15px" fontWeight={600}>
          {t("ToolCallExecuted")}:
        </Text>
        {icon ?? (
          <MCPIcon
            title={content.mcpServerInfo?.serverName || ""}
            imgSrc={ownIcon}
            imgNode={
              ownIcon
                ? null
                : getServerIcon(
                    content.mcpServerInfo?.serverType || ServerType.Custom,
                    isBase,
                    baseUrl,
                  )
            }
            size={MCPIconSize.Small}
          />
        )}

        <Text
          fontSize="13px"
          lineHeight="15px"
          fontWeight={600}
          className={styles.toolName}
        >
          {content.name}
        </Text>
      </>
    );
  },
);
