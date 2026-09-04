import React from "react";
import classNames from "classnames";
import equal from "fast-deep-equal";
import { useDropzone } from "react-dropzone";

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

  const { getRootProps, isDragActive } = useDropzone({
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
    <div {...rest} className={rootClassName} {...getRootProps()}>
      {children}
    </div>
  );
};

export default React.memo(DragAndDrop, equal);
