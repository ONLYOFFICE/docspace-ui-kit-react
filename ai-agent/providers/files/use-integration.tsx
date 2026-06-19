// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import type { ComposerAction } from "@onlyoffice/ai-chat";

import { getBrandName } from "../../../constants/brands";

import CatalogDocuments from "../../../assets/icons/16/catalog.documents.react.svg";
import UploadIcon from "../../../assets/icons/16/upload.react.svg";

import type { SaveAsFileHandler } from "../platform";

import DeviceUploader, { type DeviceUploaderHandle } from "./device-uploader";
import AttachDialog from "./attach-dialog";
import SaveDialog from "./save-dialog";
import styles from "./styles.module.scss";

export type FilesIntegration = {
  // Composer "attach" actions (add files from the host / upload from device).
  composerActions: ComposerAction[];
  // Message "Save as file" handler, wired into platform.file.saveAsFile.
  onSaveAsFile: SaveAsFileHandler;
  // Dialogs + hidden device-upload input; render inside <AiAgentProviders> so
  // they resolve the stores/api/icon context.
  overlay: React.ReactNode;
};

// Encapsulates the file-attachment behavior added on top of the bare
// providers: the composer "attach" actions, the message "Save as file"
// handler, and the supporting dialogs/device-upload input. <AiAgentProviders>
// calls this hook and wires the result into the composer config, platform save
// handler, and its rendered tree — so the integration lives in one place
// without a wrapper component.
export const useFilesIntegration = (): FilesIntegration => {
  const { t, i18n } = useTranslation(["Common"]);

  const [pickerVisible, setPickerVisible] = React.useState(false);
  const closePicker = React.useCallback(() => setPickerVisible(false), []);

  // Pending message-save request: holds the markdown content, default name, and
  // the resolver for the library's awaiting saveAsFile promise. Set when the
  // user clicks a message's Save button, cleared once they save or cancel.
  const [saveRequest, setSaveRequest] = React.useState<{
    content: string;
    defaultName: string;
    resolve: () => void;
  } | null>(null);

  const onSaveAsFile = React.useCallback<SaveAsFileHandler>(
    (content, defaultName) =>
      new Promise<void>((resolve) => {
        setSaveRequest({ content, defaultName, resolve });
      }),
    [],
  );

  const finishSave = React.useCallback(() => {
    setSaveRequest((prev) => {
      prev?.resolve();
      return null;
    });
  }, []);

  const deviceUploaderRef = React.useRef<DeviceUploaderHandle>(null);

  const composerActions = React.useMemo<ComposerAction[]>(
    () => [
      {
        id: "add-files-from-product",
        text: t("Common:AddFilesFromProduct", {
          productName: getBrandName("ProductName"),
          defaultValue: "Add files from {{productName}}",
        }),
        icon: <CatalogDocuments className={styles.composerActionIcon} />,
        onClick: () => setPickerVisible(true),
      },
      {
        id: "upload-from-device",
        text: t("Common:UploadFromDevice", {
          defaultValue: "Upload from device",
        }),
        icon: <UploadIcon className={styles.composerActionIcon} />,
        onClick: () => deviceUploaderRef.current?.open(),
      },
    ],
    [t, i18n.language],
  );

  const overlay = (
    <>
      {pickerVisible ? <AttachDialog onClose={closePicker} /> : null}
      {saveRequest ? (
        <SaveDialog
          content={saveRequest.content}
          defaultName={saveRequest.defaultName}
          onFinish={finishSave}
        />
      ) : null}
      <DeviceUploader ref={deviceUploaderRef} />
    </>
  );

  return { composerActions, onSaveAsFile, overlay };
};
