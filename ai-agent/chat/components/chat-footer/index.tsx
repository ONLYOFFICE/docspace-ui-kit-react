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

import { ChatFooterProps } from "../../Chat.types";
import { ChatInfoBlock } from "../chat-info-block";
import ChatInput from "../chat-input";
import styles from "./ChatFooter.module.scss";

const ChatFooter = ({
  isLoading,
  aiReady,
  isPortalAdmin,
  standalone,
  isPayer,
  isCardLinkedToPortal,
  walletCustomerEmail,
  walletCustomerDisplayName,
  onActivateAI,
  onTopUpAndActivateAI,
  onShowAIBenefits,
  isActivating,
  attachmentFile,
  clearAttachmentFile,
  hideAttachments,
  getIcon,
  selectedModel,
  toolsSettings,
  multimodal,
  goToWebSearchSettings,
  persistDraft,
  openFile,
  allowAttachFiles,
  allowManageTools,
  onSendMessage,
  onStopStream,
  withSamples,
  samples,
}: ChatFooterProps) => {
  return (
    <div className={styles.chatFooter} data-testid="chat-footer">
      {!isLoading && !aiReady ? (
        <ChatInfoBlock
          standalone={standalone}
          isPortalAdmin={isPortalAdmin}
          isPayer={isPayer}
          isCardLinkedToPortal={isCardLinkedToPortal}
          walletCustomerEmail={walletCustomerEmail}
          walletCustomerDisplayName={walletCustomerDisplayName}
          onActivateAI={onActivateAI}
          onTopUpAndActivateAI={onTopUpAndActivateAI}
          onShowAIBenefits={onShowAIBenefits}
          isActivating={isActivating}
        />
      ) : null}
      <ChatInput
        attachmentFile={attachmentFile}
        clearAttachmentFile={clearAttachmentFile}
        hideAttachments={hideAttachments}
        isLoading={isLoading}
        getIcon={getIcon}
        selectedModel={selectedModel}
        toolsSettings={toolsSettings}
        isPortalAdmin={isPortalAdmin}
        aiReady={aiReady}
        multimodal={multimodal}
        goToWebSearchSettings={goToWebSearchSettings}
        persistDraft={persistDraft}
        openFile={openFile}
        allowAttachFiles={allowAttachFiles}
        allowManageTools={allowManageTools}
        onSendMessage={onSendMessage}
        onStopStream={onStopStream}
        withSamples={withSamples}
        samples={samples}
      />
    </div>
  );
};

export default ChatFooter;

