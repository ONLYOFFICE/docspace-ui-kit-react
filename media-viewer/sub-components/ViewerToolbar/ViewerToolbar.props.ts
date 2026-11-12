import type { Dispatch, SetStateAction, JSX } from "react";
import type { getCustomToolbar } from "../../MediaViewer.helpers";

interface ImageViewerToolbarProps {
  ref?: React.RefObject<ImperativeHandle | null>;
  toolbar: ReturnType<typeof getCustomToolbar>;
  generateContextMenu: (
    isOpen: boolean,
    right?: string,
    bottom?: string,
  ) => JSX.Element | null;
  percentValue: number;
  setIsOpenContextMenu: Dispatch<SetStateAction<boolean>>;
  toolbarEvent: (item: ToolbarItemType) => void;
  className?: string;
}

export type ToolbarItemType = ReturnType<typeof getCustomToolbar>[number];

export type ImperativeHandle = {
  setPercentValue: (percent: number) => void;
};

export default ImageViewerToolbarProps;
