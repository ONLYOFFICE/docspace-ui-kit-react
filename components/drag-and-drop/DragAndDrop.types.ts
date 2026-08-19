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

export interface DragAndDropProps {
  /** Children elements */
  children: React.ReactNode;
  /** Accepts class */
  className?: string;
  /** Sets the component as a dropzone */
  isDropZone?: boolean;
  /** Shows that the item is being dragged now. */
  dragging?: boolean;
  /** Indicates that dragging files to this element is not allowed */
  isDragDisabled?: boolean;
  /** Occurs when the mouse button is pressed */
  onMouseDown?: () => void;
  /** Occurs when the dragged element is dropped on the drop target */
  onDrop?: (acceptedFiles: File[]) => void;
  /** Sets a callback function that is triggered when a draggable selection is dragged over the target */
  onDragOver?: (isDragActive: boolean, e: React.DragEvent<HTMLElement>) => void;
  /** Sets a callback function that is triggered when a draggable selection leaves the drop target */
  onDragLeave?: (e: React.DragEvent<HTMLElement>) => void;
  /** Needs for selection area and DND work */
  value?: string;
  targetFile?: (file?: File | null) => void;
  style?: React.CSSProperties;
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
}
