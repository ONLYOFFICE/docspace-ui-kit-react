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

import type React from "react";
import classNames from "classnames";
import { observer } from "mobx-react";

import ToolFinishIcon from "../../../../../../../../assets/tool.finish.svg";
import AlertIcon from "../../../../../../../../assets/button.alert.transparent.react.svg";
import ArrowRightIcon from "../../../../../../../../assets/arrow.right.react.svg";

import { Loader, LoaderTypes } from "../../../../../../../../components/loader";
import type { TToolCallContent } from "../../../../../../../../types/ai";

import { useMessageStore } from "../../../../../../store/messageStore";

import styles from "../../../../ChatMessageBody.module.scss";
import { ToolCallPlacement, ToolCallStatus } from "../tool-call/ToolCall.enum";
import { hasToolResultError } from "../tool-call/ToolCall.utils";
import { SearchToolContent } from "./search-tool-content";
import { MCPToolContent } from "./mcp-tool-content";

type ToolCallHeaderProps = {
  content: TToolCallContent;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  status: ToolCallStatus;
  placement: ToolCallPlacement;
  expandable?: boolean;
  isSearchTool?: boolean;
  openLink?: (url: string) => void;
};

export const ToolCallHeader = observer(
  ({
    content,
    collapsed,
    setCollapsed,
    status,
    placement,
    expandable,
    isSearchTool,
    openLink,
  }: ToolCallHeaderProps) => {
    const { webCrawlingToolName } = useMessageStore();

    const isWebCrawlingTool = content.name === webCrawlingToolName;

    const statusIcons: Record<ToolCallStatus, React.ReactNode> = {
      [ToolCallStatus.Loading]: <Loader type={LoaderTypes.track} size="12px" />,
      [ToolCallStatus.Confirmation]: (
        <Loader type={LoaderTypes.track} size="12px" />
      ),
      [ToolCallStatus.Finished]: (
        <ToolFinishIcon
          className={styles.toolFinishIcon}
          data-testid="tool-finish-icon"
        />
      ),
      [ToolCallStatus.Failed]: <AlertIcon data-testid="alert-icon" />,
    };

    const statusIcon =
      placement === ToolCallPlacement.ConfirmDialog
        ? null
        : statusIcons[status];

    const onClick = () => {
      if (
        isWebCrawlingTool &&
        !hasToolResultError(content, [webCrawlingToolName])
      )
        return;

      setCollapsed(!collapsed);
    };

    return (
      <div
        className={classNames(styles.toolCallHeader, {
          [styles.hide]: collapsed,
          [styles.pointer]: expandable,
        })}
        onClick={onClick}
        data-testid="tool-call-header"
      >
        <div className={styles.toolStatusIcon}>{statusIcon}</div>

        {isSearchTool ? (
          <SearchToolContent
            content={content}
            openLink={openLink}
          />
        ) : (
          <MCPToolContent content={content} />
        )}

        {expandable ? (
          <ArrowRightIcon className={styles.arrowRightIcon} />
        ) : null}
      </div>
    );
  },
);
