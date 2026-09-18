"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import type { ComposerAction } from "@onlyoffice/ai-chat";

import { getBrandName } from "../../../constants/brands";

import CatalogDocuments from "../../../assets/icons/16/catalog.documents.react.svg";
import UploadIcon from "../../../assets/icons/16/upload.react.svg";

import type { SaveAsFileHandler } from "../platform";

import DeviceUploader, { type DeviceUploaderHandle } from "./device-uploader";
import type { OnFilesAttached } from "./attach-files";
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
// without a wrapper component. `entityId` (the chat scope) is where device
// uploads land as portal files.
export const useFilesIntegration = ({
  entityId,
  onFilesAttached,
}: {
  entityId?: string;
  // Reports every file attached through the dialog or a device upload, so the
  // caller can keep the record flags the attachments store drops
  // (`canAnalyze`).
  onFilesAttached?: OnFilesAttached;
} = {}): FilesIntegration => {
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
      {pickerVisible ? (
        <AttachDialog onClose={closePicker} onFilesAttached={onFilesAttached} />
      ) : null}
      {saveRequest ? (
        <SaveDialog
          content={saveRequest.content}
          defaultName={saveRequest.defaultName}
          onFinish={finishSave}
        />
      ) : null}
      <DeviceUploader
        ref={deviceUploaderRef}
        entityId={entityId}
        onFilesAttached={onFilesAttached}
      />
    </>
  );

  return { composerActions, onSaveAsFile, overlay };
};
