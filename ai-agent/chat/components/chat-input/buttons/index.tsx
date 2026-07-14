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
import classNames from "classnames";
import { observer } from "mobx-react";

import SendReactSvg from "../../../../../assets/icons/12/arrow.up.react.svg";
import AttachmentReactSvg from "../../../../../assets/attachment.react.svg";

import { IconButton } from "../../../../../components/icon-button";
import { TooltipContainer } from "../../../../../components/tooltip";

import { useMessageStore } from "../../../store/messageStore";

import { ButtonsProps } from "../../../Chat.types";

import styles from "../ChatInput.module.scss";
import ToolsSettings from "../tools-settings";
import { useCommonTranslation } from "../../../../../utils/i18n";

const Buttons = ({
  isFilesSelectorVisible,
  toggleFilesSelector,
  sendMessageAction,
  value,
  selectedModel,
  toolsSettings,
  isAdmin,
  aiReady,
  goToWebSearchSettings,
  allowAttachFiles = false,
  allowManageTools,
  onStopStream,
}: ButtonsProps) => {
  const { isRequestRunning, stopMessage } = useMessageStore();
  const t = useCommonTranslation();

  const isSendButtonDisabled = !isRequestRunning
    ? !value.trim() || !selectedModel
    : false;

  const handleStopMessage = () => {
    stopMessage();
    onStopStream?.();
  };

  const sendIconProps = !isRequestRunning
    ? {
        onClick: sendMessageAction,
        isDisabled: isSendButtonDisabled,
        iconNode: <SendReactSvg />,
      }
    : {
        onClick: handleStopMessage,
        isDisabled: false,
        iconNode: <div className={styles.square} />,
      };

  const onAttachmentToggleClick = () => {
    if (!aiReady) return;

    toggleFilesSelector();
  };

  return (
    <div className={styles.chatInputButtons} data-testid="chat-input-buttons">
      <div className={styles.chatInputButtonsTools}>
        {allowAttachFiles && (
          <TooltipContainer
            as="div"
            title={t("AddFiles")}
            className={classNames(styles.chatInputButton, {
              [styles.activeChatInputButton]: isFilesSelectorVisible,
              [styles.disabled]: !aiReady,
            })}
            onClick={onAttachmentToggleClick}
          >
            <IconButton
              iconNode={<AttachmentReactSvg />}
              size={16}
              isFill={false}
              isDisabled={!aiReady}
              className={classNames({ [styles.disabled]: !aiReady })}
              data-testid="chat-input-attachment-button"
            />
          </TooltipContainer>
        )}
        {allowManageTools && (
          <ToolsSettings
            {...toolsSettings}
            isAdmin={isAdmin}
            aiReady={aiReady}
            goToWebSearchSettings={goToWebSearchSettings}
          />
        )}
      </div>
      <IconButton
        size={16}
        isClickable
        className={classNames(styles.chatInputButtonsSend, {
          [styles.disabled]: isSendButtonDisabled,
        })}
        {...sendIconProps}
        data-testid="chat-input-send-button"
      />
    </div>
  );
};

export default observer(Buttons);
