import React, { memo, useEffect, useMemo, useRef, useState } from "react";

import DownloadReactSvgUrl from "../../../assets/icons/16/download.react.svg";
import MediaContextMenu from "../../../assets/icons/16/vertical-dots.react.svg";
import styles from "./PlayerDesktopContextMenu.module.scss";

import PlayerDesktopContextMenuProps from "./PlayerDesktopContextMenu.props";

const ContextRight = "9";
const ContextBottom = "48";

const PlayerDesktopContextMenu = memo(
  ({
    canDownload,
    isPreviewFile,
    hideContextMenu,
    onDownloadClick,
    generateContextMenu,
  }: PlayerDesktopContextMenuProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const [isOpenContext, setIsOpenContext] = useState<boolean>(false);

    const context = useMemo(
      () => generateContextMenu(isOpenContext, ContextRight, ContextBottom),
      [generateContextMenu, isOpenContext],
    );

    const toggleContext = () => setIsOpenContext((pre) => !pre);

    useEffect(() => {
      const listener = (event: MouseEvent | TouchEvent) => {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return;
        }
        setIsOpenContext(false);
      };
      document.addEventListener("mousedown", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
      };
    }, []);

    if (hideContextMenu && canDownload) {
      return (
        <div
          className={styles.downloadIconWrapper}
          onClick={onDownloadClick}
          data-testid="download-button"
          aria-label="Download file"
        >
          <DownloadReactSvgUrl role="presentation" />
        </div>
      );
    }
    if (isPreviewFile) return;

    if (!context) return;

    return (
      <div
        ref={ref}
        className={styles.playerDesktopContextMenuWrapper}
        onClick={toggleContext}
        data-testid="context-menu-button"
        aria-haspopup="menu"
        aria-expanded={isOpenContext}
        aria-label="Open context menu"
      >
        <MediaContextMenu role="presentation" />
        {context}
      </div>
    );
  },
);

PlayerDesktopContextMenu.displayName = "PlayerDesktopContextMenu";

export { PlayerDesktopContextMenu };
