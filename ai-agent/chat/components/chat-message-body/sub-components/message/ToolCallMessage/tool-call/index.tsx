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

import type { TToolCallContent } from "../../../../../../../../types/ai";

import styles from "../../../../ChatMessageBody.module.scss";

import { ToolCallHeader } from "../ToolCallHeader";
import { ToolCallBody } from "../ToolCallBody";
import { ToolCallPlacement, ToolCallStatus } from "./ToolCall.enum";
import classNames from "classnames";
import { useMessageStore } from "../../../../../../store/messageStore";

type ToolCallProps = {
  content: TToolCallContent;
  placement: ToolCallPlacement;
  status: ToolCallStatus;
  openLink?: (url: string) => void;
  openFile?: (fileId: string) => void;
};

export const ToolCall = observer(
  ({ content, status, placement, openLink, openFile }: ToolCallProps) => {
    const [collapsed, setCollapsed] = React.useState(true);
    const { knowledgeSearchToolName, webSearchToolName, webCrawlingToolName } =
      useMessageStore();

    const isSearchTool = [
      knowledgeSearchToolName,
      webSearchToolName,
      webCrawlingToolName,
    ].includes(content.name);

    const isWebCrawlingTool = content.name === webCrawlingToolName;

    const expandable =
      (status === ToolCallStatus.Finished && !isWebCrawlingTool) ||
      status === ToolCallStatus.Failed ||
      placement === ToolCallPlacement.ConfirmDialog;

    return (
      <div
        className={classNames(styles.toolCall, {
          [styles.inDialog]: placement === ToolCallPlacement.ConfirmDialog,
        })}
      >
        <ToolCallHeader
          content={content}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          status={status}
          placement={placement}
          expandable={expandable}
          isSearchTool={isSearchTool}
          openLink={openLink}
        />

        {!expandable || collapsed ? null : (
          <ToolCallBody
            content={content}
            placement={placement}
            openLink={openLink}
            openFile={openFile}
          />
        )}
      </div>
    );
  },
);
