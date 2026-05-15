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

import { Text } from "../../../../../../../../components/text";
import { Button, ButtonSize } from "../../../../../../../../components/button";
import {
  ModalDialog,
  ModalDialogType,
} from "../../../../../../../../components/modal-dialog";

import { isMobile } from "../../../../../../../../utils";
import { useCommonTranslation } from "../../../../../../../../utils/i18n";
import { useMessageStore } from "../../../../../../store/messageStore";
import { ToolCall } from "../tool-call";
import { ToolCallPlacement, ToolCallStatus } from "../tool-call/ToolCall.enum";

import styles from "../../../../ChatMessageBody.module.scss";

type OpenFileConfirmDialogProps = {
  content: TToolCallContent;
  fileId: number;
  onClose: () => void;
};

export const OpenFileConfirmDialog = observer(
  ({
    content,
    fileId,
    onClose,
  }: OpenFileConfirmDialogProps) => {
    const { openFileConfirmQueue } = useMessageStore();
    const t = useCommonTranslation();

    const onOpenAction = () => {
      const searchParams = new URLSearchParams();
      searchParams.append("fileId", String(fileId));
      searchParams.append("withTool", "true");

      const url = `${window.location.origin}/doceditor?${searchParams.toString()}`;
      window.open(url, "_blank");

      onClose();
    };

    return (
      <ModalDialog
        visible={openFileConfirmQueue[0]?.fileId === fileId}
        displayType={ModalDialogType.modal}
        onClose={onClose}
        isLarge
        autoMaxHeight
        closeOnBackdropClick={false}
        data-testid="open-file-confirm-dialog"
      >
        <ModalDialog.Header>
          {t("Confirmation")}
        </ModalDialog.Header>

        <ModalDialog.Body>
          <div className={styles.toolCallManage}>
            <Text>{t("AIWouldLikeToOpenFile")}</Text>
            <ToolCall
              content={content}
              status={ToolCallStatus.Finished}
              placement={ToolCallPlacement.Message}
            />
            <div>
              <Text>{t("ReviewAction")}</Text>
              <Text>{t("CannotGuaranteeSecurity")}</Text>
            </div>
          </div>
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <div className={styles.toolCallFooter}>
            <div className={styles.buttonsBlockContainer}>
              <Button
                primary
                label={t("Open")}
                onClick={onOpenAction}
                scale={isMobile()}
                size={ButtonSize.normal}
                data-testid="open-file-button"
              />
              <Button
                className={styles.denyButton}
                label={t("CancelButton")}
                onClick={onClose}
                size={ButtonSize.normal}
                scale={isMobile()}
                data-testid="cancel-open-file-button"
              />
            </div>
          </div>
        </ModalDialog.Footer>
      </ModalDialog>
    );
  },
);
