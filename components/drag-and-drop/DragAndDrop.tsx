import React from "react";
import classNames from "classnames";
import equal from "fast-deep-equal";
import { useDropzone } from "../../utils/react-dropzone-interop";

import getFilesFromEvent from "../../utils/getFilesFromEvent";

import styles from "./DragAndDrop.module.scss";
import { DragAndDropProps } from "./DragAndDrop.types";

const DragAndDrop = (props: DragAndDropProps) => {
  const {
    isDropZone,
    children,
    dragging,
    className,
    isDragDisabled,

    onDragOver,
    onDrop,
    onDragLeave,

    ...rest
  } = props;

  const classNameProp = className || "";

  const onDropAction = (acceptedFiles: File[]) => {
    if (acceptedFiles.length) onDrop?.(acceptedFiles);
  };

  const onDragOverAction = (e: React.DragEvent<HTMLElement>) => {
    onDragOver?.(isDragActive, e);
  };

  const onDragLeaveAction = (e: React.DragEvent<HTMLElement>) => {
    onDragLeave?.(e);
  };

  // No file input is rendered here, so the keyboard has nothing to open: by
  // default the dropzone would still make the wrapper a focusable
  // role="button" around a whole section or row. It stays focusable from
  // script (tabIndex -1): the portal moves the focus to the section body after
  // a navigation so that the list's hotkeys apply.
  const { getRootProps, isDragActive } = useDropzone({
    noKeyboard: true,
    noDragEventsBubbling: !isDropZone,
    onDrop: onDropAction,
    onDragOver: onDragOverAction,
    onDragLeave: onDragLeaveAction,
    getFilesFromEvent: (event) => getFilesFromEvent(event),
  });

  const rootClassName = classNames(styles.dragAndDrop, classNameProp, {
    [styles.dragging]: dragging,
    [styles.dragAccept]: isDragActive,
    [styles.dragDisabled]: isDragDisabled,

    "drag-and-drop": true,
  });

  return (
    <div
      {...rest}
      className={rootClassName}
      {...getRootProps({ role: "presentation", tabIndex: -1 })}
    >
      {children}
    </div>
  );
};

export default React.memo(DragAndDrop, equal);
