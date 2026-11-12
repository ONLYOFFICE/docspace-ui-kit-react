import type { TFile } from "../../MediaViewer.types";
import type { DeviceType } from "../../../enums";
import type { PlaylistType } from "../../MediaViewer.types";
import type { ContextMenuModel } from "../../../components/context-menu";

interface ViewerWrapperProps {
  title: string;
  visible: boolean;
  fileUrl?: string;
  targetFile?: TFile;
  playlistPos: number;
  userAccess?: boolean;
  autoPlay: boolean;
  playlist: PlaylistType[];
  currentDeviceType?: DeviceType;

  isPdf: boolean;
  isImage: boolean;
  isAudio: boolean;
  isVideo: boolean;
  isPreviewFile?: boolean;
  isPublicFile?: boolean;
  isDecrypting?: boolean;
  decryptionError?: string;

  errorTitle: string;
  headerIcon: string;
  audioIcon: string;

  onClose?: VoidFunction;
  onPrevClick?: VoidFunction;
  onNextClick?: VoidFunction;
  onDeleteClick?: VoidFunction;
  onDownloadClick?: VoidFunction;

  onSetSelectionFile: VoidFunction;
  contextModel: (isError?: boolean) => ContextMenuModel[];
  pluginViewerContent?: React.ReactNode;
}

export default ViewerWrapperProps;
