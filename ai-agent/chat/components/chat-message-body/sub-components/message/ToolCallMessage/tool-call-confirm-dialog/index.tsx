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

import { ToolsPermission } from "../../../../../../../../enums";
import type { TToolCallContent } from "../../../../../../../../types/ai";

import { Text } from "../../../../../../../../components/text";
import { Button, ButtonSize } from "../../../../../../../../components/button";
import { Checkbox } from "../../../../../../../../components/checkbox";
import {
  ModalDialog,
  ModalDialogType,
} from "../../../../../../../../components/modal-dialog";

import styles from "../../../../ChatMessageBody.module.scss";
import { ToolCall } from "../tool-call";
import { isMobile } from "../../../../../../../../utils";
import { useCommonTranslation } from "../../../../../../../../utils/i18n";
import { ToolCallPlacement, ToolCallStatus } from "../tool-call/ToolCall.enum";
import { useMessageStore } from "../../../../../../store/messageStore";
import { useApi } from "../../../../../../../../providers";

type ToolCallConfirmDialogProps = {
  content: TToolCallContent;
  onClose: () => void;
};

export const ToolCallConfirmDialog = observer(
  ({ content, onClose }: ToolCallConfirmDialogProps) => {
    const [alwaysAllow, setAlwaysAllow] = React.useState(false);
    const {
      toolsConfirmQueue,
      addToToolsConfirmQueue,
      removeFromToolsConfirmQueue,
      generateDocxToolName,
      generateFormToolName,
      generatePresentationToolName,
    } = useMessageStore();
    const { aiApi } = useApi();
    const t = useCommonTranslation();

    const isGenerateTool =
      content.name === generateDocxToolName ||
      content.name === generateFormToolName ||
      content.name === generatePresentationToolName;

    const onClickAction = async (decision: ToolsPermission) => {
      if (content.callId) {
        if (isGenerateTool) {
          const allow = decision === ToolsPermission.Allow;
          const result = await aiApi.updateToolFileDecision(
            content.callId,
            allow,
          );

          if (allow && typeof result?.id === "number") {
            const searchParams = new URLSearchParams();
            searchParams.append("fileId", String(result.id));
            searchParams.append("withTool", "true");

            window.open(
              `${window.location.origin}/doceditor?${searchParams.toString()}`,
              "_blank",
            );
          }
        } else {
          aiApi.updateToolsPermission(
            content.callId,
            alwaysAllow && decision === ToolsPermission.Allow
              ? ToolsPermission.AlwaysAllow
              : decision,
          );
        }
      }

      onClose();
    };

    const onCloseAction = () => {
      if (content.callId) {
        if (isGenerateTool) {
          aiApi.updateToolFileDecision(content.callId, false);
        } else {
          aiApi.updateToolsPermission(content.callId, ToolsPermission.Deny);
        }
      }

      onClose();
    };

    React.useEffect(() => {
      addToToolsConfirmQueue(content.callId!);
      return () => {
        removeFromToolsConfirmQueue(content.callId!);
      };
    }, [content.callId]);

    return (
      <ModalDialog
        visible={toolsConfirmQueue[0] === content.callId}
        displayType={ModalDialogType.modal}
        onClose={onCloseAction}
        isLarge
        autoMaxHeight
        closeOnBackdropClick={false}
        data-testid="tool-call-confirm-dialog"
      >
        <ModalDialog.Header>
          {t("Confirmation")}
        </ModalDialog.Header>

        <ModalDialog.Body>
          <div className={styles.toolCallManage}>
            <Text>{t("AIWouldLikeToUseThisTool")}</Text>
            <ToolCall
              content={content}
              status={ToolCallStatus.Confirmation}
              placement={ToolCallPlacement.ConfirmDialog}
            />
            <div>
              {isGenerateTool ? (
                <Text>{t("AIGenerateDocumentDescription")}</Text>
              ) : (
                <>
                  <Text>{t("ReviewAction")}</Text>
                  <Text>{t("CannotGuaranteeSecurity")}</Text>
                </>
              )}
            </div>
          </div>
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <div className={styles.toolCallFooter}>
            {!isGenerateTool ? (
              <Checkbox
                isChecked={alwaysAllow}
                onChange={(e) => setAlwaysAllow(e.target.checked)}
                label={t("AlwaysAllowToolCall")}
                data-testid="always-allow-checkbox"
              />
            ) : null}
            <div className={styles.buttonsBlockContainer}>
               <Button
                primary
                label={isGenerateTool ? t("Create") : t("Allow")}
                onClick={() => onClickAction(ToolsPermission.Allow)}
                scale={isMobile()}
                size={ButtonSize.normal}
                data-testid="allow-button"
              />
              <Button
                className={styles.denyButton}
                label={isGenerateTool ? t("CancelButton") : t("Deny")}
                onClick={() => onClickAction(ToolsPermission.Deny)}
                size={ButtonSize.normal}
                scale={isMobile()}
                data-testid="deny-button"
              />
            </div>
          </div>
        </ModalDialog.Footer>
      </ModalDialog>
    );
  },
);
