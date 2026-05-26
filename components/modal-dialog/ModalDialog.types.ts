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

import type { RefObject } from "react";
import { AsideHeaderProps } from "../aside";

import { ModalDialogType } from "./ModalDialog.enums";

export type ModalDialogTypeDetailed = {
  mobile: ModalDialogType;
  tablet: ModalDialogType;
  desktop: ModalDialogType;
};

export type ModalSubComponentsProps = AsideHeaderProps & {
  /** Reference to the modal element */
  ref?: RefObject<HTMLDivElement | null>;
  /** Reference to the inner sheet/content element (`<div id="modal-dialog">`) */
  sheetRef?: RefObject<HTMLDivElement | null>;
  /** Unique identifier for the modal */
  id?: string;
  /** Custom styles for the modal */
  style?: React.CSSProperties;
  /** Additional CSS classes */
  className?: string;
  /** Current display type of the modal (modal or aside) */
  currentDisplayType: ModalDialogType;
  /** **`ASIDE-ONLY`** Enables body scroll */
  withBodyScroll?: boolean;
  /** **`ASIDE-ONLY`** Locks the scroll in body section */
  isScrollLocked?: boolean;
  /** **`MODAL-ONLY`** Sets width: 520px and max-height: 400px */
  isLarge: boolean;
  /** **`MODAL-ONLY`** Sets predefined huge size */
  isHuge: boolean;
  /** CSS z-index for modal layering */
  zIndex?: number;
  /** **`MODAL-ONLY`** Sets max-height: auto */
  autoMaxHeight?: boolean;
  /** **`MODAL-ONLY`** Sets max-width: auto */
  autoMaxWidth?: boolean;
  /** Callback function when modal is closed */
  onClose: (e?: React.MouseEvent) => void;
  /** Shows loader in body */
  isLoading?: boolean;
  /** Content for the modal header */
  header?: React.ReactNode;
  /** Content for the modal body */
  body?: React.ReactNode;
  /** Content for the modal footer */
  footer?: React.ReactNode;
  /** Container content for aside mode */
  container?: React.ReactNode;
  /** Controls modal visibility */
  visible?: boolean;
  /** **`MODAL-ONLY`** Displays border between body and footer */
  withFooterBorder: boolean;
  /** Offset for modal swipe animation */
  modalSwipeOffset?: number;
  /** **`ASIDE-ONLY`** Allows embedding modal as aside dialog inside parent container */
  containerVisible?: boolean;
  /** Displays double line in footer */
  isDoubleFooterLine?: boolean;
  /** Sets the displayed dialog to be closed or open */
  isCloseable?: boolean;
  /**  Disables closing the modal when the backdrop is clicked */
  closeOnBackdropClick?: boolean;
  /** Enables embedded mode */
  embedded?: boolean;
  /** Wraps content in form element */
  withForm?: boolean;
  /** Form submit handler */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  /** Removes default padding from body */
  withoutPadding?: boolean;
  /** Removes default margin from header */
  withoutHeaderMargin?: boolean;
  /** Hides modal content */
  hideContent?: boolean;
  /** Sets backdrop blur value */
  blur?: number;
  /** Shows invite panel loader */
  isInvitePanelLoader?: boolean;
  /** Forces body scroll regardless of display type */
  withBodyScrollForcibly?: boolean;

  withBorder?: boolean;
  /** Test id */
  dataTestId?: string;

  scrollbarCreateContext?: boolean;
  /** Controls the visibility of the backdrop overlay */
  backdropVisible?: boolean;
};

export type ModalDialogProps = Partial<
  Omit<
    ModalSubComponentsProps,
    "currentDisplayType" | "header" | "body" | "footer" | "container"
  >
> & {
  /** Displays the child elements */
  children: (React.ReactElement | null)[] | React.ReactElement;
  /** Displays type */
  displayType?: ModalDialogType;
  /** Detailed display type for each dimension */
  displayTypeDetailed?: ModalDialogTypeDetailed;
  /** Test id */
  dataTestId?: string;
};

export type ModalDialogFormWrapperProps = {
  withForm: boolean;
  className?: string;
  children?: React.ReactNode;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
};

export type ModalDialogBackdropProps = {
  className?: string;
  children: React.ReactNode | React.ReactElement[] | React.ReactElement;
  zIndex?: number;
};
