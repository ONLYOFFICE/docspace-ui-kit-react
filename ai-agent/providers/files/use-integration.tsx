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
import ContextFolderDialog from "./context-folder-dialog";
import ContextRoomsDialog, {
  type ContextRoomsKind,
} from "./context-rooms-dialog";
import SaveDialog from "./save-dialog";
import CopyToRoomDialog, { type CopyToRoomFile } from "./copy-to-room-dialog";
import { CONTEXT_ROOM_CLOUD } from "../context-room/ContextRoomSync";
import { EXPORT_FORMAT_IDS, EXTENSION_BY_FORMAT } from "./export-format";
import styles from "./styles.module.scss";

export type FilesIntegration = {
  // Composer "attach" actions (add files from the host / upload from device).
  composerActions: ComposerAction[];
  // Opens the Instructions room picker behind the composer's skills slot.
  onPickContextRooms: () => void;
  // Opens the Knowledge room picker behind the composer's knowledge slot.
  onPickKnowledgeRooms: () => void;
  // Opens the folder picker that adds one more folder or room to the chat's
  // context (the "+" menu's Data sources).
  onAddContextFolder: () => void;
  // Opens a connected Instructions or Knowledge room from the composer's
  // rooms menus.
  onOpenContextRoom: (
    cloud: string,
    room: { id: string; name: string },
  ) => void;
  // Message "Save as file" handler, wired into platform.file.saveAsFile.
  onSaveAsFile: SaveAsFileHandler;
  // "Save to room..." on a file a reply produced: the folder selector, then
  // a copy of the file in the room or folder picked.
  onSaveToRoom: (file: CopyToRoomFile) => void;
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
  onSkillRoomsChange,
  roomsSectionAvailable = true,
}: {
  entityId?: string;
  // Reports every file attached through the dialog or a device upload, so the
  // caller can keep the record flags the attachments store drops
  // (`canAnalyze`).
  onFilesAttached?: OnFilesAttached;
  // Hears what the skills room picker connected and disconnected, for a host
  // that saves the chat's Skill sets (an AI project).
  onSkillRoomsChange?: (change: {
    added: { id: string; name: string }[];
    removed: string[];
  }) => void;
  // The Rooms section is on for the portal; with `false` the selectors do not
  // offer it (Bug 84833).
  roomsSectionAvailable?: boolean;
} = {}): FilesIntegration => {
  const { t, i18n } = useTranslation(["Common"]);

  const [pickerVisible, setPickerVisible] = React.useState(false);
  const closePicker = React.useCallback(() => setPickerVisible(false), []);

  // The room picker open for the skills or the knowledge slot; `null` while closed.
  const [roomsPicker, setRoomsPicker] = React.useState<ContextRoomsKind | null>(
    null,
  );
  const closeRoomsPicker = React.useCallback(() => setRoomsPicker(null), []);
  const onPickContextRooms = React.useCallback(
    () => setRoomsPicker("skills"),
    [],
  );
  const onPickKnowledgeRooms = React.useCallback(
    () => setRoomsPicker("knowledge"),
    [],
  );
  const [folderPickerVisible, setFolderPickerVisible] = React.useState(false);
  const closeFolderPicker = React.useCallback(
    () => setFolderPickerVisible(false),
    [],
  );
  const onAddContextFolder = React.useCallback(
    () => setFolderPickerVisible(true),
    [],
  );
  // A room of this portal opens in Files; the chat panel stays as it is.
  const onOpenContextRoom = React.useCallback(
    (cloud: string, room: { id: string; name: string }) => {
      if (cloud !== CONTEXT_ROOM_CLOUD) return;
      // The context and knowledge rooms are Instructions and Knowledge
      // rooms, which Files opens in the AI rooms section. The address needs
      // `folder`: without it Files lands on `.../undefined`.
      window.DocSpace?.navigate(
        `/ai-rooms/${room.id}/filter?folder=${room.id}`,
      );
    },
    [],
  );

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

  // The file "Save to room..." is copying; `null` while the selector is closed.
  const [copyRequest, setCopyRequest] = React.useState<CopyToRoomFile | null>(
    null,
  );
  const onSaveToRoom = React.useCallback(
    (file: CopyToRoomFile) => setCopyRequest(file),
    [],
  );
  const closeCopy = React.useCallback(() => setCopyRequest(null), []);

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
        <AttachDialog
          onClose={closePicker}
          onFilesAttached={onFilesAttached}
          withRoomsTreeFolder={roomsSectionAvailable}
        />
      ) : null}
      {roomsPicker ? (
        <ContextRoomsDialog
          kind={roomsPicker}
          onClose={closeRoomsPicker}
          onSkillRoomsChange={onSkillRoomsChange}
        />
      ) : null}
      {folderPickerVisible ? (
        <ContextFolderDialog
          mode="add"
          onClose={closeFolderPicker}
          withRoomsTreeFolder={roomsSectionAvailable}
        />
      ) : null}
      {saveRequest ? (
        <SaveDialog
          content={saveRequest.content}
          defaultName={saveRequest.defaultName}
          format={saveRequest.format}
          onFinish={finishSave}
          withRoomsTreeFolder={roomsSectionAvailable}
        />
      ) : null}
      {copyRequest ? (
        <CopyToRoomDialog
          file={copyRequest}
          onClose={closeCopy}
          withRoomsTreeFolder={roomsSectionAvailable}
        />
      ) : null}
      <DeviceUploader
        ref={deviceUploaderRef}
        entityId={entityId}
        onFilesAttached={onFilesAttached}
      />
    </>
  );

  return {
    composerActions,
    onPickContextRooms,
    onPickKnowledgeRooms,
    onAddContextFolder,
    onOpenContextRoom,
    onSaveAsFile,
    onSaveToRoom,
    exportFormats,
    overlay,
  };
};
