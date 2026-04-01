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
