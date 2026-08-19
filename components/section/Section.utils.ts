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
import {
  SECTION_HEADER_NAME,
  SECTION_FILTER_NAME,
  SECTION_BODY_NAME,
  SECTION_FOOTER_NAME,
  SECTION_INFO_PANEL_BODY_NAME,
  SECTION_INFO_PANEL_HEADER_NAME,
  SECTION_CHAT_PANEL_NAME,
  SECTION_WARNING_NAME,
  SECTION_SUBMENU_NAME,
  SECTION_BANNER_NAME,
} from "./Section.constants";

export const parseChildren = (children: React.ReactNode) => {
  let sectionHeaderContent: React.JSX.Element | null = null;
  let sectionFilterContent: React.JSX.Element | null = null;
  let sectionBodyContent: React.JSX.Element | null = null;
  let sectionFooterContent: React.JSX.Element | null = null;
  let infoPanelBodyContent: React.JSX.Element | null = null;
  let infoPanelHeaderContent: React.JSX.Element | null = null;
  let chatPanelContent: React.JSX.Element | null = null;
  let sectionWarningContent: React.JSX.Element | null = null;
  let sectionSubmenuContent: React.JSX.Element | null = null;
  let sectionBannerContent: React.JSX.Element | null = null;

  React.Children.forEach(children as React.ReactElement[], (child: React.JSX.Element) => {
    if (!React.isValidElement(child)) return;

    const type = child.type as { displayName?: string; name?: string };

    const childType = type?.displayName || type?.name || "";

    const props = child.props as { children: React.JSX.Element };

    switch (childType) {
      case SECTION_HEADER_NAME:
        sectionHeaderContent = props.children;
        break;
      case SECTION_FILTER_NAME:
        sectionFilterContent = props.children;
        break;
      case SECTION_BODY_NAME:
        sectionBodyContent = props.children;
        break;
      case SECTION_FOOTER_NAME:
        sectionFooterContent = props.children;
        break;
      case SECTION_INFO_PANEL_BODY_NAME:
        infoPanelBodyContent = props.children;
        break;
      case SECTION_INFO_PANEL_HEADER_NAME:
        infoPanelHeaderContent = props.children;
        break;
      case SECTION_CHAT_PANEL_NAME:
        chatPanelContent = props.children;
        break;
      case SECTION_WARNING_NAME:
        sectionWarningContent = props.children;
        break;
      case SECTION_SUBMENU_NAME:
        sectionSubmenuContent = props.children;
        break;
      case SECTION_BANNER_NAME:
        sectionBannerContent = props.children;
        break;
      default:
        break;
    }
  });

  const arr = [
    sectionHeaderContent,
    sectionFilterContent,
    sectionBodyContent,
    sectionFooterContent,
    sectionWarningContent,
    infoPanelBodyContent,
    infoPanelHeaderContent,
    chatPanelContent,
    sectionSubmenuContent,
    sectionBannerContent,
  ];

  return arr;
};
