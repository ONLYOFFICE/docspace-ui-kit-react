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

import { DeviceType } from "../../enums";
import { TUser } from "../../types";

import { ContextMenuModel } from "../context-menu";

export type TToggleArticleOpen = () => void;

export type ArticleHeaderProps = {
  showText: boolean;
  children: React.ReactNode;
  onIconClick: () => void;
  onLogoClickAction?: () => void;
  isBurgerLoading: boolean;
  withCustomArticleHeader: boolean;
  currentDeviceType: DeviceType;
  showBackButton: boolean;
  navigate?: (path: string) => void;
  onBack?: () => void;
};


export type ArticleAppsProps = {
  showText: boolean;
  withDevTools: boolean;
  withCustomSlot: boolean;
  logoText: string;
  downloaddesktopUrl: string;
  officeforandroidUrl: string;
  officeforiosUrl: string;
};

export type ArticleHideMenuButtonProps = {
  showText: boolean;
  toggleShowText: VoidFunction;
  hideProfileBlock: boolean;
  withCustomSlot: boolean;
};

export type ArticleDevToolsBarProps = {
  showText: boolean;
  articleOpen: boolean;
  withCustomSlot: boolean;
  currentDeviceType: DeviceType;
  toggleArticleOpen: TToggleArticleOpen;
  path?: string;
  navigate?: (path: string) => void;
};

export type ArticleZendeskProps = {
  languageBaseName: string;
  zendeskEmail: string;
  chatDisplayName: string;
  withMainButton?: boolean;
  isMobileArticle: boolean;
  zendeskKey: string;
  showProgress: boolean;
  isShowLiveChat: boolean;
  isInfoPanelVisible?: boolean;
};

export type ArticleProfileProps = {
  user?: TUser;
  showText: boolean;
  getActions?: (
    t?: (key: string, options?: Record<string, string | number>) => string,
  ) => ContextMenuModel[];
  onProfileClick?: (obj: { originalEvent: React.MouseEvent }) => void;
  currentDeviceType: DeviceType;
};

export type ArticleProps = ArticleProfileProps &
  ArticleZendeskProps &
  ArticleHideMenuButtonProps &
  Omit<ArticleDevToolsBarProps, "withCustomSlot"> &
  Omit<ArticleHeaderProps, "children" | "onClick" | "onIconClick"> &
  Omit<ArticleAppsProps, "withDevTools" | "withCustomSlot"> & {
    setShowText: (value: boolean) => void;
    setIsMobileArticle: (value: boolean) => void;
    children: React.JSX.Element[];

    hideAppsBlock: boolean;

    setArticleOpen: (value: boolean) => void;
    withSendAgain: boolean;
    mainBarVisible: boolean;

    isLiveChatAvailable: boolean;

    showArticleLoader?: boolean;
    isAdmin: boolean;

    isNonProfit?: boolean;
    isGracePeriod?: boolean;
    isFreeTariff?: boolean;
    isPaymentPageAvailable?: boolean;
    isLicenseDateExpired?: boolean;
    isTrial?: boolean;
    standalone?: boolean;
    currentTariffPlanTitle?: string;
    trialDaysLeft?: number;

    limitedAccessDevToolsForUsers: boolean;
    customSlot?: React.ReactNode;
  };
