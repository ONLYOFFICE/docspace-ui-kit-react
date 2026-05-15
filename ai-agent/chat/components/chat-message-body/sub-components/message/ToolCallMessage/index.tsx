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

import { MessageToolCallProps } from "../../../../../Chat.types";

import styles from "../../../ChatMessageBody.module.scss";

import { ToolCallConfirmDialog } from "./tool-call-confirm-dialog";
import { OpenFileConfirmDialog } from "./open-file-confirm-dialog";
import { ToolCall } from "./tool-call";
import { ToolCallPlacement, ToolCallStatus } from "./tool-call/ToolCall.enum";
import { useMessageStore } from "../../../../../store/messageStore";

const ToolCallMessage = observer(({
  content,
  openLink,
  openFile,
}: MessageToolCallProps) => {
  const {
    openFileConfirmQueue,
    removeFromOpenFileConfirmQueue,
    generateDocxToolName,
    generateFormToolName,
    generatePresentationToolName,
  } = useMessageStore();

  const [needConfirmation, setNeedConfirmation] = React.useState(
    () => !!content.managed,
  );

  const hideConfirmDialog = () => setNeedConfirmation(false);

  const isGenerateTool =
    content.name === generateDocxToolName ||
    content.name === generateFormToolName ||
    content.name === generatePresentationToolName;

  const fileData = (
    content.result as
      | { data?: { id?: number; title?: string } }
      | undefined
  )?.data;

  const needOpenFileConfirm =
    isGenerateTool &&
    typeof fileData?.id === "number" &&
    typeof fileData?.title === "string" &&
    openFileConfirmQueue.some(
      (e) => e.fileId === fileData.id,
    );

  const hasError = !!content.result?.error;

  const toolCallStatus: ToolCallStatus = needConfirmation
    ? ToolCallStatus.Confirmation
    : !content.result
      ? ToolCallStatus.Loading
      : hasError
        ? ToolCallStatus.Failed
        : ToolCallStatus.Finished;

  // cancel confirmation after timeout
  React.useEffect(() => {
    if (needConfirmation && !content.managed) {
      setNeedConfirmation(false);
    }
  }, [content.managed, needConfirmation]);

  return (
    <div className={styles.toolCallMessage} data-testid="tool-call-message">
      <ToolCall
        content={content}
        status={toolCallStatus}
        placement={ToolCallPlacement.Message}
        openLink={openLink}
        openFile={openFile}
      />

      {needConfirmation ? (
        <ToolCallConfirmDialog content={content} onClose={hideConfirmDialog} />
      ) : null}

      {needOpenFileConfirm && fileData?.id ? (
        <OpenFileConfirmDialog
          content={content}
          fileId={fileData.id}
          onClose={() =>
            removeFromOpenFileConfirmQueue(fileData.id!)
          }
        />
      ) : null}
    </div>
  );
});

export default ToolCallMessage;
