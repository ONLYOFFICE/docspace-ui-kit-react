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

import React, { useCallback, useEffect } from "react";

import { useInterfaceDirection } from "../../../context/InterfaceDirectionContext";
import { useTheme } from "../../../context/ThemeContext";
import { LIVE_CHAT_LOCAL_STORAGE_KEY } from "../../../constants";
import { Zendesk } from "../zendesk";
import { zendeskAPI } from "../zendesk/Zendesk.utils";
import { ArticleZendeskProps } from "../Article.types";

import { useCommonTranslation, getTranslationReady } from "../../../utils";

const baseConfig = {
  webWidget: {
    zIndex: 201,
    chat: {
      menuOptions: { emailTranscript: false },
    },
  },
};

const ArticleLiveChat = ({
  languageBaseName,
  zendeskEmail,
  chatDisplayName,
  withMainButton,
  isMobileArticle,
  zendeskKey,
  showProgress,
  isShowLiveChat,
  isInfoPanelVisible,
}: ArticleZendeskProps) => {
  const t = useCommonTranslation();
  const ready = getTranslationReady();
  const { currentColorScheme } = useTheme();
  const { isRTL } = useInterfaceDirection();
  const infoPanelOffset = isInfoPanelVisible ? 400 : 0;

  useEffect(() => {
    zendeskAPI.addChanges("webWidget", "updateSettings", {
      offset:
        withMainButton && isMobileArticle
          ? {
              horizontal: "68px",
              vertical: "11px",
            }
          : {
              horizontal: showProgress
                ? `${`${infoPanelOffset + 90}px`}`
                : `${`${infoPanelOffset + 4}px`}`,
              vertical: "11px",
            },
    });
  }, [
    withMainButton,
    isMobileArticle,
    showProgress,
    isInfoPanelVisible,
    infoPanelOffset,
  ]);

  useEffect(() => {
    zendeskAPI.addChanges("webWidget", "setLocale", languageBaseName);

    if (ready)
      zendeskAPI.addChanges("webWidget", "updateSettings", {
        launcher: {
          label: {
            "*": t("Support"),
          },
          chatLabel: {
            "*": t("Support"),
          },
        },
      });
  }, [languageBaseName, ready, t]);

  useEffect(() => {
    zendeskAPI.addChanges("webWidget", "updateSettings", {
      color: {
        theme: currentColorScheme?.main?.accent,
      },
    });
  }, [currentColorScheme?.main?.accent]);

  useEffect(() => {
    zendeskAPI.addChanges("webWidget", "prefill", {
      email: {
        value: zendeskEmail,
      },
      name: {
        value: chatDisplayName ? chatDisplayName.trim() : "",
      },
    });
  }, [zendeskEmail, chatDisplayName]);

  useEffect(() => {
    zendeskAPI.addChanges("webWidget", "updateSettings", {
      position: { horizontal: isRTL ? "left" : "right" },
    });
  }, [isRTL]);

  const onZendeskLoaded = useCallback(() => {
    const isShowChat =
      localStorage.getItem(LIVE_CHAT_LOCAL_STORAGE_KEY) === "true" || false;

    zendeskAPI.addChanges("webWidget", isShowChat ? "show" : "hide");
  }, []);

  return zendeskKey ? (
    <Zendesk
      defer
      zendeskKey={zendeskKey}
      onLoaded={onZendeskLoaded}
      config={baseConfig}
      isShowLiveChat={isShowLiveChat}
    />
  ) : null;
};

ArticleLiveChat.displayName = "LiveChat";

export default ArticleLiveChat;
