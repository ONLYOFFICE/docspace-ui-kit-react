/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
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
import { getCommonTranslation } from "../../../../../../../../../utils";

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
    const { apiUrl } = useApi();

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
          {getCommonTranslation("ToolCallExecuted")}:
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
                    apiUrl,
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
