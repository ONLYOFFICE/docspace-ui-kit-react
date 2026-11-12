import type { JSX } from "react";

interface PlayerDesktopContextMenuProps {
  generateContextMenu: (
    isOpen: boolean,
    right?: string,
    bottom?: string,
  ) => JSX.Element | null;
  canDownload: boolean;
  isPreviewFile?: boolean;
  hideContextMenu: boolean;
  onDownloadClick?: VoidFunction;
}

export default PlayerDesktopContextMenuProps;
