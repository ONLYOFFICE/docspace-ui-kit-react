import equal from "fast-deep-equal/react";
import React, { useMemo, memo, useCallback, isValidElement } from "react";

import classNames from "classnames";
import { isSeparator } from "../../utils/typeGuards";

import { Viewer } from "../Viewer";
import { getCustomToolbar, getPDFToolbar } from "../../MediaViewer.helpers";
import styles from "./ViewerWrapper.module.scss";
import { DropDown } from "../../../components/drop-down";
import { DropDownItem } from "../../../components/drop-down-item";
import type ViewerWrapperProps from "./ViewerWrapper.props";
import type { ContextMenuModel } from "../../../components/context-menu";

const ViewerWrapper = memo(
  (props: ViewerWrapperProps) => {
    const {
      isPdf,
      title,
      isAudio,
      isVideo,
      visible,
      fileUrl,
      isImage,
      playlist,
      audioIcon,
      targetFile,
      userAccess,
      errorTitle,
      headerIcon,
      playlistPos,
      isPreviewFile,
      currentDeviceType,
      isPublicFile,
      isDecrypting,
      decryptionError,
      autoPlay,

      onClose,
      onNextClick,
      onPrevClick,
      contextModel,
      onDeleteClick,
      onDownloadClick,
      onSetSelectionFile,
      pluginViewerContent,
    } = props;

    // const { interfaceDirection } = useTheme();
    // const isRtl = interfaceDirection === "rtl";

    const onClickContextItem = useCallback(
      (
        item: ContextMenuModel,
        event:
          | React.MouseEvent<Element, MouseEvent>
          | React.ChangeEvent<HTMLInputElement>,
      ) => {
        if (isSeparator(item)) return;

        onSetSelectionFile();
        item.onClick?.(event);
      },
      [onSetSelectionFile],
    );

    const generateContextMenu = (
      isOpen: boolean,
      right?: string,
      bottom?: string,
    ) => {
      const model = contextModel();

      if (model.filter((m) => !m.disabled).length === 0) return null;

      return (
        <DropDown
          className={styles.dropDown}
          open={isOpen}
          directionY="top"
          withBackdrop={false}
          isDefaultMode={false}
          directionX="right"
          manualY={`${bottom ?? 63}px`}
          manualX={`${right ?? -31}px`}
        >
          {model.map((item) => {
            if (item.disabled) return;
            const isItemSeparator = isSeparator(item);

            return (
              <DropDownItem
                className={classNames(
                  styles.dropDownItem,
                  `${item.isSeparator ? "is-separator" : ""}`,
                )}
                key={item.key}
                label={isItemSeparator ? undefined : item.label}
                icon={
                  isItemSeparator
                    ? ""
                    : isValidElement(item.iconNode)
                      ? item.iconNode
                      : (item.icon ?? "")
                }
                onClick={(event) => onClickContextItem(item, event)}
              />
            );
          })}
        </DropDown>
      );
    };

    const toolbar = useMemo(() => {
      const file = targetFile;
      const isEmptyContextMenu =
        contextModel().filter((item) => !item.disabled).length === 0;

      const customToolbar = isPdf
        ? getPDFToolbar()
        : file
          ? getCustomToolbar(
              file,
              isEmptyContextMenu,
              onDeleteClick,
              onDownloadClick,
            )
          : [];

      const currentItem = playlist?.[playlistPos];
      const canShare = currentItem?.canShare ?? false;

      const toolbars =
        !canShare && userAccess
          ? customToolbar.filter(
              (x) => x.key !== "share" && x.key !== "share-separator",
            )
          : customToolbar.filter((x) => x.key !== "delete");

      return toolbars;
    }, [
      isPdf,
      playlist,
      userAccess,
      targetFile,
      playlistPos,
      contextModel,
      onDeleteClick,
      onDownloadClick,
    ]);

    return (
      <Viewer
        title={title}
        isPdf={isPdf}
        fileUrl={fileUrl}
        isAudio={isAudio}
        isVideo={isVideo}
        visible={visible}
        isImage={isImage}
        toolbar={toolbar}
        autoPlay={autoPlay}
        playlist={playlist}
        audioIcon={audioIcon}
        errorTitle={errorTitle}
        headerIcon={headerIcon}
        targetFile={targetFile}
        playlistPos={playlistPos}
        isPreviewFile={isPreviewFile}
        currentDeviceType={currentDeviceType}
        isPublicFile={isPublicFile}
        isDecrypting={isDecrypting}
        decryptionError={decryptionError}
        onMaskClick={onClose}
        onNextClick={onNextClick}
        onPrevClick={onPrevClick}
        contextModel={contextModel}
        onDownloadClick={onDownloadClick}
        onSetSelectionFile={onSetSelectionFile}
        generateContextMenu={generateContextMenu}
        pluginViewerContent={pluginViewerContent}
      />
    );
  },
  (prevProps, nextProps) => equal(prevProps, nextProps),
);

ViewerWrapper.displayName = "ViewerWrapper";

export { ViewerWrapper };
