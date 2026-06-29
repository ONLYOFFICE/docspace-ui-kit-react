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

import { RefObject } from "react";
import { DeviceType } from "../../enums";
import { TGetContextMenuModel } from "../context-menu";
import type { HeaderType } from "../context-menu";

export type TOnBackToParenFolder = () => void;

export type TTitles = {
  infoPanel?: string;
  actions?: string;
  contextMenu?: string;
  warningText?: string;
  warningIcon?: string;
};

export type TContextButtonProps = {
  className: string;
  getData: TGetContextMenuModel;
  withMenu?: boolean;
  isTrashFolder?: boolean;
  isMobile: boolean;
  isMobileOnly?: boolean;
  id: string;
  title?: string;
  onCloseDropBox?: () => void;
  onContextOptionsClick?: () => void;
  contextButtonAnimation?: (
    setAnimationClasses: (classes: string[]) => void,
  ) => () => void;
  guidAnimationVisible?: boolean;
  setGuidAnimationVisible?: (visible: boolean) => void;
  ignoreChangeView?: boolean;
  contextMenuHeader?: HeaderType;
};

export type TPlusButtonProps = {
  className: string;
  getData: TGetContextMenuModel;
  withMenu?: boolean;
  id?: string;
  title?: string;
  onPlusClick?: VoidFunction;
  isFrame?: boolean;
  onCloseDropBox?: () => void;
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
};

export type TToggleInfoPanelButtonProps = {
  isRootFolder: boolean;
  isInfoPanelVisible: boolean;
  toggleInfoPanel: (e?: React.MouseEvent) => void;
  id?: string;
  titles?: TTitles;
};

export type TArrowButtonProps = {
  isRootFolder: boolean;
  showBackButton?: boolean;
  onBackToParentFolder: TOnBackToParenFolder;
};

export type TBadgesProps = {
  titleIcon: string;
  isRootFolder: boolean;
  titleIconTooltip?: string;
};

export type TTextProps = {
  title: string;
  isOpen: boolean;
  isRootFolder: boolean;
  isRootFolderTitle: boolean;
  onClick: () => void;
  className?: string;
  badgeLabel?: string;
  titleTooltip?: string;
};

export type TNavigationLogoProps = {
  logo?: string;
  burgerLogo: string;
  className: string;
  onClick?: () => void;
};

export type TOnNavigationItemClick = (
  id: string | number,
  isRootRoom: boolean,
  isRootTemplates?: boolean,
) => void;

export type TNavigationItemProps = {
  id: string | number;
  title: string;
  isRoot: boolean;
  isRootRoom: boolean;
  onClick: TOnNavigationItemClick;
  withLogo: boolean | string;
  currentDeviceType: DeviceType;
  style?: React.CSSProperties;
  isRootTemplates?: boolean;
};

export type TNavigationItem = {
  id: string | number;
  title: string;
  isRootRoom: boolean;
  isRootTemplates?: boolean;
};

export type TRowParam = {
  withLogo: boolean | string;
  currentDeviceType: DeviceType;
};

export type TRowData = [TNavigationItem[], TOnNavigationItemClick, TRowParam];

export type TControlButtonProps = Omit<TToggleInfoPanelButtonProps, "id"> &
  Omit<TPlusButtonProps, "getData" | "className"> &
  Omit<TContextButtonProps, "getData" | "className" | "id"> & {
    /** Controls visibility of PlusButton */
    canCreate: boolean;
    /** Used in ContextButton for folder options */
    getContextOptionsFolder: TGetContextMenuModel;
    /** Used in PlusButton for plus menu options */
    getContextOptionsPlus: TGetContextMenuModel;
    /** Controls visibility of ContextButton */
    isEmptyFilesList?: boolean;
    /** Used in toggleInfoPanelAction */
    toggleDropBox?: () => void;
    /** Controls visibility of ToggleInfoPanelButton */
    isDesktop: boolean;
    /** Controls visibility of ContextButton */
    isPublicRoom?: boolean;
    /** Used in styled component */
    showTitle?: boolean;
    /** Used for navigation button */
    navigationButtonLabel?: string;
    /** Used for navigation button click handler */
    onNavigationButtonClick?: () => void;
    /** Optional tariff bar element */
    tariffBar?: React.ReactElement;
    /** Controls visibility of TrashWarning */
    isEmptyPage?: boolean;
    /** Optional button shown in the header control area (e.g. Analyze responses for SubFolderDone) */
    analyzeResponsesButton?: React.ReactNode;
    /** Optional AI Chat trigger rendered in the header control area. */
    aiChatButton?: React.ReactNode;
    /** Optional "New chat" trigger rendered in the header control area (AI agent chat view). */
    newChatButton?: React.ReactNode;

    isMobile?: boolean;
    isMobileOnly?: boolean;
    /** Used for guidance */
    addButtonRef?: RefObject<HTMLDivElement | null>;
    buttonRef?: React.RefObject<HTMLButtonElement>;
    isContextButtonVisible?: boolean;
    isPlusButtonVisible?: boolean;
  };

export type TDropBoxProps = TArrowButtonProps &
  Omit<
    TControlButtonProps,
    | "isEmptyPage"
    | "tariffBar"
    | "onNavigationButtonClick"
    | "navigationButtonLabel"
    | "showTitle"
    | "isMobile"
    | "analyzeResponsesButton"
    | "aiChatButton"
    | "newChatButton"
  > &
  TRowParam & {
    ref?: React.RefObject<HTMLDivElement | null>;
    sectionHeight: number;
    dropBoxWidth: number;

    navigationItems: TNavigationItem[];
    onClickAvailable: TOnNavigationItemClick;
    isInfoPanelVisible: boolean;
    isDesktopClient: boolean;
    burgerLogo: string;
    navigationTitleContainerNode: React.ReactNode;
    onCloseDropBox: () => void;
    /** Controls rendering of title/header inside DropBox; defaults to true */
    showTitleInDropBox?: boolean;
  };

export type TNavigationProps = Omit<
  TDropBoxProps,
  | "dropBoxWidth"
  | "sectionHeight"
  | "onCloseDropBox"
  | "onClickAvailable"
  | "isDesktopClient"
  | "isTabletView"
  | "navigationTitleContainerNode"
> &
  Omit<TControlButtonProps, "isMobile"> &
  Omit<
    TTextProps,
    "isOpen" | "title" | "className" | "isRootFolderTitle" | "onClick"
  > & {
    showText: boolean;
    title: string;
    onClickFolder: TOnNavigationItemClick;

    clearTrash: () => void;
    showFolderInfo: () => void;
    isCurrentFolderInfo: boolean;

    isRoom: boolean;
    hideInfoPanel?: () => void;
    burgerLogo: string;
    showRootFolderTitle: boolean;
    titleIcon: string;
    rootRoomTitle: string;
    showNavigationButton: boolean;
    titleIconTooltip?: string;
    onLogoClick?: () => void;
    contextMenuHeader?: HeaderType;
    showBackButton?: boolean;
    titleTooltip?: string;
  };
