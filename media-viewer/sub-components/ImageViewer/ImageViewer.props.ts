import type { Dispatch, SetStateAction, JSX } from "react";

import type { getCustomToolbar } from "../../MediaViewer.helpers";
import type { DevicesType } from "../../MediaViewer.types";
import type { ContextMenuModel } from "../../../components/context-menu";

interface ImageViewerProps {
  src?: string;
  thumbnailSrc?: string;
  isDecodedImage?: boolean;
  isAnimatedImage?: boolean;
  imageId: number;
  version: number;
  errorTitle: string;
  isFistImage: boolean;
  isLastImage: boolean;
  panelVisible: boolean;
  backgroundBlack: boolean;
  isPublicFile?: boolean;
  mobileDetails?: JSX.Element;
  toolbar: ReturnType<typeof getCustomToolbar>;
  devices: DevicesType;

  onPrev?: VoidFunction;
  onNext?: VoidFunction;
  onMask?: VoidFunction;
  setBackgroundBlack: Dispatch<SetStateAction<boolean>>;
  contextModel: (isError?: boolean) => ContextMenuModel[];
  resetToolbarVisibleTimer: VoidFunction;
  setIsOpenContextMenu: Dispatch<SetStateAction<boolean>>;
  generateContextMenu: (
    isOpen: boolean,
    right?: string,
    bottom?: string,
  ) => JSX.Element | null;
}

export type { ImageViewerProps as default };
