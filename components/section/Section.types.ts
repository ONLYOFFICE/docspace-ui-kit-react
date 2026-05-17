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

import type { Operation } from "../operations-progress-button/OperationsProgressButton.types";
import { DeviceType } from "../../enums";
import { TViewAs, TUser, TFile, TFolder } from "../../types";

import { ContextMenuModel } from "../context-menu";

export type SubInfoPanelHeaderProps = {
  children: React.JSX.Element | null;
};

export type SubInfoPanelBodyProps = {
  children: React.JSX.Element | null;
  isInfoPanelScrollLocked?: boolean;
};

export type InfoPanelProps = {
  children: React.ReactNode;
  isVisible?: boolean;
  isMobileHidden?: boolean;
  setIsVisible?: (value: boolean) => void;
  canDisplay?: boolean;
  anotherDialogOpen?: boolean;
  viewAs?: TViewAs;
  currentDeviceType?: DeviceType;
  asideInfoPanel?: boolean;
  topInfoPanel?: boolean;
  onClose?: () => void;
};

export type SectionBodyContentProps = {
  children: React.ReactNode;
};

export type TOnDrop = (acceptedFiles: File[]) => void;

export type SectionBodyProps = {
  withScroll: boolean;
  autoFocus: boolean;
  onDrop?: TOnDrop;
  uploadFiles?: boolean;
  children: React.ReactNode;
  viewAs?: TViewAs;
  settingsStudio: boolean;

  isDesktop?: boolean;
  currentDeviceType?: DeviceType;
  getContextModel?: () => ContextMenuModel[];
  pathname?: string;
  isIndexEditingMode?: boolean;
  withoutFooter?: boolean;
  onDragLeaveEmpty?: () => void;
  onDragOverEmpty?: (isDragActive: boolean) => void;
  fullHeightBody?: boolean;
};

export type SectionContainerProps = {
  ref?: React.RefObject<HTMLDivElement | null>;
  isSectionHeaderAvailable: boolean;
  isInfoPanelVisible?: boolean;
  viewAs?: TViewAs;
  children: React.ReactNode;
  withBodyScroll: boolean;
  currentDeviceType?: DeviceType;
};

export type SectionFilterProps = {
  children: React.ReactNode;
  className?: string;
  withTabs?: boolean;
};

export type SectionFooterProps = {
  children: React.ReactNode;
};

export type SectionHeaderProps = {
  className: string;
  children: React.ReactNode;
};

export type SectionWarningProps = {
  children: React.ReactNode;
};

export type SectionSubmenuProps = {
  children: React.ReactNode;
};

export type SectionProps = Omit<SubInfoPanelHeaderProps, "children"> &
  Omit<SectionSubmenuProps, "children"> &
  Omit<SubInfoPanelBodyProps, "children"> &
  Omit<SectionWarningProps, "children"> &
  Omit<SectionFooterProps, "children"> &
  Omit<SectionFilterProps, "children" | "className"> &
  Omit<InfoPanelProps, "children" | "setIsVisible" | "isVisible"> &
  Omit<SectionHeaderProps, "children" | "className"> &
  Omit<SectionContainerProps, "children" | "isSectionHeaderAvailable"> &
  Omit<
    SectionBodyProps,
    "children" | "isSectionHeaderAvailable" | "autoFocus" | "withScroll"
  > & {
    children: React.JSX.Element[];
    progressBarDropDownContent?: React.ReactNode;
    onOpenUploadPanel?: () => void;
    isTabletView?: boolean;
    isHeaderVisible?: boolean;
    isInfoPanelAvailable?: boolean;
    isEmptyPage?: boolean;
    maintenanceExist?: boolean;
    snackbarExist?: boolean;
    showText?: boolean;
    isTrashFolder?: boolean;
    setIsInfoPanelVisible?: (value: boolean) => void;
    secondaryOperationsCompleted?: boolean;
    primaryOperationsCompleted?: boolean;
    secondaryActiveOperations?: Operation[];
    primaryOperationsArray?: Operation[];
    clearSecondaryProgressData?: (
      operationId?: string | null,
      operation?: string | null,
      operationItem?: Operation,
    ) => void;
    clearPrimaryProgressData?: (operation?: string | null) => void;
    cancelUpload?: () => void;
    cancelSecondaryOperationById?: (
      operation: string,
      operationId: string,
    ) => void;
    secondaryOperationsStopped?: boolean;
    secondaryOperationsAlert?: boolean;
    mainButtonVisible?: boolean;
    primaryOperationsAlert?: boolean;
    primaryOperationsCanceled?: boolean;
    needErrorChecking?: boolean;
    onCancelOperation?: (callback: () => void) => void;
    chatFiles?: (TFile | TFolder)[];
    aiChatIsVisible?: boolean;
    setAiChatIsVisible?: () => void;
    mainBarVisible?: boolean;

    getIcon?: (size: number, fileExst: string) => string;
    displayFileExtension?: boolean;
    aiChatID?: string;
    aiSelectedFolder?: string | number;
    aiUserId?: string;
    vectorizedFiles?: TFile[];
    user?: TUser;
    withTabs?: boolean;
    withoutFooter?: boolean;
    dragging?: boolean;
    dropTargetPreview?: string;
    clearDropPreviewLocation?: () => void;
    startDropPreview?: () => void;
    asideInfoPanel?: boolean;
    // Plugin operations props
    pluginOperations?: Operation[];
    pluginOperationsCompleted?: boolean;
    pluginOperationsAlert?: boolean;
    pluginShowCancelButton?: boolean;
  };

export type SectionContextMenuProps = {
  getContextModel?: () => ContextMenuModel[];
};
