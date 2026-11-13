import type { JSX } from "react";
import type { TFile } from "../../MediaViewer.types";
import type { DeviceType } from "../../../enums";
import type { getCustomToolbar } from "../../MediaViewer.helpers";
import type { PlaylistType } from "../../MediaViewer.types";
import type { ContextMenuModel } from "../../../components/context-menu";

interface ViewerProps {
  targetFile?: TFile;
  title: string;
  fileUrl?: string;
  isAudio: boolean;
  isVideo: boolean;
  visible: boolean;
  isImage: boolean;
  isPdf: boolean;
  autoPlay: boolean;
  playlist: PlaylistType[];

  audioIcon: string;
  errorTitle: string;
  headerIcon: string;
  toolbar: ReturnType<typeof getCustomToolbar>;
  playlistPos: number;
  isPreviewFile?: boolean;
  isPublicFile?: boolean;
  isDecrypting?: boolean;
  /** Localized reason shown in place of the media when decryption failed. */
  decryptionError?: string;

  currentDeviceType?: DeviceType;

  onMaskClick?: VoidFunction;
  onNextClick?: VoidFunction;
  onPrevClick?: VoidFunction;
  contextModel: (isError?: boolean) => ContextMenuModel[];
  onDownloadClick?: VoidFunction;
  generateContextMenu: (
    isOpen: boolean,
    right?: string,
    bottom?: string,
  ) => JSX.Element | null;
  onSetSelectionFile: VoidFunction;
  pluginViewerContent?: React.ReactNode;
}

export type { ViewerProps as default };
