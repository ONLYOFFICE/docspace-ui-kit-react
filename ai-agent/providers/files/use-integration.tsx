"use client";

import React from "react";
import { reaction } from "mobx";
import { useTranslation } from "react-i18next";
import type { ComposerAction, ExportFormat } from "@onlyoffice/ai-chat";

import { getBrandName } from "../../../constants/brands";

import CatalogDocuments from "../../../assets/icons/16/catalog.documents.react.svg";
import UploadIcon from "../../../assets/icons/16/upload.react.svg";

import type { SaveAsFileHandler } from "../platform";
import type { AiChatStore } from "../ai-chat-store";

import DeviceUploader, { type DeviceUploaderHandle } from "./device-uploader";
import type { OnFilesAttached } from "./attach-files";
import AttachDialog from "./attach-dialog";
import ContextFolderDialog from "./context-folder-dialog";
import ContextRoomsDialog, {
  type ContextRoomsKind,
} from "./context-rooms-dialog";
import SaveDialog from "./save-dialog";
import { CONTEXT_ROOM_CLOUD } from "../context-room/ContextRoomSync";
import { EXPORT_FORMAT_IDS, EXTENSION_BY_FORMAT } from "./export-format";
import styles from "./styles.module.scss";

export type FilesIntegration = {
  // Composer "attach" actions (add files from the host / upload from device).
  composerActions: ComposerAction[];
  // Opens the folder picker behind the composer's Context slot; unset where
  // the host does not offer folder context.
  onPickFolderContext?: () => void;
  // Opens the Instructions room picker behind the composer's skills slot.
  onPickContextRooms: () => void;
  // Opens the Knowledge room picker behind the composer's knowledge slot.
  onPickKnowledgeRooms: () => void;
  // Opens a connected Instructions or Knowledge room from the composer's
  // rooms menus.
  onOpenContextRoom: (
    cloud: string,
    room: { id: string; name: string },
  ) => void;
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
  aiChatStore,
}: {
  entityId?: string;
  // The panel store, whose `folderContextPickerEnabled` flag turns on the
  // composer's Context slot. Passed in: <AiAgentProviders> creates the store
  // itself and renders its provider below this hook's call.
  aiChatStore?: AiChatStore | null;
  // Reports every file attached through the dialog or a device upload, so the
  // caller can keep the record flags the attachments store drops
  // (`canAnalyze`).
  onFilesAttached?: OnFilesAttached;
} = {}): FilesIntegration => {
  const { t, i18n } = useTranslation(["Common"]);

  const [pickerVisible, setPickerVisible] = React.useState(false);
  const closePicker = React.useCallback(() => setPickerVisible(false), []);

  // The Context slot: any folder as the round's context, where the host asks
  // for it (see AiChatStore.folderContextPickerEnabled). Read off the panel
  // store so the entry follows the host's switch without a config rebuild.
  // <AiAgentProviders> is no observer, so the flag is mirrored into state.
  const [folderContextEnabled, setFolderContextEnabled] = React.useState(
    () => aiChatStore?.folderContextPickerEnabled ?? false,
  );
  React.useEffect(() => {
    if (!aiChatStore) return undefined;
    return reaction(
      () => aiChatStore.folderContextPickerEnabled,
      setFolderContextEnabled,
      { fireImmediately: true },
    );
  }, [aiChatStore]);
  const [contextPickerVisible, setContextPickerVisible] = React.useState(false);
  const closeContextPicker = React.useCallback(
    () => setContextPickerVisible(false),
    [],
  );

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
  // A room of this portal opens in Files; the chat panel stays as it is.
  const onOpenContextRoom = React.useCallback(
    (cloud: string, room: { id: string; name: string }) => {
      if (cloud !== CONTEXT_ROOM_CLOUD) return;
      // The address Files opens a room by: the bare `/rooms/shared/{id}`
      // carries no `folder` and lands on `/rooms/shared/undefined`.
      window.DocSpace?.navigate(
        `/rooms/shared/${room.id}/filter?folder=${room.id}`,
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

  const onPickFolderContext = React.useMemo(
    () =>
      folderContextEnabled ? () => setContextPickerVisible(true) : undefined,
    [folderContextEnabled],
  );

  const overlay = (
    <>
      {pickerVisible ? (
        <AttachDialog onClose={closePicker} onFilesAttached={onFilesAttached} />
      ) : null}
      {contextPickerVisible ? (
        <ContextFolderDialog onClose={closeContextPicker} />
      ) : null}
      {roomsPicker ? (
        <ContextRoomsDialog kind={roomsPicker} onClose={closeRoomsPicker} />
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

  return {
    composerActions,
    onPickFolderContext,
    onPickContextRooms,
    onPickKnowledgeRooms,
    onOpenContextRoom,
    onSaveAsFile,
    exportFormats,
    overlay,
  };
};
