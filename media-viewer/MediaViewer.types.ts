import type { TFunction } from "i18next";

import type { TFile as TFileBase } from "../types";
import type { DeviceType } from "../enums";

/** A portal file as the viewer reads it: the kit's file plus the mark of an encrypted one. */
export type TFile = TFileBase & {
  /** The content is encrypted and goes through `decryptFile`. */
  encrypted?: boolean;
};

export type ContextMenuAction = (file: TFile, t: TranslationType) => void;

export type OmitSecondArg<F> = F extends (x: infer P, ...arg: never) => infer R
  ? (file: P) => R
  : F;

export type TranslationType = TFunction;

export type NumberOrString = number | string;

export type NullOrUndefined = null | undefined;

/** What the viewer hands to `decryptFile` for one encrypted playlist item. */
export type DecryptFileParams = {
  /** URL of the encrypted content. */
  src: string;
  /** ID of the file. */
  fileId: number;
  /** Title the playlist item carries. */
  title: string;
  /** Room the file belongs to, when the viewer knows one. */
  roomId?: number | string | null;
  /** Aborted when the viewer moves to another item or unmounts. */
  signal: AbortSignal;
};

/** The decrypted content `decryptFile` resolves with. */
export type DecryptedFile = {
  /** Decrypted bytes. */
  data: BlobPart;
  /** Real file name, when decryption recovered one. */
  fileName?: string;
};

export type DevicesType = {
  isMobile: boolean;
  isMobileOnly: boolean;
  isDesktop: boolean;
};

export type ContextFunctions = {
  onClickDownloadAs?: VoidFunction;
  onMoveAction?: VoidFunction;
  onCopyAction?: VoidFunction;
  onCopyLink?: ContextMenuAction;
  onClickDelete?: ContextMenuAction;
  onClickDownload?: ContextMenuAction;
  onClickRename?: OmitSecondArg<ContextMenuAction>;
  onDuplicate?: ContextMenuAction;
  onClickLinkEdit?: OmitSecondArg<ContextMenuAction>;
  onPreviewClick?: OmitSecondArg<ContextMenuAction>;
  onShowInfoPanel?: OmitSecondArg<ContextMenuAction>;
};

export type PlaylistType = {
  id: number;
  canShare: boolean;
  fileExst: string;
  fileId: number;
  fileStatus: number;
  src: string;
  title: string;
  thumbnailUrl: string;
  version: number;
  encrypted?: boolean;
};

export type BoundsType = {
  top: number;
  bottom: number;
  right: number;
  left: number;
};

export type Point = {
  x: number;
  y: number;
};

export type PluginContextMenuItem = {
  key: string;
  label: string;
  onClick: (id: number) => Promise<void>;
  icon: string;
  fileType?: ["video", "image"];
  withActiveItem?: boolean;
  items?: PluginContextMenuItem[];
};

export type MediaViewerProps = {
  /** Function for translating text. */
  t: TranslationType;
  /** List of media files to be displayed. */
  files: TFile[];
  /** Specifies whether the media viewer is visible. */
  visible: boolean;
  /** Position of the current file in the playlist. */
  playlistPos: number;
  /** Indicates if the current file is a preview. */
  isPreviewFile?: boolean;

  autoPlay?: boolean;

  isPublicFile?: boolean;
  /**
   * Current room id, passed to `decryptFile` as `roomId` when the file itself
   * names no room. `file.originRoomId` is only set when a file was moved out
   * of its room (Recent/Trash views); for files opened inside their home
   * private room the room comes from the caller's navigation state.
   */
  currentRoomId?: number | string | null;
  /**
   * Decrypts an encrypted playlist item. The viewer holds no cryptography of
   * its own: it calls this for every item marked `encrypted` and shows what
   * comes back. Resolve with `null` to close the viewer (the user gave up on
   * unlocking); reject to show the decryption error. Without it an encrypted
   * item shows the decryption error.
   */
  decryptFile?: (params: DecryptFileParams) => Promise<DecryptedFile | null>;
  /**
   * Returns the title to show for a playlist item, for a consumer that knows
   * a better one than the item carries (the decrypted name of an encrypted
   * file). Must be a stable reference.
   */
  resolveTitle?: (item: {
    id: number;
    title: string;
    encrypted?: boolean;
  }) => string;
  /**
   * Resolves the URL of the PDF viewer script. Without it a PDF item shows
   * the loading error.
   */
  getPdfViewerScriptUrl?: () => Promise<string>;
  /** Callback when decryption fails. */
  onDecryptionError?: (error: string) => void;
  /** List of playlists. */
  playlist: PlaylistType[];
  /** List of file extensions that can be previewed as images. */
  extsImagePreviewed: string[];
  /** ID of the current file. */
  currentFileId: NumberOrString;
  /** Function to get the icon for a file based on its size and extension. */
  getIcon: (size: number, ext: string, ...arg: unknown[]) => string;
  /** Type of the current device. */
  currentDeviceType?: DeviceType;
  /** Specifies whether the delete dialog is visible. */
  deleteDialogVisible?: boolean;
  /** Specifies whether the user has access. */
  userAccess?: boolean;
  /** ID of the archive room. */
  archiveRoomsId?: number;
  /** Context menu items for plugins. */
  pluginContextMenuItems?: PluginContextMenuItem[];
  /** Callback function called when the media viewer is closed. */
  onClose?: VoidFunction;
  /** Callback function called when an error occurs. */
  onError?: VoidFunction;
  /** Callback function to view the next media file. */
  nextMedia?: VoidFunction;
  /** Callback function to view the previous media file. */
  prevMedia?: VoidFunction;
  /** Callback function called on move action. */
  onMoveAction?: VoidFunction;
  /** Callback function called on copy action. */
  onCopyAction?: VoidFunction;
  /** Callback function called on copy link action. */
  onCopyLink?: ContextMenuAction;
  /** Callback function called on duplicate action. */
  onDuplicate?: ContextMenuAction;
  /** Callback function called on "Download As" action. */
  onClickDownloadAs?: VoidFunction;
  /** Callback function called on delete action. */
  onClickDelete?: ContextMenuAction;
  /** Callback function called on download action. */
  onClickDownload?: ContextMenuAction;
  /** Callback function called on an error when the playlist is empty. */
  onEmptyPlaylistError?: VoidFunction;
  /** Callback function called on delete action for a specific file. */
  onDelete?: (id: NumberOrString) => void;
  /** Callback function called on download action for a specific file. */
  onDownload?: (id: NumberOrString) => void;
  /** Callback function called when the URL changes for a specific file. */
  onChangeUrl?: (id: NumberOrString) => void;
  /** Callback function called on rename action. */
  onClickRename?: OmitSecondArg<ContextMenuAction>;
  /** Callback function called on preview click action. */
  onPreviewClick?: OmitSecondArg<ContextMenuAction>;
  /** Callback function called on link edit action. */
  onClickLinkEdit?: OmitSecondArg<ContextMenuAction>;
  /** Callback function called on show info panel action. */
  onShowInfoPanel?: OmitSecondArg<ContextMenuAction>;
  /** Function to set the buffer selection for a file. */
  setBufferSelection?: (file?: TFile | null) => void;
  /** Function to set the active files based on their IDs. */
  setActiveFiles?: (files: number[], destId?: number) => void;
  /** Custom plugin content to render in the media viewer. */
  pluginViewerContent?: React.ReactNode;
  /** File ID from plugin props (IMediaViewer.fileId). */
  pluginFileId?: number | string;
  /** Title from plugin props (IMediaViewer.title). */
  pluginTitle?: string;
};
