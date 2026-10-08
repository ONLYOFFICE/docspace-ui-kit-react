"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import type { ComposerAction, ExportFormat } from "@onlyoffice/ai-chat";

import { getBrandName } from "../../../constants/brands";

import CatalogDocuments from "../../../assets/icons/16/catalog.documents.react.svg";
import UploadIcon from "../../../assets/icons/16/upload.react.svg";

import type { SaveAsFileHandler } from "../platform";

import DeviceUploader, { type DeviceUploaderHandle } from "./device-uploader";
import type { OnFilesAttached } from "./attach-files";
import AttachDialog from "./attach-dialog";
import SaveDialog from "./save-dialog";
import { EXPORT_FORMAT_IDS, EXTENSION_BY_FORMAT } from "./export-format";
import styles from "./styles.module.scss";

export type FilesIntegration = {
  // Composer "attach" actions (add files from the host / upload from device).
  composerActions: ComposerAction[];
  // Message "Save as file" handler, wired into platform.file.saveAsFile.
  onSaveAsFile: SaveAsFileHandler;
  // Thread export formats, wired into platform.file.getExportFormats.
  exportFormats: ExportFormat[];
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
    format?: string;
    resolve: () => void;
  } | null>(null);

  const onSaveAsFile = React.useCallback<SaveAsFileHandler>(
    (content, defaultName, format) =>
      new Promise<void>((resolve) => {
        setSaveRequest({ content, defaultName, format, resolve });
      }),
    [],
  );

  // Order matters — it is the order of the "Export to…" submenu. Labels are
  // ours, so the list is rebuilt on a language change. The extensions come
  // from the same table the save dialog names the file with: the library
  // builds its default file name from this `extension`, and the two drifting
  // apart would send the dialog a name it then "corrects".
  const exportFormats = React.useMemo<ExportFormat[]>(
    () => [
      {
        id: EXPORT_FORMAT_IDS.pdf,
        label: t("Common:ExportPdfDocument", { defaultValue: ".pdf document" }),
        extension: EXTENSION_BY_FORMAT[EXPORT_FORMAT_IDS.pdf],
      },
      {
        id: EXPORT_FORMAT_IDS.docx,
        label: t("Common:ExportDocxDocument", {
          defaultValue: ".docx document",
        }),
        extension: EXTENSION_BY_FORMAT[EXPORT_FORMAT_IDS.docx],
      },
      {
        id: EXPORT_FORMAT_IDS.md,
        label: t("Common:ExportMdFile", { defaultValue: ".md file" }),
        extension: EXTENSION_BY_FORMAT[EXPORT_FORMAT_IDS.md],
      },
    ],
    [t, i18n.language],
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
          defaultValue: "Add files from ONLYOFFICE",
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
          format={saveRequest.format}
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

  return { composerActions, onSaveAsFile, exportFormats, overlay };
};
