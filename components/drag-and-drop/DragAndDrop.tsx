/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
