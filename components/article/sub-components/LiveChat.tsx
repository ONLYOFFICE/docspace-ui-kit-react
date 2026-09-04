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
